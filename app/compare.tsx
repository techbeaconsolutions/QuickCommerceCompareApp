import React, { useState } from "react";
import { scrapePlatform, getCompare } from "../src/api/scrape";

// ✅ Define what a product looks like
interface Product {
  name: string;
  price: string;
  quantity: string;
  [key: string]: any;
}

// ✅ Structure for results
interface Results {
  blinkit: Product[];
  zepto: Product[];
  swiggy: Product[];
  compare: Product[];
}

// ✅ Props for PlatformCard component
interface PlatformCardProps {
  title: string;
  data: Product[];
}

export default function CompareProducts() {
  const [pincode, setPincode] = useState("411048");
  const [product, setProduct] = useState("coffee");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [results, setResults] = useState<Results>({
    blinkit: [],
    zepto: [],
    swiggy: [],
    compare: [],
  });

  // const handleSearch = async (): Promise<void> => {
  //   setLoading(true);
  //   setProgress("Blinkit scraping...");
  //   try {
  //     const blink = await scrapePlatform("blinkit", pincode, product);
  //     setResults((r) => ({ ...r, blinkit: blink.data }));

  //     setProgress("Zepto scraping...");
  //     const zepto = await scrapePlatform("zepto", pincode, product);
  //     setResults((r) => ({ ...r, zepto: zepto.data }));

  //     setProgress("swiggy scraping...");
  //     const swiggy = await scrapePlatform("swiggy", pincode, product);
  //     setResults((r) => ({ ...r, swiggy: swiggy.data }));

  //     setProgress("Comparing results...");
  //     const compare = await getCompare(pincode, product);
  //     setResults((r) => ({
  //       ...r,
  //       compare: compare?.data || compare?.compare || [],
  //     }));

  //     setProgress("✅ Done!");
  //   } catch (err: unknown) {
  //     if (err instanceof Error) {
  //       console.error("❌ Error:", err.message);
  //       setProgress("❌ Error: " + err.message);
  //     } else {
  //       console.error("❌ Unknown error:", err);
  //       setProgress("❌ Unexpected error");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setProgress("Running all scrapers...");
    try {
      // 🟢 Fetch API response
      const response = await scrapePlatform("all", pincode, product);

      // ✅ response already contains { success, message, data: { blinkit, zepto, swiggy } }
      const data = response.data || response.data?.data || response;

      // ✅ Handle nested structures safely
      const resultsData = data.data || data;

      setResults({
        blinkit: resultsData.blinkit || [],
        zepto: resultsData.zepto || [],
        swiggy: resultsData.swiggy || [],
        compare: [],
      });

      setProgress("✅ Done!");
    } catch (err: any) {
      console.error("❌ Error in handleSearch:", err);
      setProgress("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🛒 QuickCommerce Product Comparison</h2>

      {/* Search Section */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          style={{ marginRight: "10px", padding: "6px" }}
        />
        <input
          type="text"
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={{ marginRight: "10px", padding: "6px" }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ padding: "6px 12px" }}
        >
          {loading ? "Scraping..." : "Start Search"}
        </button>
      </div>

      <p>{progress}</p>

      {/* 🧩 Scrollable results container */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowY: "auto", // ✅ enables vertical scroll
          maxHeight: "80vh", // ✅ limits scroll area to viewport height
          paddingRight: "10px",
          scrollbarWidth: "thin", // for Firefox
        }}
      >
        <PlatformCard title="Blinkit" data={results.blinkit} />
        <PlatformCard title="Zepto" data={results.zepto} />
        <PlatformCard title="swiggy" data={results.swiggy} />
      </div>

      {/* <h3>📊 Comparison Results</h3>
      <PlatformCard title="Final Matches" data={results.compare} /> */}
    </div>
  );
}

// ✅ PlatformCard
function PlatformCard({ title, data }: PlatformCardProps) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        background: "#fafafa",
        overflowY: "auto", // ✅ add scroll if card itself overflows
        maxHeight: "70vh",
      }}
    >
      <h4>{title}</h4>
      {data?.length ? (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {data?.map((item, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* 🖼️ Product Image */}
              <img
                src={item.image}
                alt={item.name}
                width="80"
                height="80"
                style={{ objectFit: "contain", borderRadius: "6px" }}
              />

              {/* 📦 Product Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 4px" }}>{item.name}</h3>
                <p style={{ margin: 0 }}>
                  {item.platform} — {item.pincode}
                </p>
                <p style={{ fontWeight: "bold", marginTop: "4px" }}>
                  {item.price?.match(/₹\s*\d+/g)?.[0] || "₹N/A"}
                </p>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#888" }}>No data</p>
      )}
    </div>
  );
}
