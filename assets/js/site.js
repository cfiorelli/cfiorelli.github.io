// Theme toggle and simple client utilities
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let followSystem = true;

  const setButtonState = (theme)=>{
    if(!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  const applyTheme = (theme, persist = true)=>{
    const normalized = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = normalized;
    root.style.colorScheme = normalized;
    setButtonState(normalized);
    if(persist){
      try{ localStorage.setItem('site-theme', normalized);}catch(e){}
    }
  };

  const applySystemTheme = ()=>{
    const theme = prefersDark.matches ? 'dark' : 'light';
    applyTheme(theme, false);
  };

  let stored = null;
  try{
    stored = localStorage.getItem('site-theme');
  }catch(e){ stored = null; }

  if(stored === 'light' || stored === 'dark'){
    followSystem = false;
    applyTheme(stored, false);
  }else{
    followSystem = true;
    applySystemTheme();
  }

  prefersDark.addEventListener('change', ()=>{
    if(followSystem){
      applySystemTheme();
    }
  });

  btn?.addEventListener('click',()=>{
    const current = root.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    followSystem = false;
    applyTheme(next, true);
  });

})();
