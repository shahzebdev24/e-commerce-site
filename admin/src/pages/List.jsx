import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const categoryLabelMap = {
  Medicine: "Health & Care",
  Cosmetics: "Beauty & Care",
  Cloth: "Fashion & Design",
  "Beauty Core": "Beauty & Care",
  Jewelry: "Jewellery",
};

const normalizeCategory = (category = "") =>
  categoryLabelMap[category] || category;

const List = ({ token }) => {
  const [listProducts, setListProducts] = useState([]);

  const fetchListProducts = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.info(response.data.message);
        await fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[0.25fr_0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.45fr] items-center py-1 px-2 border bg-gray-200 text-xl text-center">
          <b>S.No</b>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Sub Category</b>
          <b>Price</b>
          <b className="text-center">Actions</b>
        </div>
        {/* Display Products */}
        {listProducts.map((item, index) => (
          <div
            className="grid grid-cols-[0.25fr_0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.45fr] md:grid-cols-[0.25fr_0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.45fr] items-center gap-2 py-1 px-2 border text-sm text-center"
            key={index}
          >
            <p>{index + 1}</p>
            <img className="w-12" src={item.image[0]} alt="Product Image" />
            <p className="text-left">{item.name}</p>
            <p className="text-left">{item.description}</p>
            <p>{normalizeCategory(item.category)}</p>
            <p>{item.subCategory}</p>
            <p>{currency(item.price)}</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to={`/edit/${item._id}`}
                className="rounded-md bg-slate-700 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => removeProduct(item._id)}
                className="max-w-7 cursor-pointer rounded-full bg-red-500 px-2 py-0.5 text-center text-xs font-bold text-gray-800"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
