const toISOString = (value) => {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
};

module.exports = class PublicationsJsonFeed {
  data() {
    return {
      permalink: "feed/publications.json",
      eleventyExcludeFromCollections: true
    };
  }

  render({ publications = [], site = {} }) {
  const ordered = [...publications].sort((a, b) => (b.year || 0) - (a.year || 0));
  const limited = ordered.slice(0, 5);

    const baseUrl = (site.url || "").replace(/\/$/, "");
    const feedUrl = baseUrl ? `${baseUrl}/feed/publications.json` : "/feed/publications.json";
    const homeUrl = baseUrl || "/";

  const items = limited.map((item, index) => {
      const absolute = item.url && /^https?:/i.test(item.url) ? item.url : (item.url ? `${baseUrl}${item.url}` : null);
      const id = absolute || `${feedUrl}#${index}`;
      const isoDate = toISOString(`${item.year || new Date().getFullYear()}-01-01`);
      return {
        id,
        url: absolute,
        title: item.title || "Untitled publication",
        content_text: [
          item.authors && item.authors.length ? `Authors: ${item.authors.join(', ')}` : null,
          item.venue ? `Venue: ${item.venue}` : null
        ].filter(Boolean).join(' | '),
        date_published: isoDate
      };
    });

    return JSON.stringify({
      version: "https://jsonfeed.org/version/1",
      title: `${site.title || "Site"} — Publications`,
      home_page_url: homeUrl,
      feed_url: feedUrl,
      description: site.description || "Recent publications and reports",
      items
    }, null, 2);
  }
};
