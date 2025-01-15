/* eslint-disable no-unused-vars */
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
        toast.dismiss();

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

            toast.dismiss();
            toast.success("Signup successful", toastObj);
        }
        catch(err) {
            toast.dismiss();
            toast.error(err.response?.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    login: async({ email, password }) => {
        set({ loading: true });
        toast.dismiss();

        try {
            toast.loading("Please wait...", toastObj);

            const response = await apios.post('/auth/login', { email, password });
            set({ user: response.data.user });

            toast.dismiss();
            toast.success("Login successful", toastObj);
        }
        catch(err) {
            toast.dismiss();
            toast.error(err.response?.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    logout: async() => {
        set({ loading: true });
        toast.dismiss();

        try {
            toast.loading("Please wait...", toastObj);

            await apios.post('/auth/logout');
            set({ user: null });

            toast.dismiss();
            toast.success("Logged out", toastObj);
        }
        catch(err) {
            toast.dismiss();
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
    } 
}))

export default useUser