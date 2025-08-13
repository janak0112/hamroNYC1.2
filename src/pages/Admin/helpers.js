// src/components/admin/helpers.js

/**
 * Extracts a flat list of field label/value pairs from a post object
 * so we can show them in the details sidebar.
 */
export function buildFieldList(item) {
  if (!item || typeof item !== "object") return [];

  const skipKeys = [
    "$id",
    "$createdAt",
    "$updatedAt",
    "title",
    "description",
    "type",
    "images",
    "approvedByAdmin",
  ];

  return Object.keys(item)
    .filter((k) => !skipKeys.includes(k))
    .map((key) => ({
      label: humanizeLabel(key),
      value: item[key],
    }));
}

function humanizeLabel(str) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Returns an array of image URLs from the post.
 */
export function extractImages(item) {
  if (!item) return [];
  if (Array.isArray(item.images)) return item.images.filter(Boolean);

  // Sometimes images are in a comma-separated string
  if (typeof item.images === "string") {
    return item.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }

  return [];
}
