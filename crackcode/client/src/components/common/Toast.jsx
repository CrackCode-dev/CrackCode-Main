import { useEffect } from "react";

export default function Toast({ message, type = "success", show, onClose }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  const color =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className="fixed right-6 top-6 z-50 animate-fade-in">
      <div className={`${color} rounded-lg px-5 py-3 text-white shadow-lg`}>
        {message}
      </div>
    </div>
  );
}