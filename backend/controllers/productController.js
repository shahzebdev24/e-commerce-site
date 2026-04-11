import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// INFO: Route for adding a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const productImages = [image1, image2, image3, image4].filter(
      (image) => image !== undefined
    );

    let imageUrls = await Promise.all(
      productImages.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      image: imageUrls,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product added" });
  } catch (error) {
    console.log("Error while adding product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error while fetching all products: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for updating a product (partial image replace by slot)
const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let images = [0, 1, 2, 3].map((i) => product.image[i] || "");

    for (let i = 0; i < 4; i++) {
      const key = `image${i + 1}`;
      const file = req.files?.[key]?.[0];
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        images[i] = result.secure_url;
      }
    }

    images = images.filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image",
      });
    }

    await productModel.findByIdAndUpdate(productId, {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" || bestSeller === true,
      image: images,
    });

    res.status(200).json({ success: true, message: "Product updated" });
  } catch (error) {
    console.log("Error while updating product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for removing a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log("Error while removing product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching a single product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error while fetching single product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
  updateProduct,
};
