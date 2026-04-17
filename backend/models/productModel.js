import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    default: "",
  },
  sizes: {
    type: Array,
    required: true,
  },
  bestSeller: {
    type: Boolean,
  },
  shippingFee: {
    type: Number,
    default: 200,
  },
  date: {
    type: Number,
    required: true,
  },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
