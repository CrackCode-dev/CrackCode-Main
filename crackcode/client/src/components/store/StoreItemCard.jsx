
// import Card from "../ui/Card";
// import Button from "../ui/Button";

// export default function StoreItemCard({
//   item,
//   onBuyXP,
//   onBuyPaid,
//   loading = false,
//   isInventoryView = false,
//   onEquip,
//   equippingItemId,
//   equippedItemId,
// }) {
//   const imagePath = item.imageUrl || item.image || "";
//   const normalizedImagePath = imagePath.startsWith("/upload/")
//     ? imagePath.replace("/upload/", "/uploads/")
//     : imagePath;

//   const imageSrc = normalizedImagePath
//     ? normalizedImagePath.startsWith("http")
//       ? normalizedImagePath
//       : `http://localhost:5050${normalizedImagePath}`
//     : "/placeholder.png";

//   const pricingType = item.pricing?.type;
//   const amount = item.pricing?.amount ?? 0;
//   const currency = item.pricing?.currency ?? "USD";

//   const category = (item.category || item.type || "item").toLowerCase();

//   const isEquipping = equippingItemId === item._id;
//   const isEquipped = equippedItemId === item._id || item.isEquipped;

//   let displayPrice = "N/A";
//   let buttonLabel = "Buy";
//   let buttonAction = () => {};
//   let isDisabled = loading;

//   if (!isInventoryView) {
//     if (pricingType === "xp") {
//       displayPrice = `${amount} XP`;
//       buttonLabel = loading ? "Buying..." : "Buy";
//       buttonAction = () => onBuyXP?.(item._id);
//     } else if (pricingType === "paid") {
//       displayPrice = `${currency === "USD" ? "$" : ""}${amount}`;
//       buttonLabel = loading ? "Redirecting..." : "Buy with Card";
//       buttonAction = () => onBuyPaid?.(item._id);
//     } else if (pricingType === "free") {
//       displayPrice = "Free";
//       buttonLabel = loading ? "Claiming..." : "Claim";
//       buttonAction = () => onBuyXP?.(item._id);
//     }
//   } else {
//     displayPrice = "";

//     if (isEquipped) {
//       if (category === "theme") {
//         buttonLabel = "Theme Applied";
//       } else if (category === "title") {
//         buttonLabel = "Title Equipped";
//       } else {
//         buttonLabel = "Avatar Equipped";
//       }
//       isDisabled = true;
//       buttonAction = () => {};
//     } else {
//       if (category === "theme") {
//         buttonLabel = isEquipping ? "Applying..." : "Apply Theme";
//       } else if (category === "title") {
//         buttonLabel = isEquipping ? "Equipping..." : "Equip Title";
//       } else {
//         buttonLabel = isEquipping ? "Equipping..." : "Equip Avatar";
//       }
//       isDisabled = isEquipping;
//       buttonAction = () => onEquip?.(item);
//     }
//   }

//   return (
//     <Card variant="flat" padding="none" shadow="md" className="overflow-hidden">
//       <div className="bg-[#2a2a2a] h-40 flex items-center justify-center rounded-t-lg">
//         <img
//           src={imageSrc}
//           alt={item.name}
//           className="h-24 object-contain"
//           onError={(e) => {
//             e.currentTarget.src = "/placeholder.png";
//           }}
//         />
//       </div>

//       <div className="p-4">
//         <p className="text-xs text-gray-400 uppercase">
//           {item.category || item.type || "item"}
//         </p>

//         <h3 className="text-lg font-semibold text-white">
//           {item.name}
//         </h3>

//         <div className="text-green-500 text-sm mt-2">
//           ★★★★☆
//         </div>

//         <div className="flex justify-between items-center mt-4">
//           {!isInventoryView ? (
//             <span className="text-green-400 font-semibold">
//               {displayPrice}
//             </span>
//           ) : (
//             <span className="text-sm text-gray-400">
//               Owned
//             </span>
//           )}

//           <Button onClick={buttonAction} disabled={isDisabled} size="sm">
//             {buttonLabel}
//           </Button>
//         </div>
//       </div>
//     </Card>
//   );
// }



import Card from "../ui/Card";
import Button from "../ui/Button";

export default function StoreItemCard({
  item,
  onBuyXP,
  onBuyPaid,
  loading = false,
  isInventoryView = false,
  onEquip,
  equippingItemId,
  equippedItemId,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

  const imagePath = item.imageUrl || item.image || "";

  const imageSrc = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${API_BASE_URL}${imagePath}`
    : "/placeholder.png";

  const pricingType = item.pricing?.type;
  const amount = item.pricing?.amount ?? 0;
  const currency = item.pricing?.currency ?? "USD";

  const category = (item.category || item.type || "item").toLowerCase();

  const isEquipping = equippingItemId === item._id;
  const isEquipped = equippedItemId === item._id || item.isEquipped;

  let displayPrice = "N/A";
  let buttonLabel = "Buy";
  let buttonAction = () => {};
  let isDisabled = loading;

  if (!isInventoryView) {
    if (pricingType === "xp") {
      displayPrice = `${amount} XP`;
      buttonLabel = loading ? "Buying..." : "Buy";
      buttonAction = () => onBuyXP?.(item._id);
    } else if (pricingType === "paid") {
      displayPrice = `${currency === "USD" ? "$" : ""}${amount}`;
      buttonLabel = loading ? "Redirecting..." : "Buy with Card";
      buttonAction = () => onBuyPaid?.(item._id);
    } else if (pricingType === "free") {
      displayPrice = "Free";
      buttonLabel = loading ? "Claiming..." : "Claim";
      buttonAction = () => onBuyXP?.(item._id);
    }
  } else {
    displayPrice = "";

    if (isEquipped) {
      if (category === "theme") {
        buttonLabel = "Theme Applied";
      } else if (category === "title") {
        buttonLabel = "Title Equipped";
      } else {
        buttonLabel = "Avatar Equipped";
      }
      isDisabled = true;
      buttonAction = () => {};
    } else {
      if (category === "theme") {
        buttonLabel = isEquipping ? "Applying..." : "Apply Theme";
      } else if (category === "title") {
        buttonLabel = isEquipping ? "Equipping..." : "Equip Title";
      } else {
        buttonLabel = isEquipping ? "Equipping..." : "Equip Avatar";
      }
      isDisabled = isEquipping;
      buttonAction = () => onEquip?.(item);
    }
  }

  return (
    <Card variant="flat" padding="none" shadow="md" className="overflow-hidden">
      <div className="bg-[#2a2a2a] h-40 flex items-center justify-center rounded-t-lg">
        <img
          src={imageSrc}
          alt={item.name}
          className="h-24 object-contain"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase">
          {item.category || item.type || "item"}
        </p>

        <h3 className="text-lg font-semibold text-white">
          {item.name}
        </h3>

        <div className="text-green-500 text-sm mt-2">
          ★★★★☆
        </div>

        <div className="flex justify-between items-center mt-4">
          {!isInventoryView ? (
            <span className="text-green-400 font-semibold">
              {displayPrice}
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              Owned
            </span>
          )}

          <Button onClick={buttonAction} disabled={isDisabled} size="sm">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}