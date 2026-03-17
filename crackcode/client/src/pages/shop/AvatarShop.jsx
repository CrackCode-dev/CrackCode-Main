
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5051/api";

const AvatarShop = () => {
  const [avatars, setAvatars] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAvatarShop();
  }, []);
  
  const getToken = () => localStorage.getItem("accessToken");

  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadAvatarShop = async () => {
    try {
      setLoading(true);
      setError("");

      const avatarsRes = await axios.get(
        `${API_BASE_URL}/shop/items?category=avatar`
      );

      setAvatars(avatarsRes.data.items || []);

      const token = getToken();
      if (token) {
        try {
          const inventoryRes = await axios.get(
            `${API_BASE_URL}/shop/inventory?category=avatar`,
            {
              headers: getAuthHeaders(),
            }
          );

          setInventory(inventoryRes.data.items || []);
        } catch (inventoryErr) {
          console.error("Failed to load inventory:", inventoryErr);
        }
      }
    } catch (err) {
      console.error("Failed to load avatar shop:", err);
      setError("Failed to load avatar shop");
    } finally {
      setLoading(false);
    }
  };

  const isOwned = (itemId) => {
    return inventory.some((item) => {
      const ownedItemId =
        typeof item.itemId === "object" ? item.itemId?._id : item.itemId;
      return ownedItemId === itemId;
    });
  };

  const buyAvatar = async (avatar) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Please login first");
        return;
      }

      setBuyingId(avatar._id);
      setError("");

      if (avatar.pricing.type === "paid") {
        const res = await axios.post(
          `${API_BASE_URL}/shop/checkout`,
          { itemId: avatar._id },
          { headers: getAuthHeaders() }
        );

        window.location.href = res.data.checkoutUrl;
        return;
      }

      await axios.post(
        `${API_BASE_URL}/shop/purchase`,
        { itemId: avatar._id },
        { headers: getAuthHeaders() }
      );

      await loadAvatarShop();
      alert("Avatar purchased successfully!");
    } catch (err) {
      console.error("Purchase failed:", err);
      setError(err?.response?.data?.message || "Purchase failed");
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) {
    return <div className="p-10 text-lg">Loading avatar shop...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Avatar Shop</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {avatars.length === 0 ? (
        <p>No avatars available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {avatars.map((avatar) => {
            const owned = isOwned(avatar._id);

            return (
              <div
                key={avatar._id}
                className="border p-4 rounded-xl text-center shadow bg-white"
              >
                <img
                  src={`http://localhost:5051${avatar.imageUrl}`}
                  alt={avatar.name}
                  className="w-24 h-24 mx-auto mb-3 rounded-full object-cover"
                />

                <h3 className="font-semibold text-lg">{avatar.name}</h3>

                <p className="text-sm text-gray-500 mb-2">
                  {avatar.description}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  {avatar.pricing.type === "paid"
                    ? `$${avatar.pricing.amount}`
                    : avatar.pricing.type === "tokens"
                    ? `${avatar.pricing.amount} Tokens`
                    : "Free"}
                </p>

                {owned ? (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed"
                  >
                    Owned
                  </button>
                ) : (
                  <button
                    onClick={() => buyAvatar(avatar)}
                    disabled={buyingId === avatar._id}
                    className="bg-black text-white px-4 py-2 rounded w-full"
                  >
                    {buyingId === avatar._id ? "Processing..." : "Buy"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvatarShop;