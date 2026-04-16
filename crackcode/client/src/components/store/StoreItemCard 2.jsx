import Card from "../ui/Card";
import Button from "../ui/Button";
import { CirclePoundSterling, CircleDollarSign } from "lucide-react";

export default function StoreItemCard({
  item,
  onBuyXP,
  onBuyPaid,
  loading = false,
  isInventoryView = false,
  onEquip,
  equippingItemId,
  equippedItemId,
  ownedItemIds,
}) {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5051";

  // --- Image URL resolution ---
  // Items can come from different sources (seeds, uploads, CDN) with inconsistent path formats.
  // This block normalises all of them into a usable <img> src.
  const rawImagePath = item.imageUrl || item.image || "";

  let imageSrc = "/placeholder.png";
  if (rawImagePath && rawImagePath.trim()) {
    const p = rawImagePath.trim();

    if (/^https?:\/\//i.test(p)) {
      // Already a full URL (CDN or external)
      imageSrc = p;
    } else if (p.startsWith("/upload/")) {
      // Legacy typo in seed data: /upload/ → /uploads/ served from the API server
      imageSrc = `${API_BASE_URL}${p.replace("/upload/", "/uploads/")}`;
    } else if (p.startsWith("/uploads") || p.includes("/uploads/")) {
      // Standard server-hosted upload path
      imageSrc = `${API_BASE_URL}${p.startsWith("/") ? p : `/${p}`}`;
    } else if (p.startsWith("/")) {
      // Absolute path — Vite serves this from the client /public folder
      imageSrc = p;
    } else {
      // Relative path (e.g. "avatars/detective.png") — extract filename and look in /public/shop/
      const parts = p.split(/[\\/]/);
      const filename = parts[parts.length - 1] || p;
      imageSrc = `/shop/${filename}`;
    }
  }

  // --- Pricing & category ---
  const pricingType = item.pricing?.type;          // "tokens" | "paid" | "free"
  const amount = item.pricing?.amount ?? 0;        // Numeric price value
  const category = (item.category || item.type || "item").toLowerCase(); // "avatar" | "theme" | "title"

  // --- Ownership / equip state ---
  const isEquipping = equippingItemId === item._id; // This card's equip request is in flight
  const isEquipped = equippedItemId === item._id || item.isEquipped; // Currently active item
  const isOwned = isInventoryView || (ownedItemIds instanceof Set
    ? ownedItemIds.has(String(item._id))
    : false); // True if in inventory view or ID found in owned set

  // Shared colour classes (no dark/light switching needed — handled by CSS vars elsewhere)
  const ratingClass = "text-green-500";
  const priceClass = "text-green-500";

  // --- Button & price logic ---
  // Defaults — overridden by the branches below
  let displayPrice = "N/A";
  let buttonLabel = "Buy";
  let buttonAction = () => { };
  let isDisabled = loading;

  if (isOwned && !isInventoryView) {
    // CASE 1: Item is owned but the user is browsing the store (not the inventory tab).
    // Show "Owned" in place of the price and switch to equip controls.
    displayPrice = <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Owned</span>;

    if (isEquipped) {
      // Already active — show a disabled "Equipped / Applied" label
      if (category === "theme") buttonLabel = "Theme Applied";
      else if (category === "title") buttonLabel = "Title Equipped";
      else buttonLabel = "Avatar Equipped";
      isDisabled = true;
    } else {
      // Not yet active — allow the user to equip it
      if (category === "theme") buttonLabel = isEquipping ? "Applying..." : "Apply Theme";
      else if (category === "title") buttonLabel = isEquipping ? "Equipping..." : "Equip Title";
      else buttonLabel = isEquipping ? "Equipping..." : "Equip Avatar";
      isDisabled = isEquipping;
      buttonAction = () => onEquip?.(item);
    }

  } else if (!isInventoryView) {
    // CASE 2: Store view, item not yet owned — show buy controls based on pricing type.

    if (pricingType === "tokens") {
      // Token purchase: show amount + pound-sterling icon
      displayPrice = (
        <div className={`flex items-center gap-1.5 font-semibold ${priceClass}`}>
          <span>{amount}</span>
          <CirclePoundSterling className="h-4 w-4" />
        </div>
      );
      buttonLabel = loading ? "Buying..." : "Buy";
      buttonAction = () => onBuyXP?.(item._id);

    } else if (pricingType === "paid") {
      // Stripe purchase: show dollar icon + amount, redirect to Stripe on click
      displayPrice = (
        <div className={`flex items-center gap-1.5 font-semibold ${priceClass}`}>
          <CircleDollarSign className="h-4 w-4" />
          <span>{amount}</span>
        </div>
      );
      buttonLabel = loading ? "Redirecting..." : "Buy with Card";
      buttonAction = () => onBuyPaid?.(item._id);

    } else if (pricingType === "free") {
      // Free item: no cost, just claim it (goes through the same token-purchase endpoint)
      displayPrice = <span className={`font-semibold ${priceClass}`}>Free</span>;
      buttonLabel = loading ? "Claiming..." : "Claim";
      buttonAction = () => onBuyXP?.(item._id);
    }

  } else {
    // CASE 3: Inventory view — item is owned, show equip controls only (no price).
    displayPrice = "";

    if (isEquipped) {
      // Already active — disable button with context-aware label
      if (category === "theme") buttonLabel = "Theme Applied";
      else if (category === "title") buttonLabel = "Title Equipped";
      else buttonLabel = "Avatar Equipped";
      isDisabled = true;
      buttonAction = () => { };
    } else {
      // Not yet active — allow equipping
      if (category === "theme") buttonLabel = isEquipping ? "Applying..." : "Apply Theme";
      else if (category === "title") buttonLabel = isEquipping ? "Equipping..." : "Equip Title";
      else buttonLabel = isEquipping ? "Equipping..." : "Equip Avatar";
      isDisabled = isEquipping;
      buttonAction = () => onEquip?.(item);
    }
  }

  // --- Render ---
  return (
    <Card
      variant="flat"
      padding="none"
      shadow="md"
      className="overflow-hidden rounded-2xl border transition hover:-translate-y-0.5"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Item image area */}
      <div
        className="flex h-44 items-center justify-center rounded-t-2xl"
        style={{ background: 'var(--surface2)' }}
      >
        <img
          src={imageSrc}
          alt={item.name}
          className="h-24 object-contain"
          onError={(e) => {
            // If the image fails to load, fall back to the placeholder silently
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      {/* Item details: category label, name, star rating, price + action button */}
      <div className="p-4" style={{ background: 'var(--surface)' }}>
        {/* Category badge (e.g. "AVATAR", "THEME") */}
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
          {item.category || item.type || "item"}
        </p>

        {/* Item name */}
        <h3 className="mt-1 text-lg font-semibold" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>

        {/* Static star rating display (hardcoded for now) */}
        <div className={`mt-2 text-sm ${ratingClass}`}>★★★★☆</div>

        {/* Bottom row: price on the left, action button on the right */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {!isInventoryView ? (
            <div>{displayPrice}</div>
          ) : (
            // In inventory view, always show "Owned" label instead of a price
            <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Owned</span>
          )}

          <Button onClick={buttonAction} disabled={isDisabled} size="sm">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
