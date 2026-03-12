import StoreItemCard from "./StoreItemCard";

export default function StoreGrid({ items, onBuy, buyingItemId }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <StoreItemCard
          key={item._id}
          item={item}
          onBuy={onBuy}
          loading={buyingItemId === item._id}
        />
      ))}
    </div>
  );
}