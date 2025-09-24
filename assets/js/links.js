// Simple client-side filtering for /links
(function(){
  const root = document.getElementById('linksRoot');
  const q = document.getElementById('q');
  const tagFilter = document.getElementById('tagFilter');
  const clear = document.getElementById('clear');
  let items = [];

  function render(list){
    root.innerHTML='';
    if(!list.length){ root.innerHTML = '<p class="muted">No links found.</p>'; return }
    list.forEach(l=>{
      const el = document.createElement('div'); el.className='link-item';
      const a = document.createElement('a'); a.href=l.url; a.textContent=l.title; a.target='_blank'; a.rel='noopener noreferrer';
      const meta = document.createElement('div'); meta.className='muted'; meta.textContent = `${new Date(l.addedAt).toLocaleDateString()} • ${l.tags.join(', ')}`;
      el.appendChild(a); el.appendChild(meta); root.appendChild(el);
    });
  }

  function buildTagOptions(data){
    const tags = new Set(); data.forEach(d=>d.tags.forEach(t=>tags.add(t)));
    Array.from(tags).sort().forEach(t=>{
      const opt = document.createElement('option'); opt.value=t; opt.textContent=t; tagFilter.appendChild(opt);
    });
  }

  function applyFilters(){
    const qv = q.value.trim().toLowerCase();
    const tag = tagFilter.value;
    const filtered = items.filter(it=>{
      const titleMatch = it.title.toLowerCase().includes(qv);
      const tagMatch = !tag || it.tags.includes(tag);
      const tagsText = it.tags.join(' ');
      const tagOrTitle = qv ? (titleMatch || tagsText.includes(qv)) : true;
      return tagMatch && tagOrTitle;
    });
    render(filtered);
  }

  clear?.addEventListener('click',()=>{ q.value=''; tagFilter.value=''; applyFilters(); q.focus(); });
  q?.addEventListener('input',()=>applyFilters());
  tagFilter?.addEventListener('change',()=>applyFilters());

  fetch('/data/links.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{
    items = data;
    buildTagOptions(items);
    render(items);
  }).catch(err=>{ root.innerHTML='<p class="muted">Failed to load links.</p>'; console.error(err)});
})();
