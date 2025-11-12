// api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🌐 Backend base URL
const BASE_URL = "https://quickcommerce-backend-production-e429.up.railway.app";

// -----------------------------------------------------------
// 🧠 AXIOS INSTANCE
// -----------------------------------------------------------
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 sec timeout (for Playwright scraping)
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------------------------------------
// 🔐 REQUEST INTERCEPTOR — Attach JWT automatically
// -----------------------------------------------------------
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

// -----------------------------------------------------------
// ⚠️ RESPONSE INTERCEPTOR — Handle errors globally
// -----------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("⚠️ Token expired or unauthorized. Logging out...");
        await AsyncStorage.removeItem("token");
      }
    } else {
      console.error("🚨 Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// -----------------------------------------------------------
// 🧱 AUTH ROUTES
// -----------------------------------------------------------

// 🔹 Signup new user
export async function signup(name, email, password) {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
}

// 🔹 Login existing user
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });

  const token = res.data?.token;
  if (token) {
    await AsyncStorage.setItem("token", JSON.stringify(token));
  }

  return res.data;
}

// 🔹 Logout user
export async function logout() {
  await AsyncStorage.removeItem("token");
  console.log("✅ Logged out successfully");
}

// -----------------------------------------------------------
// ⚙️ SCRAPER ROUTES (Protected)
// -----------------------------------------------------------

// 🔹 Generic platform scraper (blinkit / zepto / swiggy / all)
export async function scrapePlatform(platform, pincode, product) {
  const res = await api.get(
    `/scrape/${platform}?pincode=${pincode}&product=${encodeURIComponent(
      product
    )}`
  );
  return res.data;
}

// 🔹 All platforms (blinkit + zepto + swiggy together)
export async function scrapeAll(pincode, product) {
  const res = await api.get(
    `/scrape/all?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// 🔹 Compare route (optional placeholder)
export async function getCompare(pincode, product) {
  const res = await api.get(
    `/compare?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// -----------------------------------------------------------
// 🩺 HEALTH ROUTE — Check API uptime
// -----------------------------------------------------------
export async function getHealthStatus() {
  const res = await api.get("/health");
  return res.data;
}
