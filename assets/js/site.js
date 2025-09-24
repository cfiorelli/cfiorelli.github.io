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

  // load small preview of links for the homepage
  async function loadLinksPreview(){
    const list = document.getElementById('linksList');
    if(!list) return;
    try{
      const res = await fetch('/data/links.json', {cache: 'no-store'});
      if(!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const items = data.slice(0,6).map(l=>{
        const el = document.createElement('div');
        el.className = 'link-item';
        const a = document.createElement('a');
        a.href = l.url; a.textContent = l.title; a.target = '_blank'; a.rel='noopener noreferrer';
        const meta = document.createElement('span');
        meta.className='muted'; meta.textContent = (new Date(l.addedAt)).toLocaleDateString();
        el.appendChild(a); el.appendChild(meta);
        return el;
      });
      list.innerHTML=''; items.forEach(i=>list.appendChild(i));
    }catch(err){
      list.innerHTML = '<p class="muted">Unable to load links.</p>';
      console.error(err);
    }
  }

  loadLinksPreview();
})();
