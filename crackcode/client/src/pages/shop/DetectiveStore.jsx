import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StoreGrid from "../../components/store/StoreGrid";
import StoreSidebar from "../../components/store/StoreSidebar";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import { useTheme } from "../../context/theme/ThemeContext";
import { AppContent } from "../../context/userauth/authenticationContext";

export default function DetectiveStore() {
  // --- State ---
  const [items, setItems] = useState([]);              // All store items from the API
  const [inventoryItems, setInventoryItems] = useState([]); // Items the user already owns
  const [ownedItemIds, setOwnedItemIds] = useState(new Set()); // Set of owned item IDs for quick lookup
  const [category, setCategory] = useState("all");    // Active sidebar filter (all, avatars, themes, inventory)
  const [buyingItemId, setBuyingItemId] = useState(null);    // ID of item currently being purchased (shows loading state)
  const [loading, setLoading] = useState(true);              // True while store items are being fetched
  const [inventoryLoading, setInventoryLoading] = useState(false); // True while inventory tab is loading
  const [equippingItemId, setEquippingItemId] = useState(null);    // ID of item currently being equipped
  const [equippedItemId, setEquippedItemId] = useState(null);      // ID of the currently equipped item

  // User profile state shown in the top-right corner
  const [username, setUsername] = useState("User");
  const [tokensRemaining, setTokensRemaining] = useState(0);
  const [profileImage, setProfileImage] = useState("/placeholder.png");

  // --- Hooks ---
  const { theme, setTheme } = useTheme();
  const { getUserData } = useContext(AppContent); // Used to refresh global user data after equipping
  const location = useLocation();
  const navigate = useNavigate();

  // Prevents the Stripe payment handler from running twice (React StrictMode fires effects twice in dev)
  const processingPaymentRef = useRef(false);

  // Backend API base URL, falls back to localhost if env vars are not set
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5051";

  // --- Theme helpers ---
  // Determines if the current theme is a light variant to adjust text/border colors
  const isLightFamily = ["light", "cream", "country"].includes(theme);
  const subTextClass = isLightFamily ? "text-gray-500" : "text-gray-400";
  const tokenClass = isLightFamily ? "text-green-600" : "text-green-400";

  // Retrieves the JWT access token from localStorage for authenticated API calls
  const getToken = () => localStorage.getItem("accessToken");

  // Helper to show toast notifications (success, error, or info)
  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else if (type === "info") toast.info(message);
    else toast.success(message);
  };

  // Converts relative image paths from the server into full URLs
  const normalizeImageUrl = (src) => {
    if (!src) return "/placeholder.png";
    if (src.startsWith("http")) return src;                        // Already absolute
    if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`; // Server-hosted upload
    if (src.startsWith("/src")) return src;                        // Local asset
    return src;
  };

  // --- Data fetching ---

  // Fetches the logged-in user's profile (username, token balance, equipped avatar)
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

      // Handle different API response shapes
      const user =
        data?.user ||
        data?.profile ||
        data?.data?.user ||
        data?.data ||
        data;

      setUsername(user?.username || user?.name || "User");
      setTokensRemaining(user?.tokens ?? 0);

      // Resolve the avatar image from whichever field is populated
      const avatarSrc =
        user?.equippedAvatarItemId?.imageUrl ||
        user?.equippedAvatar?.imageUrl ||
        user?.avatar ||
        "/placeholder.png";

      setProfileImage(normalizeImageUrl(avatarSrc));

      // Track which item is currently equipped (supports both populated object and raw ID)
      if (user?.equippedAvatarItemId?._id) {
        setEquippedItemId(user.equippedAvatarItemId._id);
      } else if (user?.equippedAvatarItemId && typeof user.equippedAvatarItemId === 'string') {
        setEquippedItemId(user.equippedAvatarItemId);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setUsername("User");
      setTokensRemaining(0);
      setProfileImage("/placeholder.png");
    }
  };

  // Fetches the user's inventory and builds the set of owned item IDs
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

      // Handle different API response shapes for the inventory array
      const inventory = Array.isArray(data)
        ? data
        : data?.inventory || data?.items || [];

      setInventoryItems(inventory);

      // Build a Set of owned item IDs so StoreItemCard can quickly check ownership
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

      // Find which inventory item is currently equipped and update state
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

  // Fetches all available items from the store (no auth required)
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

  // --- Effects ---

  // On mount: load store items, user inventory, and profile in parallel
  useEffect(() => {
    const initialLoad = async () => {
      await Promise.all([loadItems(), loadInventory(), loadProfile()]);
    };

    initialLoad();
  }, []);

  // Handles the redirect back from Stripe after a payment attempt.
  // Stripe appends ?payment=success&session_id=... or ?payment=cancelled to the URL.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (!payment) return;

    // Guard against double execution in React StrictMode (dev only)
    if (processingPaymentRef.current) return;
    processingPaymentRef.current = true;

    const handlePaymentReturn = async () => {
      try {
        if (payment === "cancelled") {
          showToast("Payment was cancelled.", "info");
          navigate("/store", { replace: true }); // Clean up URL
          return;
        }

        if (payment !== "success") {
          navigate("/store", { replace: true });
          return;
        }

        // Verify the Stripe session server-side to confirm payment and grant the item
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

        // Refresh all data so the newly purchased item appears in inventory
        await Promise.all([loadInventory(), loadProfile(), loadItems()]);
        showToast("Payment successful! Item added to your inventory.", "success");
        navigate("/store", { replace: true }); // Remove query params from URL
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

  // Refreshes inventory whenever the user switches to the "My Inventory" tab
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

  // --- Purchase handlers ---

  // Handles token-based purchases (items paid with in-app tokens)
  const handleBuyTokens = async (itemId) => {
    try {
      setBuyingItemId(itemId); // Show loading spinner on this item's button

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
        // Refresh store, inventory, and token balance
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

  // Handles real-money purchases via Stripe.
  // Creates a Stripe checkout session and redirects the user to Stripe's hosted payment page.
  // After payment, Stripe redirects back to /store?payment=success&session_id=... (handled above).
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
        window.location.href = data.url; // Redirect to Stripe hosted checkout page
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

  // Equips an owned item (avatar or theme) on the user's profile
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
        // If a theme item is equipped, apply the theme immediately
        if (item.category === "theme" && item.metadata?.themeKey) {
          setTheme(item.metadata.themeKey);
        }
        await loadProfile();
        // Refresh global user context so the avatar updates everywhere (e.g. Header)
        await getUserData();
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

  // --- Derived state ---

  // Computes which items to display based on the active category filter
  const displayedItems = useMemo(() => {
    if (category === "inventory") {
      // Inventory entries wrap the actual item — unwrap to get the item object
      return inventoryItems
        .map((inv) => inv?.itemId || inv?.item || inv)
        .filter(Boolean);
    }

    if (category === "all") {
      return items;
    }

    // Filter by category name (case-insensitive)
    return items.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    );
  }, [category, items, inventoryItems]);

  // Section heading shown above the grid
  const sectionTitle =
    category === "inventory"
      ? "My Inventory"
      : category === "all"
      ? "All Items"
      : `${category.charAt(0).toUpperCase() + category.slice(1)} Items`;

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" showBackBtn={false} />

      <main className="flex flex-1 px-6 sm:px-10 py-10 mt-20">
        {/* Sidebar: category filter (All, Avatars, Themes, My Inventory) */}
        <StoreSidebar category={category} setCategory={setCategory} />

        <div className="flex-1 p-10">

          {/* Heading row: store title on the left, user avatar + token balance on the right */}
          <div className="flex items-center justify-between">
            <h1 className='text-4xl md:text-5xl font-bold' style={{ color: 'var(--text)' }}>
              Detective Store
            </h1>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 mt-5 ${isLightFamily ? "border-green-300" : "border-green-700"} shadow-md`}>
                <img
                  src={profileImage}
                  alt={username}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                />
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${tokenClass} ${isLightFamily ? "border-green-300 bg-green-50" : "border-green-800 bg-green-950/40"}`}>
                {tokensRemaining} Tokens
              </span>
            </div>
          </div>

          <p className='mb-10 text-lg' style={{ color: 'var(--textSec)' }}>
            Unlock exclusive avatars, themes, and titles to customize your
            detective profile
          </p>

          <h2 className='mb-6 text-2xl font-semibold' style={{ color: 'var(--text)' }}>
            {sectionTitle}
          </h2>

          {/* Loading states */}
          {loading && category !== "inventory" && (
            <p className={subTextClass}>Loading store items...</p>
          )}

          {inventoryLoading && category === "inventory" && (
            <p className={subTextClass}>Loading your inventory...</p>
          )}

          {/* Empty state */}
          {!loading && !inventoryLoading && displayedItems.length === 0 && (
            <p className={subTextClass}>
              {category === "inventory"
                ? "You do not own any items yet."
                : "No items found in this category."}
            </p>
          )}

          {/* Item grid — buy handlers are hidden in inventory view since items are already owned */}
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
      </main>
    </div>
  );
}
