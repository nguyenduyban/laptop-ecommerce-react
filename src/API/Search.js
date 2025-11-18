import axios from "axios";
const API_BASE = "https://ecommerce-laravel.up.railway.app/api";

export const searchProducts = async (query) => {
  if (!query.trim()) return [];
  try {
    const res = await axios.get(`${API_BASE}/sanpham/search`, {
      params: { query },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi API search:", error);
    return [];
  }
};