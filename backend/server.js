import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import dbConnect from "./lib/database/db.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world").status(200);
})

app.use("/api/auth", authRoutes);

app.listen(PORT, async() => {
    dbConnect();
    console.log("listening to server, port:", PORT);
})