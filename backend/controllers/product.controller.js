import productModel from "../lib/database/models/product.model.js"
import { redis } from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"
import { Readable } from "stream";

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
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }

        const { name, description, price, category } = req.body;

        let imageUrl = "";

        if (!name || !description || !price || !category || !req.file) {
            return res.status(404).json({ message: "Please fill in all the details" });
        }

        const readableStream = Readable.from(req.file.buffer);

        await new Promise((resolve, reject) => {
            const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (err, result) => {
                    if (err) {
                        return reject(new Error(err.message));
                    }
                    imageUrl = result.secure_url;
                    resolve();
                }
            )

            readableStream.pipe(cloudinaryUploadStream);
        })

        // if (image) {
        //     cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        // }

        const product = await productModel.create({
            name,
            description,
            price,
            image: imageUrl,
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
        console.log("error in deleteproduct:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function getRecommendedProducts(req, res)
{
    try {
        const products = await productModel.aggregate([
            { $sample: { size: 3 } },
            { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } }
        ])
    }
    catch(err) {
        console.log("error in getrecommended:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function getProductsByCategory(req, res)
{
    try {
        const { category } = req.params;

        const products = await productModel.find({ category }).lean();
        res.status(200).json({ products });
    }
    catch(err) {
        console.log("error in getproductsbycategory:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function toggleFeaturedProduct(req, res)
{
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.isFeatured = !product.isFeatured;
        await product.save();

        await updateFeaturedProductsCache();

        res.status(200).json({ product });
    }
    catch(err) {
        console.log("error in togglefeatured:", err.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

async function updateFeaturedProductsCache()
{
    try {
        const products = await productModel.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(products));
    }
    catch(err) {
        console.log("error in updateFeaturedcache:", err.message);
    }
}


export { getAllProducts, getFeaturedProducts, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct, createProduct, deleteProduct }