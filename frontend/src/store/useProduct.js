import { create } from "zustand"
import { toastObj } from "../lib/toast.js"
import toast from "react-hot-toast"
import apios from "../lib/axios.js"

const useProduct = create((set, get) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({ products }),

    createProduct: async(newProduct) => {
        set({ loading: true });

        try {
            toast.loading("Please wait...", toastObj);

            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("description", newProduct.description);
            formData.append("price", newProduct.price);
            formData.append("category", newProduct.category);

            if (newProduct.image) {
                formData.append("image", newProduct.image);
            }

            const response = await apios.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            set({ products: [...get().products, response.data.product] });

            toast.dismiss();
            toast.success("Product created", toastObj);
        }
        catch(err) {
            toast.dismiss();
            toast.error(err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    }
}))


export default useProduct