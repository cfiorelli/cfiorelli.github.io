const escapeXml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toUTCString = (value) => {
  if (!value) return new Date().toUTCString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
};

module.exports = class PublicationsRssFeed {
  data() {
    return {
      permalink: "feed/publications.xml",
      eleventyExcludeFromCollections: true
    };
  }

  render({ publications = [], site = {} }) {
  const ordered = [...publications].sort((a, b) => (b.year || 0) - (a.year || 0));
  const limited = ordered.slice(0, 5);
    const baseUrl = (site.url || "").replace(/\/$/, "");
    const channelLink = baseUrl ? `${baseUrl}/publications/` : "/publications/";
  const first = limited[0];
    const firstDate = first ? `${first.year || new Date().getFullYear()}-01-01` : null;
    const lastBuild = toUTCString(firstDate);

  const items = limited
      .map((item, index) => {
        const title = escapeXml(item.title || "Untitled publication");
        const linkTarget = item.url ? (/^https?:/i.test(item.url) ? item.url : `${baseUrl}${item.url}`) : channelLink;
        const pubDate = toUTCString(`${item.year || new Date().getFullYear()}-01-01`);
        const authors = item.authors && item.authors.length ? `Authors: ${item.authors.join(", ")}` : "";
        const venue = item.venue ? `Venue: ${item.venue}` : "";
        const descriptionParts = [authors, venue].filter(Boolean).join(" | ");
        const guid = item.url ? escapeXml(linkTarget) : `${channelLink}#pub-${index}`;

        return `    <item>
      <title>${title}</title>
      <link>${escapeXml(linkTarget)}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      ${descriptionParts ? `<description>${escapeXml(descriptionParts)}</description>` : ""}
    </item>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${site.title || "Site"} — Publications`)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(site.description || "Recent publications and reports")}</description>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <language>en</language>
${items}
  </channel>
</rss>`;
  }
};
