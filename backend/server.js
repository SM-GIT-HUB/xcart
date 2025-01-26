import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
import path from "path"

import dbConnect from "./lib/database/db.js"
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

if (process.env.NODE_ENV != "development")
{
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, async() => {
    await dbConnect();
    console.log("listening to server, port:", PORT);
})