// ---------- MUSIC PLAYER ----------
(function(){
  const player = document.getElementById('player');
  if(!player) return;
  const audio = document.getElementById('theme-audio');
  const btn = document.getElementById('player-toggle');
  const icon = document.getElementById('player-icon');

  function setPlaying(isPlaying){
    player.classList.toggle('playing', isPlaying);
    icon.textContent = isPlaying ? '❚❚' : '▶';
  }

  btn.addEventListener('click', () => {
    if(audio.paused){
      audio.play().then(()=>setPlaying(true)).catch(()=>{});
    } else {
      audio.pause();
      setPlaying(false);
    }
  });
  audio.addEventListener('ended', ()=> setPlaying(false));

  // Also wire any "big play" buttons on the page (e.g. Sound section)
  document.querySelectorAll('[data-play-theme]').forEach(el=>{
    el.addEventListener('click', ()=>{
      if(audio.paused){
        audio.play().then(()=>setPlaying(true)).catch(()=>{});
      } else {
        audio.pause();
        setPlaying(false);
      }
    });
  });
})();

// ---------- PRICE REVEAL ----------
document.querySelectorAll('.reveal-btn').forEach(btn=>{
  btn.addEventListener('click', () => {
    const card = btn.closest('.tier-card') || btn.parentElement;
    const priceEl = card.querySelector('.price-value');
    if(priceEl){
      priceEl.classList.add('shown');
      btn.classList.add('used');
    }
  });
});

// ---------- MOBILE NAV ----------
document.querySelectorAll('.menu-toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const nav = btn.closest('nav');
    const list = nav.querySelector('ul');
    const open = list.style.display === 'flex';
    list.style.display = open ? 'none' : 'flex';
    list.style.flexDirection = 'column';
    list.style.position = 'fixed';
    list.style.top = '64px';
    list.style.right = '20px';
    list.style.background = '#000';
    list.style.padding = '18px';
    list.style.gap = '14px';
  });
});

// ---------- FORM FALLBACK (mailto until API is wired up) ----------
// TODO: once the shared Cloudflare Worker/D1 API is deployed, set API_BASE
// and swap this for a fetch() POST to the relevant endpoint.
const API_BASE = "";

function handleForm(formId, statusId, endpoint, successMsg, subjectLine){
  const form = document.getElementById(formId);
  if(!form) return;
  const status = document.getElementById(statusId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    const data = Object.fromEntries(new FormData(form).entries());
    if(!API_BASE){
      status.textContent = 'Opening email fallback…';
      const subject = encodeURIComponent(subjectLine);
      const body = encodeURIComponent(JSON.stringify(data, null, 2));
      window.location.href = `mailto:junzatv@gnail.com?subject=${subject}&body=${body}`;
      return;
    }
    try{
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Request failed');
      status.textContent = successMsg;
      form.reset();
    }catch(err){
      status.textContent = 'Something went wrong — please email junzatv@gnail.com directly.';
    }
  });
}

handleForm('partner-form','partner-status','/api/partner-inquiry','Thanks — we\'ll be in touch soon.','Partnership Inquiry');
