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

module.exports = class InterestsRssFeed {
  data() {
    return {
      permalink: "feed/interests.xml",
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
  const channelLink = baseUrl ? `${baseUrl}/interests/` : "/interests/";
  const first = limited[0];
  const lastBuild = first ? toUTCString(first.addedAt || first.added) : new Date().toUTCString();

  const items = limited
      .map((item) => {
        const title = escapeXml(item.title || "Untitled interest");
        const linkTarget = item.url ? (/^https?:/i.test(item.url) ? item.url : `${baseUrl}${item.url}`) : channelLink;
        const description = item.tags && item.tags.length ? `Tags: ${item.tags.join(", ")}` : "";
        const pubDate = toUTCString(item.addedAt || item.added);
        const guid = item.url ? escapeXml(linkTarget) : `${channelLink}#${encodeURIComponent(item.title || "interest")}`;

        return `    <item>
      <title>${title}</title>
      <link>${escapeXml(linkTarget)}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${escapeXml(description)}</description>` : ""}
    </item>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${site.title || "Site"} — Interests`)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(site.description || "Latest interests and links")}</description>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <language>en</language>
${items}
  </channel>
</rss>`;
  }
};
