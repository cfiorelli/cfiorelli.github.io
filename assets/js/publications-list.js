// Render publications from /data/publications.json
async function renderPublications(){
  const container = document.getElementById('publicationsList');
  if(!container) return;
  try{
    const res = await fetch('/data/publications.json', {cache:'no-store'});
    if(!res.ok) throw new Error('Failed to load publications');
    const items = await res.json();
    container.innerHTML = '';
    items.sort((a,b)=> new Date(b.addedAt) - new Date(a.addedAt));
    items.forEach(it=>{
      const art = document.createElement('article'); art.className='card link-item';
      const left = document.createElement('div');
      const a = document.createElement('a'); a.href = it.url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent = it.title;
      const meta = document.createElement('div'); meta.className='muted'; meta.textContent = it.addedAt? new Date(it.addedAt).getFullYear() : '';
      left.appendChild(a); left.appendChild(meta);
      const right = document.createElement('div');
      const btn = document.createElement('button'); btn.className='btn small';
      const bib = it.bibtex || '';
      btn.setAttribute('data-bib', bib);
      btn.textContent = 'Copy BibTeX';
      right.appendChild(btn);
      art.appendChild(left); art.appendChild(right);
      container.appendChild(art);
    });
  }catch(err){
    console.error(err); container.innerHTML = '<p class="muted">Unable to load publications.</p>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ renderPublications(); });
