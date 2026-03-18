// import { useEffect, useMemo, useState } from "react";
// import StoreGrid from "../../components/store/StoreGrid";
// import StoreSidebar from "../../components/store/StoreSidebar";
// import Toast from "../../components/common/Toast";
// import HQBtn from "../../components/common/HQBtn";
// import BackBtn from "../../components/common/BackBtn";

// export default function DetectiveStore() {
//   const [items, setItems] = useState([]);
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [ownedItemIds, setOwnedItemIds] = useState(new Set());
//   const [category, setCategory] = useState("all");
//   const [buyingItemId, setBuyingItemId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [inventoryLoading, setInventoryLoading] = useState(false);
//   const [equippingItemId, setEquippingItemId] = useState(null);
//   const [equippedItemId, setEquippedItemId] = useState(null);

//   const [username, setUsername] = useState("User");
//   const [tokensRemaining, setTokensRemaining] = useState(0);
//   const [profileImage, setProfileImage] = useState("/placeholder.png");

//   const getToken = () => localStorage.getItem("accessToken");

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   const showToast = (message, type = "success") => {
//     setToast({
//       show: true,
//       message,
//       type,
//     });
//   };

//   const normalizeImageUrl = (src) => {
//     if (!src) return "/placeholder.png";
//     if (src.startsWith("http")) return src;
//     if (src.startsWith("/uploads")) return `http://localhost:5051${src}`;
//     if (src.startsWith("/src")) return src;
//     return src;
//   };

//   const loadProfile = async () => {
//     try {
//       const res = await fetch("http://localhost:5051/api/profile", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       const data = await res.json();
//       console.log("PROFILE DATA:", data);

//       const user =
//         data?.user ||
//         data?.profile ||
//         data?.data?.user ||
//         data?.data ||
//         data;

//       setUsername(user?.username || user?.name || "User");
//       setTokensRemaining(user?.tokens ?? 0);

//       const avatarSrc =
//         user?.equippedAvatarItemId?.imageUrl ||
//         user?.avatar ||
//         "/placeholder.png";

//       setProfileImage(normalizeImageUrl(avatarSrc));
//     } catch (error) {
//       console.error("Failed to load profile:", error);
//       setUsername("User");
//       setTokensRemaining(0);
//       setProfileImage("/placeholder.png");
//     }
//   };

//   const loadInventory = async () => {
//     try {
//       const res = await fetch("http://localhost:5051/api/shop/inventory", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       const data = await res.json();
//       const inventory = Array.isArray(data) ? data : data.items || [];

//       setInventoryItems(inventory);

//       const ids = new Set(
//         inventory.map((inv) => String(inv.itemId?._id || inv.itemId || inv._id))
//       );

//       setOwnedItemIds(ids);
//     } catch (error) {
//       console.error("Failed to load inventory:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch("http://localhost:5051/api/shop/items");
//         const data = await res.json();

//         setItems(Array.isArray(data) ? data : data.items || []);
//       } catch (error) {
//         console.error("Failed to fetch store items:", error);
//         showToast("Failed to load store items", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//     loadInventory();
//     loadProfile();
//   }, []);

//   useEffect(() => {
//     if (category === "inventory") {
//       const fetchInventoryTab = async () => {
//         try {
//           setInventoryLoading(true);
//           await loadInventory();
//         } catch (error) {
//           console.error("Failed to fetch inventory:", error);
//           setInventoryItems([]);
//           showToast("Failed to load inventory", "error");
//         } finally {
//           setInventoryLoading(false);
//         }
//       };

//       fetchInventoryTab();
//     }
//   }, [category]);

//   const handleBuyTokens = async (itemId) => {
//     try {
//       setBuyingItemId(itemId);

//       const res = await fetch("http://localhost:5051/api/shop/purchase", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         showToast("Successful! Item purchased", "success");
//         await loadInventory();
//         await loadProfile();
//       } else {
//         showToast(data.message || "Purchase failed", "error");
//       }
//     } catch (error) {
//       console.error("Token purchase failed:", error);
//       showToast("Purchase failed", "error");
//     } finally {
//       setBuyingItemId(null);
//     }
//   };

//   const handleBuyPaid = async (itemId) => {
//     try {
//       setBuyingItemId(itemId);

//       const res = await fetch("http://localhost:5051/api/shop/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       const data = await res.json();

//       if (data?.url) {
//         showToast("Redirecting to payment...", "success");
//         window.location.href = data.url;
//       } else {
//         showToast(data.message || "Stripe checkout failed", "error");
//       }
//     } catch (error) {
//       console.error("Stripe checkout failed:", error);
//       showToast("Stripe checkout failed", "error");
//     } finally {
//       setBuyingItemId(null);
//     }
//   };

//   const handleEquip = async (item) => {
//     try {
//       setEquippingItemId(item._id);

//       const res = await fetch("http://localhost:5051/api/profile/equip-item", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({
//           itemId: item._id,
//           category: item.category,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setEquippedItemId(item._id);
//         showToast("Item equipped successfully!", "success");
//         await loadProfile();
//       } else {
//         showToast(data.message || "Failed to equip item", "error");
//       }
//     } catch (error) {
//       console.error("Equip failed:", error);
//       showToast("Failed to equip item", "error");
//     } finally {
//       setEquippingItemId(null);
//     }
//   };

//   const displayedItems = useMemo(() => {
//     if (category === "inventory") {
//       return inventoryItems.map((inv) => inv.itemId || inv);
//     }

//     if (category === "all") {
//       return items;
//     }

//     return items.filter(
//       (item) => item.category?.toLowerCase() === category.toLowerCase()
//     );
//   }, [category, items, inventoryItems]);

//   const sectionTitle =
//     category === "inventory"
//       ? "My Inventory"
//       : category === "all"
//       ? "All Items"
//       : `${category.charAt(0).toUpperCase() + category.slice(1)} Items`;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast((prev) => ({ ...prev, show: false }))}
//       />

//       <div className="flex items-center justify-between px-10 py-6">
//         <div className="flex items-center gap-4">
//           <HQBtn />
//           <BackBtn />
//         </div>

//         <div className="flex items-center gap-3 rounded-full border border-gray-700 bg-[#111] px-4 py-2">
//           <img
//             src={profileImage}
//             alt={username}
//             className="h-10 w-10 rounded-full object-cover border border-gray-600"
//             onError={(e) => {
//               e.currentTarget.src = "/placeholder.png";
//             }}
//           />

//           <div className="leading-tight">
//             <p className="text-sm font-semibold">{username}</p>
//             <p className="text-xs font-medium text-green-400">
//               {tokensRemaining} Tokens
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         <StoreSidebar category={category} setCategory={setCategory} />

//         <div className="flex-1 p-10">
//           <h1 className="mb-2 text-3xl font-bold">Detective Store</h1>
//           <p className="mb-10 text-gray-400">
//             Unlock exclusive avatars, themes, and titles to customize your
//             detective profile
//           </p>

//           <h2 className="mb-6 text-2xl font-semibold">{sectionTitle}</h2>

//           {loading && category !== "inventory" && (
//             <p className="text-gray-400">Loading store items...</p>
//           )}

//           {inventoryLoading && category === "inventory" && (
//             <p className="text-gray-400">Loading your inventory...</p>
//           )}

//           {!loading && !inventoryLoading && displayedItems.length === 0 && (
//             <p className="text-gray-400">
//               {category === "inventory"
//                 ? "You do not own any items yet."
//                 : "No items found in this category."}
//             </p>
//           )}

//           {!loading && !inventoryLoading && displayedItems.length > 0 && (
//             <StoreGrid
//               items={displayedItems}
//               onBuyXP={category === "inventory" ? undefined : handleBuyTokens}
//               onBuyPaid={category === "inventory" ? undefined : handleBuyPaid}
//               buyingItemId={buyingItemId}
//               isInventoryView={category === "inventory"}
//               onEquip={handleEquip}
//               equippingItemId={equippingItemId}
//               equippedItemId={equippedItemId}
//               ownedItemIds={ownedItemIds}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//--------------------------------------------------------------------------------------------------

// import { useEffect, useMemo, useState } from "react";
// import StoreGrid from "../../components/store/StoreGrid";
// import StoreSidebar from "../../components/store/StoreSidebar";
// import Toast from "../../components/common/Toast";
// import HQBtn from "../../components/common/HQBtn";
// import BackBtn from "../../components/common/BackBtn";


// export default function DetectiveStore() {
//   const [items, setItems] = useState([]);
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [ownedItemIds, setOwnedItemIds] = useState(new Set());
//   const [category, setCategory] = useState("all");
//   const [buyingItemId, setBuyingItemId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [inventoryLoading, setInventoryLoading] = useState(false);
//   const [equippingItemId, setEquippingItemId] = useState(null);
//   const [equippedItemId, setEquippedItemId] = useState(null);

//   const [username, setUsername] = useState("User");
//   const [tokensRemaining, setTokensRemaining] = useState(0);
//   const [profileImage, setProfileImage] = useState("/placeholder.png");

//   const getToken = () => localStorage.getItem("accessToken");

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });

//   const showToast = (message, type = "success") => {
//     setToast({
//       show: true,
//       message,
//       type,
//     });
//   };

//   const normalizeImageUrl = (src) => {
//     if (!src) return "/placeholder.png";
//     if (src.startsWith("http")) return src;
//     if (src.startsWith("/uploads")) return `http://localhost:5051${src}`;
//     if (src.startsWith("/src")) return src;
//     return src;
//   };

//   const loadProfile = async () => {
//     try {
//       const res = await fetch("http://localhost:5051/api/profile", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       const data = await res.json();
//       console.log("PROFILE DATA:", data);

//       const user =
//         data?.user ||
//         data?.profile ||
//         data?.data?.user ||
//         data?.data ||
//         data;

//       setUsername(user?.username || user?.name || "User");
//       setTokensRemaining(user?.tokens ?? 0);

//       const avatarSrc =
//         user?.equippedAvatarItemId?.imageUrl ||
//         user?.avatar ||
//         "/placeholder.png";

//       setProfileImage(normalizeImageUrl(avatarSrc));
//     } catch (error) {
//       console.error("Failed to load profile:", error);
//       setUsername("User");
//       setTokensRemaining(0);
//       setProfileImage("/placeholder.png");
//     }
//   };

//   const loadInventory = async () => {
//     try {
//       const res = await fetch("http://localhost:5051/api/shop/inventory", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       const data = await res.json();
//       const inventory = Array.isArray(data) ? data : data.items || [];

//       setInventoryItems(inventory);

//       const ids = new Set(
//         inventory.map((inv) => String(inv.itemId?._id || inv.itemId || inv._id))
//       );

//       setOwnedItemIds(ids);
//     } catch (error) {
//       console.error("Failed to load inventory:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch("http://localhost:5051/api/shop/items");
//         const data = await res.json();

//         setItems(Array.isArray(data) ? data : data.items || []);
//       } catch (error) {
//         console.error("Failed to fetch store items:", error);
//         showToast("Failed to load store items", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//     loadInventory();
//     loadProfile();
//   }, []);

//   useEffect(() => {
//     if (category === "inventory") {
//       const fetchInventoryTab = async () => {
//         try {
//           setInventoryLoading(true);
//           await loadInventory();
//         } catch (error) {
//           console.error("Failed to fetch inventory:", error);
//           setInventoryItems([]);
//           showToast("Failed to load inventory", "error");
//         } finally {
//           setInventoryLoading(false);
//         }
//       };

//       fetchInventoryTab();
//     }
//   }, [category]);

//   const handleBuyTokens = async (itemId) => {
//     try {
//       setBuyingItemId(itemId);

//       const res = await fetch("http://localhost:5051/api/shop/purchase", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         showToast("Successful! Item purchased", "success");
//         await loadInventory();
//         await loadProfile();
//       } else {
//         showToast(data.message || "Purchase failed", "error");
//       }
//     } catch (error) {
//       console.error("Token purchase failed:", error);
//       showToast("Purchase failed", "error");
//     } finally {
//       setBuyingItemId(null);
//     }
//   };

//   const handleBuyPaid = async (itemId) => {
//     try {
//       setBuyingItemId(itemId);

//       const res = await fetch("http://localhost:5051/api/shop/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       const data = await res.json();

//       if (data?.url) {
//         showToast("Redirecting to payment...", "success");
//         window.location.href = data.url;
//       } else {
//         showToast(data.message || "Stripe checkout failed", "error");
//       }
//     } catch (error) {
//       console.error("Stripe checkout failed:", error);
//       showToast("Stripe checkout failed", "error");
//     } finally {
//       setBuyingItemId(null);
//     }
//   };

//   const handleEquip = async (item) => {
//     try {
//       setEquippingItemId(item._id);

//       const res = await fetch("http://localhost:5051/api/profile/equip-item", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({
//           itemId: item._id,
//           category: item.category,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setEquippedItemId(item._id);
//         showToast("Item equipped successfully!", "success");
//         await loadProfile();
//       } else {
//         showToast(data.message || "Failed to equip item", "error");
//       }
//     } catch (error) {
//       console.error("Equip failed:", error);
//       showToast("Failed to equip item", "error");
//     } finally {
//       setEquippingItemId(null);
//     }
//   };

//   const displayedItems = useMemo(() => {
//     if (category === "inventory") {
//       return inventoryItems.map((inv) => inv.itemId || inv);
//     }

//     if (category === "all") {
//       return items;
//     }

//     return items.filter(
//       (item) => item.category?.toLowerCase() === category.toLowerCase()
//     );
//   }, [category, items, inventoryItems]);

//   const sectionTitle =
//     category === "inventory"
//       ? "My Inventory"
//       : category === "all"
//       ? "All Items"
//       : `${category.charAt(0).toUpperCase() + category.slice(1)} Items`;

//   return (
    
//       <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast((prev) => ({ ...prev, show: false }))}
//       />

//       <div className="flex items-center justify-between px-10 py-6">
//         <div className="flex items-center gap-4">
//           <HQBtn />
//           <BackBtn />
//         </div>

//         <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
//           <img
//             src={profileImage}
//             alt={username}
//             className="h-10 w-10 rounded-full object-cover border border-gray-300"
//             onError={(e) => {
//               e.currentTarget.src = "/placeholder.png";
//             }}
//           />

//           <div className="leading-tight">
//             <p className="text-sm font-semibold text-gray-900">{username}</p>
//             <p className="text-xs font-medium text-green-600">
//               {tokensRemaining} Tokens
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         <StoreSidebar category={category} setCategory={setCategory} />

//         <div className="flex-1 p-10">
//           <h1 className="mb-2 text-3xl font-bold text-gray-900">
//             Detective Store
//           </h1>
//           <p className="mb-10 text-gray-500">
//             Unlock exclusive avatars, themes, and titles to customize your
//             detective profile
//           </p>

//           <h2 className="mb-6 text-2xl font-semibold text-gray-900">
//             {sectionTitle}
//           </h2>

//           {loading && category !== "inventory" && (
//             <p className="text-gray-500">Loading store items...</p>
//           )}

//           {inventoryLoading && category === "inventory" && (
//             <p className="text-gray-500">Loading your inventory...</p>
//           )}

//           {!loading && !inventoryLoading && displayedItems.length === 0 && (
//             <p className="text-gray-500">
//               {category === "inventory"
//                 ? "You do not own any items yet."
//                 : "No items found in this category."}
//             </p>
//           )}

//           {!loading && !inventoryLoading && displayedItems.length > 0 && (
//             <StoreGrid
//               items={displayedItems}
//               onBuyXP={category === "inventory" ? undefined : handleBuyTokens}
//               onBuyPaid={category === "inventory" ? undefined : handleBuyPaid}
//               buyingItemId={buyingItemId}
//               isInventoryView={category === "inventory"}
//               onEquip={handleEquip}
//               equippingItemId={equippingItemId}
//               equippedItemId={equippedItemId}
//               ownedItemIds={ownedItemIds}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


//--------------------------------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import StoreGrid from "../../components/store/StoreGrid";
import StoreSidebar from "../../components/store/StoreSidebar";
import Toast from "../../components/common/Toast";
import HQBtn from "../../components/common/HQBtn";
import BackBtn from "../../components/common/BackBtn";
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

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { theme } = useTheme();

  const isLightFamily = ["light", "cream", "country"].includes(theme);
  const isDarkFamily = ["dark", "midnight"].includes(theme);
  
  const pageClass =
    theme === "light"
      ? "bg-gray-50 text-gray-900"
      : theme === "cream"
      ? "bg-[#f6f1e7] text-gray-900"
      : theme === "country"
      ? "bg-[#efe7dc] text-gray-900"
      : theme === "midnight"
      ? "bg-[#08142b] text-white"
      : "bg-black text-white";
  
  const chipClass = isLightFamily
    ? "border-gray-200 bg-white"
    : "border-gray-700 bg-[#111827]";
  
  const titleClass = isLightFamily ? "text-gray-900" : "text-white";
  const subTextClass = isLightFamily ? "text-gray-500" : "text-gray-400";
  const tokenClass = isLightFamily ? "text-green-600" : "text-green-400";
  const avatarBorderClass = isLightFamily ? "border-gray-300" : "border-gray-600";

  const getToken = () => localStorage.getItem("accessToken");

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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

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
        user?.avatar ||
        "/placeholder.png";

      setProfileImage(normalizeImageUrl(avatarSrc));
    } catch (error) {
      console.error("Failed to load profile:", error);
      setUsername("User");
      setTokensRemaining(0);
      setProfileImage("/placeholder.png");
    }
  };

  const loadInventory = async () => {
    try {
      const res = await fetch("http://localhost:5051/api/shop/inventory", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
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

  const handleBuyTokens = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch("http://localhost:5051/api/shop/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
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
      console.error("Token purchase failed:", error);
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
          Authorization: `Bearer ${getToken()}`,
        },
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
          Authorization: `Bearer ${getToken()}`,
        },
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
    <div className={`min-h-screen ${pageClass}`}>
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

        <div
          className={`flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm ${chipClass}`}
        >
          <img
            src={profileImage}
            alt={username}
            className={`h-10 w-10 rounded-full object-cover border ${avatarBorderClass}`}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />

          <div className="leading-tight">
            <p className={`text-sm font-semibold ${titleClass}`}>{username}</p>
            <p className={`text-xs font-medium ${tokenClass}`}>
              {tokensRemaining} Tokens
            </p>
          </div>
        </div>
      </div>

      <div className="flex">
        <StoreSidebar category={category} setCategory={setCategory} />

        <div className="flex-1 p-10">
          <h1 className={`mb-2 text-3xl font-bold ${titleClass}`}>
            Detective Store
          </h1>
          <p className={`mb-10 ${subTextClass}`}>
            Unlock exclusive avatars, themes, and titles to customize your
            detective profile
          </p>

          <h2 className={`mb-6 text-2xl font-semibold ${titleClass}`}>
            {sectionTitle}
          </h2>

          {loading && category !== "inventory" && (
            <p className={subTextClass}>Loading store items...</p>
          )}

          {inventoryLoading && category === "inventory" && (
            <p className={subTextClass}>Loading your inventory...</p>
          )}

          {!loading && !inventoryLoading && displayedItems.length === 0 && (
            <p className={subTextClass}>
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