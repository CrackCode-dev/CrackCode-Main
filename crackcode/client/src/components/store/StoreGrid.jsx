import StoreItemCard from "./StoreItemCard";

export default function StoreGrid({
  items,
  onBuyXP,
  onBuyPaid,
  buyingItemId,
  isInventoryView = false,
  onEquip,
  equippingItemId,
  equippedItemId,
  ownedItemIds,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StoreItemCard
          key={item._id}
          item={item}
          onBuyXP={onBuyXP}
          onBuyPaid={onBuyPaid}
          buyingItemId={buyingItemId}
          isInventoryView={isInventoryView}
          onEquip={onEquip}
          equippingItemId={equippingItemId}
          equippedItemId={equippedItemId}
          ownedItemIds={ownedItemIds}
        />
      ))}
    </div>
  );
}