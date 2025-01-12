import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"

import dbConnect from "./lib/database/db.js"
import cookieParser from "cookie-parser"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello world").status(200);
})

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, async() => {
    dbConnect();
    console.log("listening to server, port:", PORT);
})