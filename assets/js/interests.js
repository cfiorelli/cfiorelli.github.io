document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('[data-interests-table]');
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tr'));
  const searchInput = document.querySelector('[data-interests-search]');
  const tagSelect = document.querySelector('[data-interests-tag]');
  const emptyState = document.querySelector('[data-interests-empty]');

  const uniqueTags = new Set();
  rows.forEach((row) => {
    const tags = (row.dataset.tags || '').split(' ').filter(Boolean);
    tags.forEach((tag) => uniqueTags.add(tag));
  });

  if (tagSelect) {
    Array.from(uniqueTags)
      .sort((a, b) => a.localeCompare(b))
      .forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
      });
  }

  const applyFilters = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const tag = (tagSelect?.value || '').toLowerCase();

    let visibleCount = 0;

    rows.forEach((row) => {
      const haystack = row.dataset.search || '';
      const tags = row.dataset.tags || '';

      const matchesSearch = !query || haystack.includes(query);
      const matchesTag = !tag || tags.split(' ').includes(tag);

      const isVisible = matchesSearch && matchesTag;
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  searchInput?.addEventListener('input', applyFilters);
  tagSelect?.addEventListener('change', applyFilters);

  applyFilters();
});
