import { create } from "zustand"
import { toastObj } from "../lib/toast.js"
import toast from "react-hot-toast"
import apios from "../lib/axios.js"

const useUser = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        try {
            if (password.length < 4) {
                throw new Error("Password must be atleast 4 chars");
            }
    
            if (password != confirmPassword) {
                throw new Error("Passwords do not match");
            }

            toast.loading("Please wait...", toastObj);

            const response = await apios.post('/auth/signup', { name, email, password });
            set({ user: response.data.user });

            toast.success("Signup successful", toastObj);
        }
        catch(err) {
            toast.error(err.response?.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    login: async({ email, password }) => {
        set({ loading: true });

        try {
            toast.loading("Please wait...", toastObj);

            const response = await apios.post('/auth/login', { email, password });
            set({ user: response.data.user });

            toast.success("Login successful", toastObj);
        }
        catch(err) {
            toast.error(err.response?.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    logout: async() => {
        set({ loading: true });

        try {
            toast.loading("Please wait...", toastObj);

            await apios.post('/auth/logout');
            set({ user: null });

            toast.success("Logged out", toastObj);
        }
        catch(err) {
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    checkAuth: async() => {
        set({ checkingAuth: true });

        try {
            const response = await apios.get('/auth/profile');
            set({ user: response.data.user });
        }
        finally {
            set({ checkingAuth: false });
        }
    },
    
    refreshToken: async() => {
        if (get().checkingAuth) {
            return;
        }

        set({ checkingAuth: true });

        try {
            const response = await apios.post('/auth/refresh-token');
            return response.data;
        }
        catch(err) {
            console.log("Cannot verify");
        }
        finally {
            set({ checkingAuth: false });
        }
    }
}))

export default useUser


let refreshPromise = null;

apios.interceptors.response.use(
    (response) => {
        return response;
    },
    async(err) => {
        const originalRequest = err.config;

        if (err.response?.status == 401 && !originalRequest._retry)
        {
            originalRequest._retry = true;

            try {
                if (refreshPromise)
                {
                    await refreshPromise;
                    return apios(originalRequest);
                }

                refreshPromise = useUser.getState().refreshToken();
                await refreshPromise;

                refreshPromise = null;

                return apios(originalRequest);
            }
            catch(refreshErr) {
                toast.error("You must login again", toastObj);
            }
        }
        else
            return Promise.reject(err);
    }
)