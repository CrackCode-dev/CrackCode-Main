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
}) {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5051";

  const rawImagePath = item.imageUrl || item.image || "";

  let imageSrc = "/placeholder.png";
  if (rawImagePath && rawImagePath.trim()) {
    const p = rawImagePath.trim();

    if (/^https?:\/\//i.test(p)) {
      imageSrc = p;
    } else if (p.startsWith("/upload/")) {
      imageSrc = `${API_BASE_URL}${p.replace("/upload/", "/uploads/")}`;
    } else if (p.startsWith("/uploads") || p.includes("/uploads/")) {
      imageSrc = `${API_BASE_URL}${p.startsWith("/") ? p : `/${p}`}`;
    } else if (p.startsWith("/")) {
      imageSrc = p;
    } else {
      const parts = p.split(/[\\/]/);
      const filename = parts[parts.length - 1] || p;
      imageSrc = `/shop/${filename}`;
    }
  }

  const pricingType = item.pricing?.type;
  const amount = item.pricing?.amount ?? 0;
  const category = (item.category || item.type || "item").toLowerCase();

  const isEquipping = equippingItemId === item._id;
  const isEquipped = equippedItemId === item._id || item.isEquipped;

  let displayPrice = "N/A";
  let buttonLabel = "Buy";
  let buttonAction = () => {};
  let isDisabled = loading;

  if (!isInventoryView) {
    if (pricingType === "tokens") {
      displayPrice = (
        <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--brand)' }}>
          <span>{amount}</span>
          <CirclePoundSterling className="h-4 w-4" />
        </div>
      );
      buttonLabel = loading ? "Buying..." : "Buy";
      buttonAction = () => onBuyXP?.(item._id);
    } else if (pricingType === "paid") {
      displayPrice = (
        <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--brand)' }}>
          <CircleDollarSign className="h-4 w-4" />
          <span>{amount}</span>
        </div>
      );
      buttonLabel = loading ? "Redirecting..." : "Buy with Card";
      buttonAction = () => onBuyPaid?.(item._id);
    } else if (pricingType === "free") {
      displayPrice = <span className="font-semibold" style={{ color: 'var(--brand)' }}>Free</span>;
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
    <Card
      variant="flat"
      padding="none"
      shadow="md"
      className="overflow-hidden rounded-2xl border transition hover:-translate-y-0.5"
      style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
    >
      <div
        className="flex h-44 items-center justify-center rounded-t-2xl"
        style={{ background: 'var(--surface)' }}
      >
        <img
          src={imageSrc}
          alt={item.name}
          className="h-24 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      <div className="p-4" style={{ background: 'var(--surface2)' }}>
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
          {item.category || item.type || "item"}
        </p>

        <h3 className="mt-1 text-lg font-semibold" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>

        <div className="mt-2 text-sm text-green-500">★★★★☆</div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {!isInventoryView ? (
            <div>{displayPrice}</div>
          ) : (
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
