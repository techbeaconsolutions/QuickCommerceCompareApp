import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------------------------------------------------
// 🟢 YOUR BACKEND BASE URL
// -------------------------------------------------------------
const BASE_URL = "http://147.93.155.17:10000";

// -------------------------------------------------------------
// 🧠 AXIOS INSTANCE
// -------------------------------------------------------------ww
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // Scrapers take long
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// -------------------------------------------------------------
// 🔐 REQUEST INTERCEPTOR — Add JWT automatically
// -------------------------------------------------------------
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------------------------------------------------
// ⚠ RESPONSE INTERCEPTOR — Auto logout if token expires
// -------------------------------------------------------------
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------------
// 🔐 AUTH FUNCTIONS
// -------------------------------------------------------------

export async function signup(name, email, password) {
  const res = await apiClient.post("/auth/signup", { name, email, password });
  return res.data;
}

export async function login(email, password) {
  const res = await apiClient.post("/auth/login", { email, password });

  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
  }

  return res.data;
}

export async function logout() {
  await AsyncStorage.removeItem("token");
}

// -------------------------------------------------------------
// 🛒 SCRAPER: START A NEW JOB (GET REQUEST)
// -------------------------------------------------------------
export async function startScrape(pincode, product) {
  const res = await apiClient.get(
    `/scrape/start?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// -------------------------------------------------------------
// 🛒 SCRAPER: CHECK STATUS OF JOB
// -------------------------------------------------------------
export async function checkScrapeStatus(jobId) {
  const res = await apiClient.get(`/scrape/status/${jobId}`);
  return res.data;
}

// -------------------------------------------------------------
// 🛒 OLD DIRECT PLATFORM ENDPOINT (still exists)
// -------------------------------------------------------------
export async function scrapePlatform(platform, pincode, product) {
  const res = await apiClient.get(
    `/scrape/${platform}?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// -------------------------------------------------------------
// 🛒 OLD ALL-COMPARE ENDPOINT
// -------------------------------------------------------------
export async function getCompare(pincode, product) {
  const res = await apiClient.get(
    `/compare?pincode=${pincode}&product=${encodeURIComponent(product)}`
  );
  return res.data;
}

// -------------------------------------------------------------
// 🩺 HEALTH CHECK
// -------------------------------------------------------------
export async function getHealthStatus() {
  const res = await apiClient.get("/health");
  return res.data;
}

// -------------------------------------------------------------
// 📦 EXPORT EVERYTHING
// -------------------------------------------------------------
export default {
  signup,
  login,
  logout,
  startScrape,
  checkScrapeStatus,
  scrapePlatform,
  getCompare,
  getHealthStatus,
};
