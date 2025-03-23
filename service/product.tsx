import { ProductData } from "@/data/products";
import api from "./api";

// 🔹 Add Product
export const addProduct = async (
  title: string,
  image: string,
  price: number,
  discount: number,
  type: string,
  category: string,
  featured: boolean,
  description: string,
  ingredients: string[],
  nutritionalInfo: { calories: number; protein: number; carbs: number; fat: number }
) => {
  try {
    const response = await api.post(
      "/products",
      { title, image, price, discount, type, category, featured, description, ingredients, nutritionalInfo },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to add product" };
  }
};

// 🔹 Get All Products
export const getAllProducts = async () => {
  try {
    const response = await api.get("/product", { withCredentials: true });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};

// 🔹 Get Product by ID
export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch product details" };
  }
};

// 🔹 Update Product
export const updateProduct = async (
  id: string,
  title?: string,
  image?: string,
  price?: number,
  discount?: number,
  type?: string,
  category?: string,
  featured?: boolean,
  description?: string,
  ingredients?: string[],
  nutritionalInfo?: { calories: number; protein: number; carbs: number; fat: number }
) => {
  try {
    const response = await api.put(
      `/product/${id}`,
      {ProductData},
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to update product" };
  }
};

// 🔹 Delete Product
export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/product/${id}`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to delete product" };
  }
};
