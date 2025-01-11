import couponModel from "../lib/database/models/coupon.model.js"

async function getCoupon(req, res)
{
    try {
        const coupon = await couponModel.findOne({ userId: req.user._id, isActive: true });
        res.status(200).json({ coupon: coupon || null });
    }
    catch(err) {
        console.log("error in getcoupon:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function validateCoupon(req, res)
{
    try {
        const { code } = req.body;
        const coupon = await couponModel.findOne({ code, userId: req.user._id, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Enter valid coupon code / coupon may have expired" });
        }

        if (coupon.expirationDate < new Date())
        {
            coupon.isActive = false;
            await coupon.save();

            return res.status(404).json({ message: "Coupon expired" });
        }

        res.status(200).json({ message: "Coupon valid", code, discount: coupon.discountPercentage });
    }
    catch(err) {
        console.log("error in validatecoupon:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export { getCoupon, validateCoupon }