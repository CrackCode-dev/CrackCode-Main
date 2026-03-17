
import { useEffect, useMemo, useState } from "react";
import StoreGrid from "../../components/store/StoreGrid";
import StoreSidebar from "../../components/store/StoreSidebar";
import Toast from "../../components/common/Toast";
import HQBtn from "../../components/common/HQBtn";
import BackBtn from "../../components/common/BackBtn";

export default function DetectiveStore() {
  const [items, setItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [ownedItemIds, setOwnedItemIds] = useState(new Set());
  const [category, setCategory] = useState("all");
  const [buyingItemId, setBuyingItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [equippingItemId, setEquippingItemId] = useState(null);
  const [equippedItemId, setEquippedItemId] = useState(null);

  const [username, setUsername] = useState("User");
  const [xpRemaining, setXpRemaining] = useState(0);
  const [profileImage, setProfileImage] = useState("/placeholder.png");

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

  const normalizeImageUrl = (src) => {
    if (!src) return "/placeholder.png";
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads")) return `http://localhost:5051${src}`;
    if (src.startsWith("/src")) return src;
    return src;
  };

  const loadProfile = async () => {
    try {
      const res = await fetch("http://localhost:5051/api/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("PROFILE DATA:", data);

      const user =
        data?.user ||
        data?.profile ||
        data?.data?.user ||
        data?.data ||
        data;

      setUsername(user?.username || user?.name || "User");
      setXpRemaining(user?.xp ?? user?.totalXP ?? user?.totalXp ?? 0);

      const avatarSrc =
        user?.equippedAvatarItemId?.imageUrl ||
        user?.avatar ||
        "/placeholder.png";

      setProfileImage(normalizeImageUrl(avatarSrc));
    } catch (error) {
      console.error("Failed to load profile:", error);
      setUsername("User");
      setXpRemaining(0);
      setProfileImage("/placeholder.png");
    }
  };

  const loadInventory = async () => {
    try {
      const res = await fetch("http://localhost:5051/api/shop/inventory", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      const inventory = Array.isArray(data) ? data : data.items || [];

      setInventoryItems(inventory);

      const ids = new Set(
        inventory.map((inv) => String(inv.itemId?._id || inv.itemId || inv._id))
      );

      setOwnedItemIds(ids);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5051/api/shop/items");
        const data = await res.json();

        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error("Failed to fetch store items:", error);
        showToast("Failed to load store items", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    loadInventory();
    loadProfile();
  }, []);

  useEffect(() => {
    if (category === "inventory") {
      const fetchInventoryTab = async () => {
        try {
          setInventoryLoading(true);
          await loadInventory();
        } catch (error) {
          console.error("Failed to fetch inventory:", error);
          setInventoryItems([]);
          showToast("Failed to load inventory", "error");
        } finally {
          setInventoryLoading(false);
        }
      };

      fetchInventoryTab();
    }
  }, [category]);

  const handleBuyXP = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch("http://localhost:5051/api/shop/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Successful! Item purchased", "success");
        await loadInventory();
        await loadProfile();
      } else {
        showToast(data.message || "Purchase failed", "error");
      }
    } catch (error) {
      console.error("XP purchase failed:", error);
      showToast("Purchase failed", "error");
    } finally {
      setBuyingItemId(null);
    }
  };

  const handleBuyPaid = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch("http://localhost:5051/api/shop/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (data?.url) {
        showToast("Redirecting to payment...", "success");
        window.location.href = data.url;
      } else {
        showToast(data.message || "Stripe checkout failed", "error");
      }
    } catch (error) {
      console.error("Stripe checkout failed:", error);
      showToast("Stripe checkout failed", "error");
    } finally {
      setBuyingItemId(null);
    }
  };

  const handleEquip = async (item) => {
    try {
      setEquippingItemId(item._id);

      const res = await fetch("http://localhost:5051/api/profile/equip-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          itemId: item._id,
          category: item.category,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEquippedItemId(item._id);
        showToast("Item equipped successfully!", "success");
        await loadProfile();
      } else {
        showToast(data.message || "Failed to equip item", "error");
      }
    } catch (error) {
      console.error("Equip failed:", error);
      showToast("Failed to equip item", "error");
    } finally {
      setEquippingItemId(null);
    }
  };

  const displayedItems = useMemo(() => {
    if (category === "inventory") {
      return inventoryItems.map((inv) => inv.itemId || inv);
    }

    if (category === "all") {
      return items;
    }

    return items.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    );
  }, [category, items, inventoryItems]);

  const sectionTitle =
    category === "inventory"
      ? "My Inventory"
      : category === "all"
      ? "All Items"
      : `${category.charAt(0).toUpperCase() + category.slice(1)} Items`;

  return (
    <div className="min-h-screen bg-black text-white">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-4">
          <HQBtn />
          <BackBtn />
        </div>

        <div className="flex items-center gap-3 rounded-full border border-gray-700 bg-[#111] px-4 py-2">
          <img
            src={profileImage}
            alt={username}
            className="h-10 w-10 rounded-full object-cover border border-gray-600"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold">{username}</p>
            <p className="text-xs font-medium text-green-400">{xpRemaining} XP</p>
          </div>
        </div>
      </div>

      <div className="flex">
        <StoreSidebar category={category} setCategory={setCategory} />

        <div className="flex-1 p-10">
          <h1 className="mb-2 text-3xl font-bold">Detective Store</h1>
          <p className="mb-10 text-gray-400">
            Unlock exclusive avatars, themes, and titles to customize your
            detective profile
          </p>

          <h2 className="mb-6 text-2xl font-semibold">{sectionTitle}</h2>

          {loading && category !== "inventory" && (
            <p className="text-gray-400">Loading store items...</p>
          )}

          {inventoryLoading && category === "inventory" && (
            <p className="text-gray-400">Loading your inventory...</p>
          )}

          {!loading && !inventoryLoading && displayedItems.length === 0 && (
            <p className="text-gray-400">
              {category === "inventory"
                ? "You do not own any items yet."
                : "No items found in this category."}
            </p>
          )}

          {!loading && !inventoryLoading && displayedItems.length > 0 && (
            <StoreGrid
              items={displayedItems}
              onBuyXP={category === "inventory" ? undefined : handleBuyXP}
              onBuyPaid={category === "inventory" ? undefined : handleBuyPaid}
              buyingItemId={buyingItemId}
              isInventoryView={category === "inventory"}
              onEquip={handleEquip}
              equippingItemId={equippingItemId}
              equippedItemId={equippedItemId}
              ownedItemIds={ownedItemIds}
            />
          )}
        </div>
      </div>
    </div>
  );
}