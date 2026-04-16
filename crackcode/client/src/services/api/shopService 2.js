// import axios from "axios";

// // Adjust base URL as needed (using an env variable or relative path)
// const API_URL = "/api/shop";

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token"); // Or however you store your JWT
//   return { headers: { Authorization: `Bearer ${token}` } };
// };

// export const fetchStoreItems = async () => {
//   const res = await axios.get(API_URL, getAuthHeader());
//   return res.data;
// };

// export const buyItem = async (itemId) => {
//   const res = await axios.post(`${API_URL}/buy`, { itemId }, getAuthHeader());
//   return res.data;
// };



import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5051";

const API = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: true,
});

// Get all shop items
export const getShopItems = async (category = "all") => {
  const res = await API.get("/shop/items", {
    params: { category },
  });
  return res.data;
};

// Buy item with XP / free
export const buyItemWithXP = async (itemId) => {
  const res = await API.post(`/shop/items/${itemId}/buy-xp`);
  return res.data;
};

// Create Stripe checkout for paid item
export const createCheckoutSession = async (itemId) => {
  const res = await API.post(`/shop/items/${itemId}/checkout`);
  return res.data;
};

// Get logged-in user's inventory
export const getMyInventory = async (category = "all") => {
  const res = await API.get("/shop/inventory/me", {
    params: { category },
  });
  return res.data;
};