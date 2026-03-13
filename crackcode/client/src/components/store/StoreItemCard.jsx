// import Card from "../ui/Card";
// import Button from "../ui/Button";
// import Badge from "../ui/Badge";

// export default function StoreItemCard({ item, onBuy, loading }) {
//   return (
//     <Card
//       variant="flat"
//       padding="md"
//       shadow="md"
//       bordered={true}
//       hoverEffect="lift"
//       title={item.name}
//       description={item.description}
//       badge={
//         item.rarity ? <Badge>{item.rarity}</Badge> : null
//       }
//       points={
//         <span className="text-cyan-400 font-semibold">
//           {item.price} XP
//         </span>
//       }
//       actions={
//         <Button onClick={() => onBuy(item._id)} disabled={loading}>
//           {loading ? "Buying..." : "Buy"}
//         </Button>
//       }
//     />
//   );
// }



import Card from "../ui/Card";
import Button from "../ui/Button";

export default function StoreItemCard({ item }) {
  return (
    <Card variant="flat" padding="none" shadow="md">

      {/* Image */}
      <div className="bg-[#2a2a2a] h-40 flex items-center justify-center rounded-t-lg">
        <img src={item.image} alt={item.name} className="h-24" />
      </div>

      {/* Info */}
      <div className="p-4">

        <p className="text-xs text-gray-400 uppercase">
          {item.type}
        </p>

        <h3 className="text-lg font-semibold">
          {item.name}
        </h3>

        {/* Rating */}
        <div className="text-green-500 text-sm mt-2">
          ★★★★☆
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-4">

          <span className="text-green-400 font-semibold">
            {item.price}
          </span>

          <Button size="sm">
            Buy
          </Button>

        </div>

      </div>

    </Card>
  );
}