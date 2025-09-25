const toISOString = (value) => {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
};

module.exports = class InterestsJsonFeed {
  data() {
    return {
      permalink: "feed/interests.json",
      eleventyExcludeFromCollections: true
    };
  }

  render({ interests = [], site = {} }) {
    const ordered = [...interests].sort((a, b) => {
      const aDate = new Date(a.addedAt || a.added || 0).getTime();
      const bDate = new Date(b.addedAt || b.added || 0).getTime();
      return bDate - aDate;
    });
    const limited = ordered.slice(0, 5);

    const baseUrl = (site.url || "").replace(/\/$/, "");
    const feedUrl = baseUrl ? `${baseUrl}/feed/interests.json` : "/feed/interests.json";
    const homeUrl = baseUrl || "/";

  const items = limited.map((item, index) => {
      const absolute = item.url && /^https?:/i.test(item.url) ? item.url : (item.url ? `${baseUrl}${item.url}` : null);
      const id = absolute || `${feedUrl}#${index}`;
      return {
        id,
        url: absolute,
        title: item.title || "Untitled interest",
        date_published: toISOString(item.addedAt || item.added),
        tags: item.tags || []
      };
    });

    return JSON.stringify({
      version: "https://jsonfeed.org/version/1",
      title: `${site.title || "Site"} — Interests`,
      home_page_url: homeUrl,
      feed_url: feedUrl,
      description: site.description || "Latest interests and links",
      items
    }, null, 2);
  }
};
