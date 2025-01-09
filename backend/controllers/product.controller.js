import productModel from "../lib/database/models/product.model.js"
import { redis } from "../lib/redis.js"

async function getAllProducts(req, res)
{
    try {
        const products = await productModel.find();
        res.status(200).json({ products });
    }
    catch(err) {
        console.log("error in getAllProducts:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function getFeaturedProducts(req, res)
{
    try {
        let featuredProducts = await redis.get("featured_products");

        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        featuredProducts = await productModel.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.status(200).json({ featuredProducts });
    }
    catch(err) {
        console.log("error in getFeaturedProducts:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export { getAllProducts, getFeaturedProducts }