import couponModel from "../lib/database/models/coupon.model.js"
import orderModel from "../lib/database/models/order.model.js"
import { stripe } from "../lib/stripe.js"
import "dotenv/config"

async function createCheckoutSession(req, res)
{
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length == 0) {
            return res.status(400).json({ message: "Invalid or empty products array" });
        }

        let totalAmount = 0;

        const lineItems = products.map((p) => {
            const amount = Math.round(p.price * 100);
            totalAmount += amount * p.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: p.name,
                        image: [p.image]
                    },
                    unit_amount: amount
                },
                quantity: p.quantity
            }
        })

        let coupon = null;

        if (couponCode)
        {
            coupon = await couponModel.findOne({ code: couponCode, userId: req.user._id, isActive: true });

            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: coupon?.code || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        product: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }))
                )
            }
        })

        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        res.status(201).json({ id: session.id, totalAmount: totalAmount / 100 });
    }
    catch(err) {
        console.log("error in createcheckoutsession:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function checkoutSuccess(req, res)
{
    try {
        const { sessionId } = req.body;
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status == "paid")
        {
            if (session.metadata.couponCode) {
                await couponModel.findOneAndDelete({ code: session.metadata.couponCode, userId: session.metadata.userId });
            }

            const products = JSON.parse(session.metadata.products);

            const newOrder = await orderModel.create({
                user: session.metadata.userId,
                products,
                totalAmount: session.amount_total / 100,
                stripeSessionId: session.id
            })

            res.status(201).json({ success: true, message: "Payment successful, order placed", orderId: newOrder._id });
        }
        else
            res.status(400).json({ message: "Couldn't place order" });
    }
    catch(err) {
        console.log("error in checkoutSuccess:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

//these belong to createCheckoutSession
async function createStripeCoupon(perc)
{
    const coupon = await stripe.coupons.create({
        percent_off: perc,
        duration: "once"
    })

    return coupon.id;
}

async function check(code)
{
    const coupon = await couponModel.findOne({ code });

    if (coupon) {
        return true;
    }
    else
        return false;
}

async function createNewCoupon(userId)
{
    let code = "";

    do {
        code = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (await check(code));

    const newCoupon = await couponModel.create({
        code,
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId
    })

    return newCoupon;
}
//these belong to createCheckoutSession


export { createCheckoutSession, checkoutSuccess }