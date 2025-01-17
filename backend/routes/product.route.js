import express from "express"
import multer from "multer"
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/product.controller.js"
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js"

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
})

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommendations', getRecommendedProducts);
router.get('/category/:category', getProductsByCategory);
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct);
router.post('/', protectRoute, adminRoute, upload.single("image"), createProduct);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);


export default router