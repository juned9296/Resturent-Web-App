import axios from "axios";

const API_URL = "http://localhost:5000"; // 👈 Apne backend ka URL set karein

// ✅ Configure Axios to include cookies in requests
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 Cookies ko automatically send/receive karega
});

export default api;