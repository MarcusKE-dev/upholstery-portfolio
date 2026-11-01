// Project detail pages use the exported layout with live server-rendered content.
const button=document.querySelector('[aria-controls="mobile-navigation"]');
const nav=document.getElementById('mobile-navigation');
button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.hidden=!open;nav.classList.toggle('max-h-80',open);nav.classList.toggle('max-h-0',!open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button&&nav){button.setAttribute('aria-expanded','false');nav.hidden=true;nav.classList.remove('max-h-80');nav.classList.add('max-h-0')}});

button?.removeAttribute('disabled');button?.setAttribute('aria-busy','false');
