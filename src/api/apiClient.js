import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://quickcommerce.duckdns.org";

// --------------------------------------------------
// AXIOS INSTANCE
// --------------------------------------------------
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------------------------------------
// 🔐 REQUEST INTERCEPTOR (ADD TOKEN)
// --------------------------------------------------
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // ❌ Do NOT attach token for auth routes
      if (
        config.url?.startsWith("/auth/forgot-password") ||
        config.url?.startsWith("/auth/reset-password") ||
        config.url?.startsWith("/auth/signup") ||
        config.url?.startsWith("/auth/login")
      ) {
        return config;
      }

      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Token read failed:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// SCRAPE RESULT API
// --------------------------------------------------
export async function getScrapeResult() {
  const res = await apiClient.get("/scrape/result");
  return res.data;
}


// --------------------------------------------------
// 🚨 RESPONSE INTERCEPTOR (HANDLE 401)
// --------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("AXIOS ERROR FULL:", {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      response: error.response?.data,
    });

    // Auto logout on token expiry / invalid token
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/auth/reset-password")
    ) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------
// AUTH APIs
// --------------------------------------------------
export async function signup(name, email, password) {
  const res = await apiClient.post("/auth/signup", {
    name,
    email,
    password,
  });
  return res.data;
}

export async function login(email, password) {
  const res = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return res.data; // token returned here
}

export async function logout() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
}

// --------------------------------------------------
// SCRAPER APIs
// --------------------------------------------------
export async function startScrape(pincode, product) {
  const res = await apiClient.get("/scrape/start", {
    params: {
      pincode,
      product,
    },
  });
  return res.data;
}

export async function checkScrapeStatus(jobId) {
  const res = await apiClient.get(`/scrape/status/${jobId}`);
  return res.data;
}

export async function scrapePlatform(platform, pincode, product) {
  const res = await apiClient.get(`/scrape/${platform}`, {
    params: {
      pincode,
      product,
    },
  });
  return res.data;
}

// --------------------------------------------------
// COMPARE API
// --------------------------------------------------
export async function getCompare(pincode, product) {
  const res = await apiClient.get("/compare", {
    params: {
      pincode,
      product,
    },
  });
  return res.data;
}

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------
export async function getHealthStatus() {
  const res = await apiClient.get("/health");
  return res.data;
}

// --------------------------------------------------
// EXPORT
// --------------------------------------------------
export default {
  signup,
  login,
  logout,
  startScrape,
  checkScrapeStatus,
  scrapePlatform,
  getCompare,
  getHealthStatus,
  getScrapeResult, // 👈 ADD THIS
};

export { apiClient };
