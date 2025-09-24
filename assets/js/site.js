// Theme toggle and simple client utilities
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const applyTheme = (t)=>{
    document.body.classList.remove('theme-light','theme-dark','theme-system');
    document.body.classList.add(t);
    btn.setAttribute('aria-pressed', String(t==='theme-dark'));
    try{ localStorage.setItem('site-theme', t);}catch(e){}
  };

  const stored = (()=>{try{return localStorage.getItem('site-theme')}catch(e){return null}})();
  if(stored) applyTheme(stored); else applyTheme('theme-system');

  btn?.addEventListener('click',()=>{
    const now = document.body.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
    applyTheme(now);
  });

  // load small preview of combined interests + publications for the homepage
  async function loadLinksPreview(){
    const list = document.getElementById('linksList');
    if(!list) return;
    try{
      // fetch both feeds in parallel
      const [intR, pubR] = await Promise.all([
        fetch('/data/interests.json', {cache: 'no-store'}).catch(()=>null),
        fetch('/data/publications.json', {cache: 'no-store'}).catch(()=>null)
      ]);

      const intData = intR && intR.ok ? await intR.json() : [];
      const pubData = pubR && pubR.ok ? await pubR.json() : [];

      const merged = (intData.concat(pubData))
        .filter(Boolean)
        // Normalize date field: prefer addedAt, fall back to date, support null
        .map(item => {
          const raw = item.addedAt ?? item.date ?? null;
          return Object.assign({}, item, { __ts: raw ? Date.parse(raw) : null });
        })
        .sort((a,b)=> (b.__ts || 0) - (a.__ts || 0))
        .slice(0,8);

      list.innerHTML = '';
      merged.forEach(l => {
        const el = document.createElement('div');
        el.className = 'link-item';

        const left = document.createElement('div');
        left.style.flex = '1';
        const a = document.createElement('a');
        a.href = l.url; a.textContent = l.title; a.target = '_blank'; a.rel = 'noopener noreferrer';
        left.appendChild(a);

        const metaWrap = document.createElement('div');
        metaWrap.className = 'link-meta';
        // date display: use normalized timestamp, gracefully handle null
        const dateSpan = document.createElement('span');
        dateSpan.className = 'muted link-date';
        dateSpan.textContent = l.__ts ? new Date(l.__ts).toLocaleDateString() : '';
        // category or source
        const catSpan = document.createElement('span');
        catSpan.className = 'muted link-cat';
        catSpan.textContent = l.category ? l.category : (l.source ? l.source : '');

        metaWrap.appendChild(dateSpan);
        // spacer
        const sep = document.createElement('span'); sep.style.display='inline-block'; sep.style.width='0.5rem';
        metaWrap.appendChild(sep);
        metaWrap.appendChild(catSpan);

        el.appendChild(left);
        el.appendChild(metaWrap);
        list.appendChild(el);
      });
    }catch(err){
      list.innerHTML = '<p class="muted">Unable to load links.</p>';
      console.error(err);
    }
  }

  loadLinksPreview();
})();
