import { useEffect, useState } from "react";
import StoreGrid from "./StoreGrid";

export default function StorePage() {
  const [items, setItems] = useState([]);
  const [buyingItemId, setBuyingItemId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:3000/shop/items");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch store items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleBuy = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch(`http://localhost:3000/shop/purchase/${itemId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      console.log("Purchase result:", data);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setBuyingItemId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Store</h1>
      <StoreGrid
        items={items}
        onBuy={handleBuy}
        buyingItemId={buyingItemId}
      />
    </div>
  );
}