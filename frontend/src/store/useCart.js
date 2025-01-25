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
    isCouponApplied: false,

    getMyCoupon: async() => {
        try {
            const response = await apios.get('/coupons');
            set({ coupon: response.data.coupon });
        }
        catch(err) {
            toast.error(err.response?.data?.message || err.message, toastObj);
        }
    },

    applyCoupon: async(code) => {
        try {
            await apios.post('/coupons/validate', { code });
            set({ isCouponApplied: true });
            get().calculateTotal();

            toast.success("Coupon applied", toastObj);
        }
        catch(err) {
            toast.error(err.response?.data?.message || err.message, toastObj);
        }
    },

    removeCoupon: () => {
        set({ isCouponApplied: false });
        get().calculateTotal();
        toast.success("Coupon removed", toastObj);
    },

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
            }) : [ ...cart, { product, quantity: 1 } ]

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

    updateQuantity: async(productId, quantity) => {
        try {
            if (quantity == 0) {
                return get().removeFromCart(productId);
            }

            await apios.put(`/cart/${productId}`, { quantity });

            const cart = get().cart.map((it) => {
                return (it.product._id == productId)? { ...it, quantity } : it;
            })

            set({ cart });
            get().calculateTotal();

            toast.success("Updated your cart", toastObj);
        }
        catch(err) {
            toast.error(err?.response?.data?.message || err.message, toastObj);
        }
    },

    removeFromCart: async(productId) => {
        set({ loading: true });

        try {
            toast.loading("Please wait...", toastObj);
            await apios.delete('/cart', { data: { productId } });

            const cart = get().cart.filter((it) => it.product._id != productId);
            set({ cart });
            get().calculateTotal();

            toast.success("Product removed", toastObj);
        }
        catch(err) {
            toast.error(err?.response?.data?.message || err.message, toastObj);
        }
        finally {
            set({ loading: false });
        }
    },

    calculateTotal: () => {
        const { cart, coupon, isCouponApplied } = get();
        const subTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        let total = subTotal;

        if (coupon && isCouponApplied)
        {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }

        set({ subTotal, total });
        return { subTotal, total };
    },

    clearCart: async() => {
        try {
            await apios.put('/cart/clear-cart');

            set({ cart: [], coupon: null, total: 0, subTotal: 0, isCouponApplied: false });
        }
        catch(err) {
            console.log(err.response?.data?.message || err.message);
        }
    }
}))


export default useCart