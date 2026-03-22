import Card from "../ui/Card";
import Button from "../ui/Button";
import { CirclePoundSterling, CircleDollarSign } from "lucide-react";
import { useTheme } from "../../context/theme/ThemeContext";

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
  const { theme } = useTheme();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5051";

  const rawImagePath = item.imageUrl || item.image || "";

  const normalizedImagePath = rawImagePath.startsWith("/upload/")
    ? rawImagePath.replace("/upload/", "/uploads/")
    : rawImagePath;

  const imageSrc = normalizedImagePath
    ? normalizedImagePath.startsWith("http")
      ? normalizedImagePath
      : `${API_BASE_URL}${normalizedImagePath}`
    : "/placeholder.png";

  const pricingType = item.pricing?.type;
  const amount = item.pricing?.amount ?? 0;
  const category = (item.category || item.type || "item").toLowerCase();

  const isEquipping = equippingItemId === item._id;
  const isEquipped = equippedItemId === item._id || item.isEquipped;

  const isLightFamily = ["light", "cream", "country"].includes(theme);

  const cardClass =
    theme === "light"
      ? "border-gray-200 bg-gray-100 shadow-md hover:shadow-lg"
      : theme === "cream"
      ? "border-[#ddd2c1] bg-[#f3ede3] shadow-md hover:shadow-lg"
      : theme === "country"
      ? "border-[#cfbea6] bg-[#efe4d3] shadow-md hover:shadow-lg"
      : theme === "midnight"
      ? "border-[#22314f] bg-[#12203c] shadow-md hover:shadow-xl"
      : "border-gray-800 bg-[#161616] shadow-md hover:shadow-xl";

  const imageAreaClass =
    theme === "light"
      ? "bg-gray-50"
      : theme === "cream"
      ? "bg-[#faf6ef]"
      : theme === "country"
      ? "bg-[#f7efe2]"
      : theme === "midnight"
      ? "bg-[#0d1a33]"
      : "bg-[#222222]";

  const contentAreaClass =
    theme === "light"
      ? "bg-gray-100"
      : theme === "cream"
      ? "bg-[#f3ede3]"
      : theme === "country"
      ? "bg-[#efe4d3]"
      : theme === "midnight"
      ? "bg-[#0f1b35]"
      : "bg-[#0f0f0f]";

  const titleClass = isLightFamily ? "text-gray-900" : "text-white";
  const metaClass =
    theme === "midnight"
      ? "text-gray-300"
      : isLightFamily
      ? "text-gray-500"
      : "text-gray-400";
  const ownedClass =
    theme === "midnight"
      ? "text-gray-300"
      : isLightFamily
      ? "text-gray-500"
      : "text-gray-400";
  const ratingClass = "text-green-500";
  const priceClass = isLightFamily ? "text-green-600" : "text-green-400";

  let displayPrice = "N/A";
  let buttonLabel = "Buy";
  let buttonAction = () => {};
  let isDisabled = loading;

  if (!isInventoryView) {
    if (pricingType === "tokens") {
      displayPrice = (
        <div className={`flex items-center gap-1.5 font-semibold ${priceClass}`}>
          <span>{amount}</span>
          <CirclePoundSterling className="h-4 w-4" />
        </div>
      );

      buttonLabel = loading ? "Buying..." : "Buy";
      buttonAction = () => onBuyXP?.(item._id);
    } else if (pricingType === "paid") {
      displayPrice = (
        <div className={`flex items-center gap-1.5 font-semibold ${priceClass}`}>
          <CircleDollarSign className="h-4 w-4" />
          <span>{amount}</span>
        </div>
      );

      buttonLabel = loading ? "Redirecting..." : "Buy with Card";
      buttonAction = () => onBuyPaid?.(item._id);
    } else if (pricingType === "free") {
      displayPrice = <span className={`font-semibold ${priceClass}`}>Free</span>;
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
      className={`overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 ${cardClass}`}
    >
      <div className={`flex h-44 items-center justify-center rounded-t-2xl ${imageAreaClass}`}>
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

      <div className={`p-4 ${contentAreaClass}`}>
        <p className={`text-xs uppercase tracking-wide ${metaClass}`}>
          {item.category || item.type || "item"}
        </p>

        <h3 className={`mt-1 text-lg font-semibold ${titleClass}`}>
          {item.name}
        </h3>

        <div className={`mt-2 text-sm ${ratingClass}`}>★★★★☆</div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {!isInventoryView ? (
            <div>{displayPrice}</div>
          ) : (
            <span className={`text-sm font-medium ${ownedClass}`}>Owned</span>
          )}

          <Button onClick={buttonAction} disabled={isDisabled} size="sm">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}