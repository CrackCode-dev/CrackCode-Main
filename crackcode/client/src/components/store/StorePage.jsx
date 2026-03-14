import { useEffect, useState } from "react";
import StoreGrid from "../../components/store/StoreGrid";
import StoreSidebar from "../../components/store/StoreSidebar";
import Toast from "../common/Toast";

export default function DetectiveStore() {

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("http://localhost:3000/shop/items");
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const filteredItems =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <StoreSidebar category={category} setCategory={setCategory} />

      {/* Main content */}
      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold mb-2">
          Detective Store
        </h1>

        <p className="text-gray-400 mb-10">
          Unlock exclusive avatars, themes, and titles to customize your detective profile
        </p>

        <h2 className="text-2xl font-semibold mb-6">
          {category === "all" ? "All Items" : category}
        </h2>

        <StoreGrid items={filteredItems} />

      </div>

    </div>
  );
}