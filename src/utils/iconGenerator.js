// src/utils/iconGenerator.js

/**
 * Get initials from a name
 * @param {string} name - The full name
 * @returns {string} Initials (e.g., "John Doe" → "JD")
 */
export const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ").filter(part => part.length > 0);
  const first = parts[0]?.charAt(0) || "";
  const last = parts[parts.length - 1]?.charAt(0) || "";
  return (first + last).toUpperCase();
};

/**
 * Generate consistent color from a string (looks random, but stable)
 * @param {string} str - The input string
 * @returns {string} HSL color string
 */
export const stringToColor = (str) => {
  if (!str) return "hsl(0, 0%, 50%)";
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  const saturation = 60 + (hash % 20);
  const lightness = 50 + (hash % 10);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Combined function to generate avatar props
 * @param {string} name - The name for avatar generation
 * @returns {Object} { initials, color }
 */
export const generateAvatar = (name) => {
  return {
    initials: getInitials(name),
    color: stringToColor(name)
  };
};
