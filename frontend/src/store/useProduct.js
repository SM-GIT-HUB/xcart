import { create } from "zustand"
import { toastObj } from "../lib/toast.js"
import toast from "react-hot-toast"
import apios from "../lib/axios.js"

const useProduct = create((set, get) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({ products }),
    
    createProduct: async(newProduct) => {
        const { name, description, price, category } = newProduct;
        
        if (!name || !description || !price || !category || !newProduct.image) {
            return toast.error("Please fill in all details");
        }
        
        set({ loading: true });

        try {
            toast.loading("Please wait...", toastObj);

            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("description", newProduct.description);
            formData.append("price", newProduct.price);
            formData.append("category", newProduct.category);
            formData.append("image", newProduct.image);

            const response = await apios.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            set({ products: [...get().products, response.data.product] });

            toast.success("Product created", toastObj);
        }
        catch(err) {
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },
    
    fetchAllProducts: async() => {
        set({ loading: true });

        try {
            const response = await apios.get('/products');
            set({ products: response.data.products });
        }
        catch(err) {
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    fetchProductsByCategory: async(category, setLoading) => {
        set({ loading: true });

        try {
            const response = await apios.get(`/products/category/${category}`);
            set({ products: response.data.products });
            setLoading(false);
        }
        catch(err) {
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    deleteProduct: async(productId) => {
        set({ loading: true });

        try {
            toast.loading("Please wait...", toastObj);

            await apios.delete(`/products/${productId}`);

            const products = get().products.filter((p) => (p._id != productId));
            set({ products });

            toast.success("Product deleted", toastObj);
        }
        catch(err) {
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    toggleFeaturedProduct: async(productId) => {
        set({ loading: true });

        try {
            const response = await apios.patch(`/products/${productId}`);

            let isFeatured = false;

            const products = get().products.map((p) => {
                if (p._id == productId)
                {
                    isFeatured = response.data.product.isFeatured;
                    return response.data.product;
                }
                else
                    return p;
            })

            set({ products });
            toast.success(`Featured ${isFeatured? "on" : "off"}`, toastObj);
        }
        catch(err) {
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    }
}))


export default useProduct