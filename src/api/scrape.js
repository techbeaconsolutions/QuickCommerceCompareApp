// api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------------------------------------------------
// 🟢 Backend API URL (YOUR CONTABO SERVER)
// -------------------------------------------------------------
const BASE_URL = "http://147.93.155.17:10000";

// -------------------------------------------------------------
// 🧠 AXIOS INSTANCE
// -------------------------------------------------------------
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // Playwright scrapers take time
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------------------------------------------
// 🔐 REQUEST INTERCEPTOR → Attach JWT Token
// -------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------
// ⚠ RESPONSE INTERCEPTOR → Auto logout on 401
// -------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired — clearing token!");
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------------
// 🔐 AUTH FUNCTIONS
// -------------------------------------------------------------

// SIGNUP
export async function signup(name, email, password) {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
}

// LOGIN
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });

  const token = res.data?.token;
  if (token) {
    await AsyncStorage.setItem("token", JSON.stringify(token));
  }

  return res.data;
}

// LOGOUT
export async function logout() {
  await AsyncStorage.removeItem("token");
}

// -------------------------------------------------------------
// 🛒 SCRAPER ENDPOINTS
// -------------------------------------------------------------

// SINGLE PLATFORM SCRAPER
export async function scrapePlatform(platform, pincode, product) {
  const res = await api.get(
    `/scrape/${platform}?pincode=${pincode}&product=${encodeURIComponent(
      product
    )}`
  );
  return res.data;
}

// ALL SCRAPERS (Blinkit + Zepto + Swiggy)
export async function scrapeAll(pincode, product) {
  const res = await api.get(
    `/scrape/all?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// COMPARE
export async function getCompare(pincode, product) {
  const res = await api.get(
    `/compare?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// HEALTH CHECK
export async function getHealthStatus() {
  const res = await api.get("/health");
  return res.data;
}

// -------------------------------------------------------------
// ✅ EXPORT EVERYTHING IN ONE DEFAULT OBJECT
// -------------------------------------------------------------
export default {
  signup,
  login,
  logout,
  scrapePlatform,
  scrapeAll,
  getCompare,
  getHealthStatus,
};
