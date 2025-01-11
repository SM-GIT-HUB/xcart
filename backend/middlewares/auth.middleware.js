import jwt from "jsonwebtoken"
import userModel from "../lib/database/models/user.model.js"

async function protectRoute(req, res, next)
{
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "No auth-token provided" });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await userModel.findById(decoded.userId).select("_id email name cartItems role");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;
            next();
        }
        catch(err) {
            return res.status(401).json({ message: "Not verified, please login again" });
        }
    }
    catch(err) {
        console.log("error in protectRoute:", err.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

function adminRoute(req, res, next)
{
    if (req.user && req.user.role == "admin") {
        next();
    }
    else {
        return res.status(403).json({ message: "Access denied" });
    }
}


export { protectRoute, adminRoute }