import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const categoryOptions = [
  "Health & Care",
  "Beauty & Care",
  "Fashion & Design",
  "Jewellery",
];

/** Legacy DB category values → admin form values */
const dbToFormCategory = {
  Medicine: "Health & Care",
  Cosmetics: "Beauty & Care",
  Cloth: "Fashion & Design",
  "Beauty Core": "Beauty & Care",
  Jewelry: "Jewellery",
};

const Add = ({ token }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [existingUrls, setExistingUrls] = useState(["", "", "", ""]);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const isFashionCategory = category === "Fashion & Design";

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setExistingUrls(["", "", "", ""]);
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
  };

  useEffect(() => {
    if (!productId) {
      resetForm();
      setLoadingProduct(false);
      return;
    }

    setLoadingProduct(true);

    const load = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/product/single", {
          productId,
        });

        if (!response.data.success || !response.data.product) {
          toast.error(response.data.message || "Product not found");
          navigate("/list");
          return;
        }

        const p = response.data.product;
        const formCat = dbToFormCategory[p.category] || p.category;
        setName(p.name || "");
        setDescription(p.description || "");
        setCategory(formCat);
        setSubCategory(p.subCategory || "");
        setPrice(String(p.price ?? ""));
        setSizes(Array.isArray(p.sizes) ? p.sizes : []);
        setBestSeller(Boolean(p.bestSeller));
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        const imgs = p.image || [];
        setExistingUrls([0, 1, 2, 3].map((i) => imgs[i] || ""));
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load product");
        navigate("/list");
      } finally {
        setLoadingProduct(false);
      }
    };

    load();
  }, [productId, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", isFashionCategory ? subCategory : "");
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      if (isEditMode) {
        formData.append("productId", productId);
        const response = await axios.post(
          backendUrl + "/api/product/update",
          formData,
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/list");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          backendUrl + "/api/product/add",
          formData,
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          resetForm();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const preview = (file, index) =>
    file
      ? URL.createObjectURL(file)
      : existingUrls[index] || assets.upload_area;

  if (isEditMode && loadingProduct) {
    return (
      <p className="text-lg text-gray-600">Loading product…</p>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start w-full gap-3"
    >
      <h1 className="mb-2 text-2xl font-semibold text-gray-800">
        {isEditMode ? "Edit product" : "Add product"}
      </h1>
      <div>
        <p className="mb-2 text-lg font-semibold">Upload Product Image(s)</p>
        {isEditMode && (
          <p className="mb-2 text-sm text-gray-500">
            Leave unchanged to keep current images; pick a file to replace that
            slot.
          </p>
        )}
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20 border-2 border-gray-500 rounded-lg cursor-pointer object-cover h-20"
              src={preview(image1, 0)}
              alt="Upload slot 1"
            />
            <input
              onChange={(e) => setImage1(e.target.files[0] || null)}
              type="file"
              id="image1"
              hidden
              accept="image/*"
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20 border-2 border-gray-500 rounded-lg cursor-pointer object-cover h-20"
              src={preview(image2, 1)}
              alt="Upload slot 2"
            />
            <input
              onChange={(e) => setImage2(e.target.files[0] || null)}
              type="file"
              id="image2"
              hidden
              accept="image/*"
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20 border-2 border-gray-500 rounded-lg cursor-pointer object-cover h-20"
              src={preview(image3, 2)}
              alt="Upload slot 3"
            />
            <input
              onChange={(e) => setImage3(e.target.files[0] || null)}
              type="file"
              id="image3"
              hidden
              accept="image/*"
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20 border-2 border-gray-500 rounded-lg cursor-pointer object-cover h-20"
              src={preview(image4, 3)}
              alt="Upload slot 4"
            />
            <input
              onChange={(e) => setImage4(e.target.files[0] || null)}
              type="file"
              id="image4"
              hidden
              accept="image/*"
            />
          </label>
        </div>
      </div>
      <div className="w-full mt-2">
        <p className="mb-2 text-lg font-semibold">Product Item Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
          type="text"
          placeholder="Enter Product Name"
          required
        />
      </div>
      <div className="w-full mt-2">
        <p className="mb-2 text-lg font-semibold">Product Item Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
          placeholder="Enter Product Description"
          required
        />
      </div>
      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <div>
          <p className="mb-2 text-lg font-semibold">Product Category</p>
          <select
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setCategory(selectedCategory);
              if (selectedCategory !== "Fashion & Design") {
                setSubCategory("");
              }
            }}
            value={category}
            className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-lg font-semibold">Product Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
            required={isFashionCategory}
            disabled={!isFashionCategory}
          >
            <option value="">Select Sub Category</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-lg font-semibold">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border-gray-500 max-w-[500px]"
            type="number"
            placeholder="Enter Product Price"
            required
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-lg font-semibold">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size)
                    ? "bg-gray-500 text-white rounded-md"
                    : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestSeller"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
        />
        <label htmlFor="bestSeller" className="ml-2 cursor-pointer">
          Add to Best Seller
        </label>
      </div>
      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <button
          type="submit"
          className="px-5 py-2 mt-2 text-white rounded-lg bg-slate-700"
        >
          {isEditMode ? "Update product" : "Add product"}
        </button>
        <button
          type="button"
          className="px-5 py-2 mt-2 text-white rounded-lg bg-slate-700"
          onClick={() => (isEditMode ? navigate("/list") : resetForm())}
        >
          {isEditMode ? "Cancel" : "Reset details"}
        </button>
      </div>
    </form>
  );
};

export default Add;
