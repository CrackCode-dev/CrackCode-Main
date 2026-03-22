import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StoreGrid from "../../components/store/StoreGrid";
import StoreSidebar from "../../components/store/StoreSidebar";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import { useTheme } from "../../context/theme/ThemeContext";

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
  const [tokensRemaining, setTokensRemaining] = useState(0);
  const [profileImage, setProfileImage] = useState("/placeholder.png");

  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const processingPaymentRef = useRef(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5051";


  const getToken = () => localStorage.getItem("accessToken");

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else if (type === "info") toast.info(message);
    else toast.success(message);
  };

  const normalizeImageUrl = (src) => {
    if (!src) return "/placeholder.png";
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`;
    if (src.startsWith("/src")) return src;
    return src;
  };

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Profile API error:", text);
        setUsername("User");
        setTokensRemaining(0);
        setProfileImage("/placeholder.png");
        return;
      }

      const data = await res.json();

      const user =
        data?.user ||
        data?.profile ||
        data?.data?.user ||
        data?.data ||
        data;

      setUsername(user?.username || user?.name || "User");
      setTokensRemaining(user?.tokens ?? 0);

      const avatarSrc =
        user?.equippedAvatarItemId?.imageUrl ||
        user?.equippedAvatar?.imageUrl ||
        user?.avatar ||
        "/placeholder.png";

      setProfileImage(normalizeImageUrl(avatarSrc));

      const equippedId =
        user?.equippedAvatarItemId?._id ||
        user?.equippedThemeItemId?._id ||
        user?.equippedTitleItemId?._id ||
        null;
      if (equippedId) {
        setEquippedItemId(String(equippedId));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setUsername("User");
      setTokensRemaining(0);
      setProfileImage("/placeholder.png");
    }
  };

  const loadInventory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/shop/inventory`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Inventory API error:", text);
        setInventoryItems([]);
        setOwnedItemIds(new Set());
        return;
      }

      const data = await res.json();

      const inventory = Array.isArray(data)
        ? data
        : data?.inventory || data?.items || [];

      setInventoryItems(inventory);

      const ids = new Set(
        inventory
          .map((inv) =>
            String(
              inv?.itemId?._id ||
                inv?.item?._id ||
                inv?.itemId ||
                inv?.item ||
                inv?._id
            )
          )
          .filter(Boolean)
      );

      setOwnedItemIds(ids);

      const equipped = inventory.find(
        (inv) => inv?.isEquipped === true || inv?.equipped === true
      );

      setEquippedItemId(
        equipped?.itemId?._id ||
          equipped?.item?._id ||
          equipped?.itemId ||
          equipped?.item ||
          null
      );
    } catch (error) {
      console.error("Failed to load inventory:", error);
      setInventoryItems([]);
      setOwnedItemIds(new Set());
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/shop/items`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Store items API error:", text);
        showToast("Failed to load store items", "error");
        return;
      }

      const data = await res.json();
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      console.error("Failed to fetch store items:", error);
      showToast("Failed to load store items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      await Promise.all([loadItems(), loadInventory(), loadProfile()]);
    };

    initialLoad();
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (!payment) return;

    // Prevent double-processing (React StrictMode fires effects twice in dev)
    if (processingPaymentRef.current) return;
    processingPaymentRef.current = true;

    const handlePaymentReturn = async () => {
      try {
        if (payment === "cancelled") {
          showToast("Payment was cancelled.", "info");
          navigate("/store", { replace: true });
          return;
        }

        if (payment !== "success") {
          navigate("/store", { replace: true });
          return;
        }

        if (sessionId) {
          const res = await fetch(
            `${API_BASE_URL}/api/payment/verify-session?session_id=${sessionId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          const data = await res.json().catch(() => null);

          if (!res.ok) {
            showToast(data?.message || "Failed to verify payment.", "error");
            navigate("/store", { replace: true });
            return;
          }
        }

        await Promise.all([loadInventory(), loadProfile(), loadItems()]);
        showToast("Payment successful! Item added to your inventory.", "success");
        navigate("/store", { replace: true });
      } catch (error) {
        console.error("Post-payment handling failed:", error);
        showToast("Something went wrong after payment.", "error");
        navigate("/store", { replace: true });
      } finally {
        processingPaymentRef.current = false;
      }
    };

    handlePaymentReturn();
  }, [location.search]);
  
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

  const handleBuyTokens = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch(`${API_BASE_URL}/api/shop/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Token purchase API error:", data);
        showToast(data?.message || "Purchase failed", "error");
        return;
      }

      if (data?.success) {
        showToast(data.message || "Successful! Item purchased", "success");
        await Promise.all([loadInventory(), loadProfile(), loadItems()]);
      } else {
        showToast(data?.message || "Purchase failed", "error");
      }
    } catch (error) {
      console.error("Token purchase failed:", error);
      showToast("Purchase failed", "error");
    } finally {
      setBuyingItemId(null);
    }
  };

  const handleBuyPaid = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch(`${API_BASE_URL}/api/shop/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Stripe checkout API error:", data);
        showToast(data?.message || "Stripe checkout failed", "error");
        return;
      }

      if (data?.url) {
        showToast("Redirecting to payment...", "success");
        window.location.href = data.url;
      } else {
        showToast(data?.message || "Stripe checkout failed", "error");
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

      const res = await fetch(`${API_BASE_URL}/api/profile/equip-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          category: item.category,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Equip API error:", data);
        showToast(data?.message || "Failed to equip item", "error");
        return;
      }

      if (data?.success) {
        setEquippedItemId(item._id);
        showToast(data.message || "Item equipped successfully!", "success");
        if (item.category === "theme" && item.metadata?.themeKey) {
          setTheme(item.metadata.themeKey);
        }
        await loadProfile();
      } else {
        showToast(data?.message || "Failed to equip item", "error");
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
      return inventoryItems
        .map((inv) => inv?.itemId || inv?.item || inv)
        .filter(Boolean);
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" showBackBtn={false} />

      <div className="flex flex-1 pt-20">
  <StoreSidebar category={category} setCategory={setCategory} />

  <div className="flex-1 p-10">

    {/* Heading row with avatar on the right */}
    <div className="flex items-center justify-between">
      <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>
        Detective Store
      </h1>
      <div className="flex flex-col items-center gap-1">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 mt-5 shadow-md" style={{ borderColor: 'var(--brand)' }}>
          <img
            src={profileImage}
            alt={username}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
          />
        </div>
        <span className="text-sm font-semibold px-3 py-1 rounded-full border" style={{ color: 'var(--brand)', borderColor: 'var(--brand)', background: 'var(--brandSoft)' }}>
          {tokensRemaining} Tokens
        </span>
      </div>
    </div>

          <p className="mb-10 text-lg" style={{ color: 'var(--textSec)' }}>
            Unlock exclusive avatars, themes, and titles to customize your
            detective profile
          </p>

          <h2 className="mb-6 text-2xl font-semibold" style={{ color: 'var(--text)' }}>
            {sectionTitle}
          </h2>

          {loading && category !== "inventory" && (
            <p style={{ color: 'var(--textSec)' }}>Loading store items...</p>
          )}

          {inventoryLoading && category === "inventory" && (
            <p style={{ color: 'var(--textSec)' }}>Loading your inventory...</p>
          )}

          {!loading && !inventoryLoading && displayedItems.length === 0 && (
            <p style={{ color: 'var(--textSec)' }}>
              {category === "inventory"
                ? "You do not own any items yet."
                : "No items found in this category."}
            </p>
          )}

          {!loading && !inventoryLoading && displayedItems.length > 0 && (
            <StoreGrid
              items={displayedItems}
              onBuyXP={category === "inventory" ? undefined : handleBuyTokens}
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