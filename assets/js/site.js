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
        .sort((a,b)=> new Date(b.addedAt) - new Date(a.addedAt))
        .slice(0,8);

      list.innerHTML = '';
      merged.forEach(l => {
        const el = document.createElement('div');
        el.className = 'link-item';
        const a = document.createElement('a');
        a.href = l.url; a.textContent = l.title; a.target = '_blank'; a.rel = 'noopener noreferrer';
        const meta = document.createElement('span');
        meta.className = 'muted'; meta.textContent = (new Date(l.addedAt)).toLocaleDateString();
        // small source badge
        const badge = document.createElement('span'); badge.className='muted'; badge.style.marginLeft='0.5rem'; badge.textContent = l.source ? l.source : '';
        el.appendChild(a); el.appendChild(meta); el.appendChild(badge);
        list.appendChild(el);
      });
    }catch(err){
      list.innerHTML = '<p class="muted">Unable to load links.</p>';
      console.error(err);
    }
  }

  loadLinksPreview();
})();
