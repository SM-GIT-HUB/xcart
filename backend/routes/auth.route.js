import express from "express"
import { login, logout, refreshToken, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);
router.post('/refresh-token', refreshToken);


export default router