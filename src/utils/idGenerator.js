// src/utils/idGenerator.js

/**
 * Generates a standardized ID from a given name
 * Removes special characters, replaces spaces with dashes
 * @param {string} name - The name to convert into an ID
 * @returns {string} - Clean, URL-friendly string
 */
export const idFromName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")   // remove special chars like "." or ","
    .trim()
    .replace(/\s+/g, "-");     // replace spaces with dashes
};


/**
 * Creates a URL-friendly slug from a string
 * Replaces hyphens with spaces first, then normalizes
 * @param {string} str - The string to convert into a slug
 * @returns {string} - Lowercase, hyphenated slug
 */
export const createSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9ñáéíóúüç&\s]/g, '')  // Keep letters, numbers, and common special chars
    .replace(/-/g, ' ')                     // ✅ Convert existing hyphens to spaces first
    .trim()
    .replace(/\s+/g, '-');                  // Replace spaces with single hyphens
};