const interests = require("./interests.json");
const links = require("./links.json");

function parseDate(value) {
  if (!value) return null;
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? null : ts;
}

function normalize(item, source) {
  const rawDate = item.addedAt || item.added || item.date || null;
  const timestamp = parseDate(rawDate);
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return {
    title: item.title || "Untitled",
    url: item.url || null,
    tags,
    addedAt: rawDate,
    source,
    sourceLabel: source === "link" ? "Link" : "Interest",
    note: item.note || null,
    category: item.category || item.venue || null,
    __ts: timestamp
  };
}

module.exports = () => {
  const merged = new Map();

  const addItem = (item, source) => {
    const normalized = normalize(item, source);
    const key = (normalized.url || normalized.title).toLowerCase();
    const existing = merged.get(key);

    if (!existing || ((normalized.__ts || 0) > (existing.__ts || 0))) {
      const combinedTags = new Set([...(existing?.tags || []), ...normalized.tags]);
      normalized.tags = Array.from(combinedTags);
      merged.set(key, normalized);
    } else if (existing) {
      const combinedTags = new Set([...(existing.tags || []), ...normalized.tags]);
      existing.tags = Array.from(combinedTags);
      if (!existing.addedAt && normalized.addedAt) {
        existing.addedAt = normalized.addedAt;
        existing.__ts = normalized.__ts;
      }
      if (!existing.category && normalized.category) {
        existing.category = normalized.category;
      }
    }
  };

  interests.forEach((item) => addItem(item, "interest"));
  links.forEach((item) => addItem(item, "link"));

  return Array.from(merged.values())
    .sort((a, b) => (b.__ts || 0) - (a.__ts || 0));
};
