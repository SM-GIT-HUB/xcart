import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ "hey" : "hello world" });
})

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("listening to server, port:", PORT);
})