import express from "express"
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js"
import { analyticsData } from "../controllers/analytics.controller.js"

const router = express.Router();

router.get('/', protectRoute, adminRoute, analyticsData);


export default router