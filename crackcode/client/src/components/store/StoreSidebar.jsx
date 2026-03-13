export default function StoreSidebar({ category, setCategory }) {
    const categories = ["all", "avatars", "themes", "titles"];
  
    return (
      <div className="w-64 border-r border-gray-800 p-6">
  
        <h3 className="text-gray-400 mb-6">Categories</h3>
  
        <div className="flex flex-col gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-left px-4 py-2 rounded-lg capitalize ${
                category === cat
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
  
      </div>
    );
  }