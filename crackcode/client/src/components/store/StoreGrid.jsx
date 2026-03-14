// import StoreItemCard from "./StoreItemCard";

// export default function StoreGrid({ items = [], onBuy, buyingItemId }) {
//   if (!items.length) {
//     return <p className="text-gray-400">No store items found.</p>;
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//       {items.map((item) => (
//         <StoreItemCard
//           key={item._id || item.id}
//           item={item}
//           onBuy={onBuy}
//           loading={buyingItemId === item._id}
//         />
//       ))}
//     </div>
//   );
// }


import StoreItemCard from "./StoreItemCard";

export default function StoreGrid({
  items = [],
  onBuyXP,
  onBuyPaid,
  buyingItemId,
}) {
  if (!items.length) {
    return <p className="text-gray-400">No store items found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StoreItemCard
          key={item._id || item.id}
          item={item}
          onBuyXP={onBuyXP}
          onBuyPaid={onBuyPaid}
          loading={buyingItemId === item._id}
        />
      ))}
    </div>
  );
}