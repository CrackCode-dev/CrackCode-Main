// import { useEffect, useState } from "react";
// import StoreGrid from "../../components/store/StoreGrid";
// import StoreSidebar from "../../components/store/StoreSidebar";

// export default function DetectiveStore() {
//   const [items, setItems] = useState([]);
//   const [category, setCategory] = useState("all");
//   const [buyingItemId, setBuyingItemId] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await fetch("http://localhost:5050/api/shop/items");
//         const data = await res.json();
//         console.log("shop items response:", data);
//         setItems(Array.isArray(data) ? data : data.items || []);
//       } catch (error) {
//         console.error("Failed to fetch store items:", error);
//       }
//     };

//     fetchItems();
//   }, []);

//   const handleBuy = async (itemId) => {
//     try {
//       const res = await fetch("http://localhost:5050/api/shop/purchase", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ itemId }),
//       });

//       const data = await res.json();
//       console.log("Purchase result:", data);
//     } catch (error) {
//       console.error("Purchase failed:", error);
//     }
//   };

//   const filteredItems =
//     category === "all"
//       ? items
//       : items.filter((item) => item.category === category);

//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       <StoreSidebar category={category} setCategory={setCategory} />

//       <div className="flex-1 p-10">
//         <h1 className="text-5xl font-bold mb-2">Detective Store</h1>
//         <p className="text-gray-400 mb-10">
//           Unlock exclusive avatars, themes, and titles to customize your detective profile
//         </p>

//         <h2 className="text-2xl font-semibold mb-6">
//           {category === "all" ? "All Items" : category}
//         </h2>

//         <StoreGrid 
//         items={filteredItems} 
//         onBuy={handleBuy} 
//         buyingItemId = {buyingItemId}
//         />
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import StoreGrid from "../../components/store/StoreGrid";
import StoreSidebar from "../../components/store/StoreSidebar";

export default function DetectiveStore() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [buyingItemId, setBuyingItemId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/shop/items");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error("Failed to fetch store items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleBuyXP = async (itemId) => {
    try {
      setBuyingItemId(itemId);

      const res = await fetch("http://localhost:5050/api/shop/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();
      console.log("XP purchase result:", data);
    } catch (error) {
      console.error("XP purchase failed:", error);
    } finally {
      setBuyingItemId(null);
    }
  };

  const handleBuyPaid = async (itemId) => {
    try {
      setBuyingItemId(itemId);
  
      const res = await fetch("http://localhost:5050/api/shop/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      });
  
      const data = await res.json();
      console.log("Stripe checkout result:", data);
  
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Stripe checkout failed:", error);
    } finally {
      setBuyingItemId(null);
    }
  };

  // const handleBuyPaid = async (itemId) => {
  //   try {
  //     setBuyingItemId(itemId);

  //     const res = await fetch("http://localhost:5050/api/shop/checkout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({ itemId }),
  //     });

  //     const data = await res.json();
  //     console.log("Stripe checkout result:", data);

  //     if (data?.url) {
  //       window.location.href = data.url;
  //     }
  //   } catch (error) {
  //     console.error("Stripe checkout failed:", error);
  //   } finally {
  //     setBuyingItemId(null);
  //   }
  // };

  const filteredItems =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <StoreSidebar category={category} setCategory={setCategory} />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-bold mb-2">Detective Store</h1>
        <p className="text-gray-400 mb-10">
          Unlock exclusive avatars, themes, and titles to customize your detective profile
        </p>

        <h2 className="text-2xl font-semibold mb-6">All Items</h2>

        <StoreGrid
          items={filteredItems}
          onBuyXP={handleBuyXP}
          onBuyPaid={handleBuyPaid}
          buyingItemId={buyingItemId}
        />
      </div>
    </div>
  );
}