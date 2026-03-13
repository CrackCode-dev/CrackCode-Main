// import StoreItemCard from "./StoreItemCard";

// export default function StoreGrid({ items }) {
//   return (
//     <div className="grid gap-8 grid-cols-4">

//       {items.map((item) => (
//         <StoreItemCard key={item._id} item={item} />
//       ))}

//     </div>
//   );
// }



import StoreItemCard from "./StoreItemCard";

export default function StoreGrid({ items = [], onBuy }) {
  if (!items.length) {
    return <p className="text-gray-400">No store items found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StoreItemCard
          key={item._id || item.id}
          item={item}
          onBuy={onBuy}
          loading={false}
        />
      ))}
    </div>
  );
}

