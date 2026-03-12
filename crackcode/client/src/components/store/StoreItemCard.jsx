import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function StoreItemCard({ item, onBuy, loading }) {
  return (
    <Card
      variant="flat"
      padding="md"
      shadow="md"
      bordered={true}
      hoverEffect="lift"
      title={item.name}
      description={item.description}
      badge={
        item.rarity ? <Badge>{item.rarity}</Badge> : null
      }
      points={
        <span className="text-cyan-400 font-semibold">
          {item.price} XP
        </span>
      }
      actions={
        <Button onClick={() => onBuy(item._id)} disabled={loading}>
          {loading ? "Buying..." : "Buy"}
        </Button>
      }
    />
  );
}