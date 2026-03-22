export default function StoreSidebar({ category, setCategory }) {
  const categories = [
    { label: "All", value: "all" },
    { label: "Avatars", value: "avatar" },
    { label: "Themes", value: "theme" },
    { label: "My Inventory", value: "inventory" },
  ];

  return (
    <div
      className="w-64 border-r p-6 sticky top-20 self-start min-h-[calc(100vh-5rem)]"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <h3
        className="mb-6 text-sm font-semibold uppercase tracking-wide"
        style={{ color: 'var(--muted)' }}
      >
        Categories
      </h3>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className="rounded-lg px-4 py-2 text-left text-sm font-medium transition"
            style={
              category === cat.value
                ? { background: 'var(--brand)', color: 'var(--brandInk)' }
                : { color: 'var(--textSec)', background: 'transparent' }
            }
            onMouseEnter={(e) => {
              if (category !== cat.value) {
                e.currentTarget.style.background = 'var(--surface2)';
              }
            }}
            onMouseLeave={(e) => {
              if (category !== cat.value) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
