import axios from "axios";

// Adjust base URL as needed (using an env variable or relative path)
const API_URL = "/api/shop";

const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Or however you store your JWT
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchStoreItems = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  return res.data;
};

export const buyItem = async (itemId) => {
  const res = await axios.post(`${API_URL}/buy`, { itemId }, getAuthHeader());
  return res.data;
};