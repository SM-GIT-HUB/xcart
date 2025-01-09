import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"

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

app.listen(PORT, async() => {
    dbConnect();
    console.log("listening to server, port:", PORT);
})