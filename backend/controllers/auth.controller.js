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

        res.status(201).json({ user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    }
    catch(err) {
        console.log("error in signup:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function login(req, res)
{
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!(await user.comparePasswords(password))) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);
        await setRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    }
    catch(err) {
        console.log("error in login:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function logout(req, res)
{
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken)
        {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({ message: "Logged out" });
    }
    catch(err) {
        console.log("error in logout:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function refreshToken(req, res)
{
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedToken != refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV != "development",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        res.status(201).json({ message: "Token refreshed" });
    }
    catch(err) {
        console.log("error in refreshToken:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function getProfile(req, res)
{
    try {
        res.status(200).json({ user: req.user });
    }
    catch(err) {
        console.log("error in getprofile:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export { signup, login, logout, refreshToken, getProfile }