import { useTheme } from "../../context/theme/ThemeContext";

export default function StoreSidebar({ category, setCategory }) {
  const { theme } = useTheme();

  const categories = [
    { label: "All", value: "all" },
    { label: "Avatars", value: "avatar" },
    { label: "Themes", value: "theme" },
    
    { label: "My Inventory", value: "inventory" },
  ];

  const isLightFamily = ["light", "cream", "country"].includes(theme);

  const sidebarClass =
    theme === "light"
      ? "bg-gray-100 border-gray-200"
      : theme === "cream"
      ? "bg-[#eee7db] border-[#ddd2c1]"
      : theme === "country"
      ? "bg-[#e7dccd] border-[#d4c4ad]"
      : theme === "midnight"
      ? "bg-[#0f1b35] border-[#1e2c4d]"
      : "bg-[#111111] border-gray-800";

  const headingClass = isLightFamily ? "text-gray-600" : "text-gray-400";

  const idleButtonClass =
    theme === "light"
      ? "text-gray-700 hover:bg-gray-200"
      : theme === "cream"
      ? "text-gray-700 hover:bg-[#e6dccd]"
      : theme === "country"
      ? "text-gray-800 hover:bg-[#dccdb8]"
      : theme === "midnight"
      ? "text-gray-200 hover:bg-[#162544]"
      : "text-gray-300 hover:bg-gray-800";

  return (
    <div className={`w-64 border-r p-6 ${sidebarClass}`}>
      <h3 className={`mb-6 text-sm font-semibold uppercase tracking-wide ${headingClass}`}>
        Categories
      </h3>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`rounded-lg px-4 py-2 text-left text-sm font-medium transition ${
              category === cat.value
                ? "bg-green-600 text-white shadow-sm"
                : idleButtonClass
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}