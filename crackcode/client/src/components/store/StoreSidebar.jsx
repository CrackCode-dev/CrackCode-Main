

// export default function StoreSidebar({ category, setCategory }) {
//   const categories = [
//     { label: "All", value: "all" },
//     { label: "Avatars", value: "avatar" },
//     { label: "Themes", value: "theme" },
//     { label: "Titles", value: "title" },
//     { label: "My Inventory", value: "inventory" },
//   ];

//   return (
//     <div className="w-64 border-r border-gray-800 p-6">
//       <h3 className="mb-6 text-gray-400">Categories</h3>

//       <div className="flex flex-col gap-4">
//         {categories.map((cat) => (
//           <button
//             key={cat.value}
//             onClick={() => setCategory(cat.value)}
//             className={`rounded-lg px-4 py-2 text-left ${
//               category === cat.value
//                 ? "bg-green-600 text-white"
//                 : "text-gray-300 hover:bg-gray-800"
//             }`}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
export default function StoreSidebar({ category, setCategory }) {
  const categories = [
    { label: "All", value: "all" },
    { label: "Avatars", value: "avatar" },
    { label: "Themes", value: "theme" },
    { label: "Titles", value: "title" },
    { label: "My Inventory", value: "inventory" },
  ];

  return (
    <div className="w-64 border-r border-gray-800 p-6">
      <h3 className="mb-6 text-gray-400">Categories</h3>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`rounded-lg px-4 py-2 text-left transition ${
              category === cat.value
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}