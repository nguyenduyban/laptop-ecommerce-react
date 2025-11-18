import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-laravel.up.railway.app/api", 
});

// Hàm lấy danh sách carosel
export const getAllCarousel = async () => {
  try {
    const response = await api.get("/slideshow");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách slideshow:", error);
    throw error;
  }
};
export const getCarouselById = async (STT) => {
  try {
    const response = await api.get(`/slideshow/${STT}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    throw error;
  }
};
