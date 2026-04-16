/**
 * StoreSidebar — left-side navigation panel for the Detective Store.
 *
 * Renders a list of category filter buttons. Clicking a button updates
 * the active category in DetectiveStore, which filters the item grid.
 *
 * Props:
 * - category    : the currently active category value (e.g. "all", "avatar")
 * - setCategory : setter from DetectiveStore's useState — called on button click
 */

export default function StoreSidebar({ category, setCategory }) {

  // Each entry defines the visible label and the value passed to setCategory.
  // "inventory" is a special value — DetectiveStore shows the user's owned items instead of shop items.
  const categories = [
    { label: "All",          value: "all" },
    { label: "Avatars",      value: "avatar" },
    { label: "Themes",       value: "theme" },
    { label: "My Inventory", value: "inventory" },
  ];

  return (
    // Sticky sidebar — stays in view as the user scrolls down the item grid.
    // top-20 accounts for the fixed Header height (mt-20 on the main layout).
    // self-start prevents the sidebar from stretching to the full column height.
    <div
      className="w-64 border-r p-6 sticky top-20 self-start length min-h-[calc(100vh-5rem)]"
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
            onClick={() => setCategory(cat.value)} // Notify parent to filter by this category
            className="rounded-lg px-4 py-2 text-left text-sm font-medium transition"
            style={
              // Active category: highlighted background + brand-coloured left border indicator
              // Inactive category: transparent background, muted text, invisible border placeholder
              // (the 3px transparent border keeps layout stable so items don't shift on activation)
              category === cat.value
                ? { background: 'var(--surface2)', color: 'var(--text)', borderLeft: '3px solid var(--brand)' }
                : { color: 'var(--muted)', background: 'transparent', borderLeft: '3px solid transparent' }
            }
            onMouseEnter={(e) => {
              // Hover highlight — only applied to inactive buttons so the active style isn't overridden
              if (category !== cat.value) {
                e.currentTarget.style.background = 'var(--surface2)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              // Reset hover style — again only for inactive buttons
              if (category !== cat.value) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--muted)';
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
