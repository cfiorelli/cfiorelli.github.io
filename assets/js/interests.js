// Render the Interests page from /data/interests.json
async function renderInterests(){
  const tbody = document.querySelector('#interestsTableBody');
  if(!tbody) return;
  try{
    const res = await fetch('/data/interests.json', {cache:'no-store'});
    if(!res.ok) throw new Error('Failed to load interests');
    const items = await res.json();
    // sort by date desc (nulls last)
    items.sort((a,b)=>{
      const da = a.date ? new Date(a.date) : 0;
      const db = b.date ? new Date(b.date) : 0;
      return db - da;
    });
    tbody.innerHTML = '';
    items.forEach(it=>{
      const tr = document.createElement('tr');
      // Title cell
      const tdTitle = document.createElement('td');
      if(it.type === 'link'){
        const a = document.createElement('a'); a.href = it.url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent = it.title;
        tdTitle.appendChild(a);
      } else if(it.type === 'note'){
        tdTitle.textContent = it.title || '';
      }
      // Date
      const tdDate = document.createElement('td'); tdDate.textContent = it.date ? it.date : 'n.d.';
      // Category
      const tdCat = document.createElement('td'); tdCat.textContent = it.category || '';
      // Tags
      const tdTags = document.createElement('td');
      (it.tags || []).forEach(t=>{const s = document.createElement('span'); s.className='badge'; s.textContent=t; tdTags.appendChild(s); tdTags.appendChild(document.createTextNode(' '));});

      tr.appendChild(tdTitle); tr.appendChild(tdDate); tr.appendChild(tdCat); tr.appendChild(tdTags);
      tbody.appendChild(tr);
    });
  }catch(err){
    console.error(err);
    const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan=4; td.className='muted'; td.textContent='Unable to load interests.'; tr.appendChild(td); tbody.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ renderInterests(); });
