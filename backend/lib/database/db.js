import mongoose from "mongoose"

async function dbConnect()
{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/xcart");
        console.log("connected to database", conn.connection.host);
    }
    catch(err) {
        console.log("error in dbConnect:", err.message);
    }
}


export default dbConnect