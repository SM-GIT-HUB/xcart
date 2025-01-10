import productModel from "../lib/database/models/product.model.js"
import { redis } from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

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

async function createProduct(req, res)
{
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await productModel.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json({ product: {
            _id: product._id,
            name,
            description,
            price,
            image: product.image,
            category
        } })
    }
    catch(err) {
        console.log("error in createproduct:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function deleteProduct(req, res)
{
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image)
        {
            const imageId = product.image.split('/').pop().split('.')[0];

            try {
                await cloudinary.uploader.destroy(`products/${imageId}`);
                console.log("deleted image in cloudinary");
            }
            catch(err) {
                throw new Error("error in cloudinary delete");
            }
        }

        await productModel.deleteOne({ _id: product._id });
        res.status(200).json({ message: "Product deleted" });
    }
    catch(err) {
        console.log("error in createproduct:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export { getAllProducts, getFeaturedProducts, createProduct, deleteProduct }