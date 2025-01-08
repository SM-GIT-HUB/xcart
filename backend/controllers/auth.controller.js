import userModel from "../lib/database/models/user.model.js"
import jwt from "jsonwebtoken"
import { redis } from "../lib/redis.js"

function generateTokens(userId)
{
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })

    return { accessToken, refreshToken };
}

async function setRefreshToken(userId, refreshToken)
{
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

function setCookies(res, accessToken, refreshToken)
{
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV != "development",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV != "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

async function signup(req, res)
{
    try {
        const { email, password, name } = req.body;
        console.log(email, password, name);

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Please provide all the details" });
        }

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await userModel.create({ name, email, password });
        
        const { accessToken, refreshToken } = generateTokens(newUser._id);
        
        await setRefreshToken(newUser._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({ user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, message: "Signup successful" });
    }
    catch(err) {
        console.log("error in signup:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function login(req, res)
{
    res.send("Login route");
}

async function logout(req, res)
{
    res.send("Logout route");
}


export { signup, login, logout }