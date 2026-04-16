import StoreItemCard from "./StoreItemCard";

/**
 * StoreGrid — renders a responsive grid of StoreItemCards.
 *
 * Props:
 * - items          : array of item objects to display
 * - onBuyXP        : handler for token-based purchases (undefined in inventory view)
 * - onBuyPaid      : handler for Stripe/card purchases (undefined in inventory view)
 * - buyingItemId   : ID of the item currently being purchased (used to show a loading state on its button)
 * - isInventoryView: when true, hides buy buttons and shows the equip button instead
 * - onEquip        : handler called when the user clicks "Equip" on an owned item
 * - equippingItemId: ID of the item currently being equipped (used to show a loading state)
 * - equippedItemId : ID of the item the user currently has equipped (used to highlight it)
 * - ownedItemIds   : Set of item IDs the user already owns (used to disable buy buttons)
 */
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
    // Responsive grid: 1 column on mobile, 2 on md, 4 on xl
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        // Each item gets its own card; all handlers and state are passed down
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