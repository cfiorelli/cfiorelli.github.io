document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-bib]');
  if(!btn) return;
  const bib = btn.getAttribute('data-bib');
  navigator.clipboard?.writeText(bib).then(()=>{
    const original = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(()=>btn.textContent = original,1500);
  }).catch(()=>alert('Copy failed'));
});
