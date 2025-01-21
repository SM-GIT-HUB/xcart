import { create } from "zustand"
import { toastObj } from "../lib/toast.js"
import toast from "react-hot-toast"
import apios from "../lib/axios.js"

const useCart = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    loading: false,

    getCartItems: async() => {
        set({ loading: true });

        try {
            const response = await apios.get('/cart');
            set({ cart: response.data.cartItems });
            get().calculateTotal();
        }
        catch(err) {
            set({ cart: [] });
            toast.error(err.response.data.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    addToCart: async(product) => {
        set({ loading: true });

        try {
            await apios.post('/cart', { productId: product._id });

            let cart = get().cart;
            
            const item = cart.find((it) => it.product._id == product._id);

            cart = item? cart.map((it) => {
                if (it.product._id == product._id) {
                    return { ...it, quantity: it.quantity + 1 };
                }
                else
                    return it;
            }) : [ ...cart, { ...product, quantity: 1 } ]

            set({ cart });
            get().calculateTotal();

            toast.success("Product added", toastObj);
        }
        catch(err) {
            toast.error(err.response?.data?.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    updateQuantity: async(productId, quantity) => {},

    removeFromCart: async(productId) => {},

    calculateTotal: () => {
        const { cart, coupon } = get();
        const subTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        let total = subTotal;

        if (coupon)
        {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }

        set({ subTotal, total });
        return { subTotal, total };
    }
}))


export default useCart