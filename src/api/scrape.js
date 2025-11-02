const BASE_URL = "https://quickcommerce-backend-production-e429.up.railway.app";

// 🔹 Generic platform scraper (Blinkit / Zepto / Swiggy / All)
export async function scrapePlatform(platform, pincode, product) {
  // 🧩 Build dynamic URL
  const url = `${BASE_URL}/scrape/${platform}?pincode=${pincode}&product=${encodeURIComponent(
    product
  )}`;

  console.log(`🔍 Fetching from: ${url}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to scrape ${platform}`);

  // Return parsed JSON
  return await res.json();
}

// 🔹 Comparison API (optional)
export async function getCompare(pincode, product) {
  const url = `${BASE_URL}/compare?pincode=${pincode}&product=${encodeURIComponent(
    product
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to compare data");
  return await res.json();
}
