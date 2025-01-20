import productModel from "../lib/database/models/product.model.js"

async function addToCart(req, res)
{
    try {
        const { productId } = req.body;
        const user = req.user;

        const item = user.cartItems.find((it) => it.product.toString() == productId);

        if (item) {
            item.quantity += 1;
        }
        else {
            user.cartItems.push({ quantity: 1, product: productId });
        }

        await user.save();

        await user.populate("cartItems.product");

        res.status(202).json({ message: "cart updated", cartItems: user.cartItems })
    }
    catch(err) {
        console.log("error in addtocart:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function removeFromCart(req, res)
{
    try {
        const { productId } = req.body;
        const user = req.user;

        if (productId)
        {
            user.cartItems = user.cartItems.filter((it) => it.product.toString() != productId);
            await user.save();
        }

        await user.populate("cartItems.product");

        res.status(200).json({ message: "Product deleted from cart", cartItems: user.cartItems });
    }
    catch(err) {
        console.log("error in removefromcart:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function updateQuantity(req, res)
{
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const item = user.cartItems.find((it) => it.product.toString() == productId);

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        if (quantity == 0) {
            user.cartItems.filter((it) => it.product.toString() != productId);
        }
        else if (quantity > 1) {
            item.quantity = quantity;
        }

        await user.save();

        await user.populate("cartItems.product");

        res.status(202).json({ message: "cart updated", cartItems: user.cartItems });
    }
    catch(err) {
        console.log("error in updateQuantity:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function getCartProducts(req, res)
{
    try {
        const user = req.user;
        await user.populate("cartItems.product");

        res.status(200).json({ cartItems: user.cartItems });
    }
    catch(err) {
        console.log("error in getcart:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export { addToCart, removeFromCart, updateQuantity, getCartProducts }