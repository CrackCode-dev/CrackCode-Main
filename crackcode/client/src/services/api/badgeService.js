// Badge API Service
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5051";

/*
  Fetch user's badge progress
 */
export const fetchBadgeProgress = async () => {
  const res = await fetch(`${BASE_URL}/api/badges/my-progress`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();

  if (data.success && Array.isArray(data.data)) {
    return data.data;
  }

  throw new Error(data.message || "Failed to load badge progress");
};

/*
  Fetch user's badge statistics
 */
export const fetchBadgeStats = async () => {
  const res = await fetch(`${BASE_URL}/api/badges/stats`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();

  if (data.success) {
    return data.data;
  }

  throw new Error(data.message || "Failed to load badge stats");
};

/*
  Trigger manual badge check (refresh)
 */
export const triggerBadgeCheck = async () => {
  const res = await fetch(`${BASE_URL}/api/badges/check-all`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();

  if (data.success) {
    return data.data;
  }

  throw new Error(data.message || "Failed to check badges");
};

export default {
  fetchBadgeProgress,
  fetchBadgeStats,
  triggerBadgeCheck
};
