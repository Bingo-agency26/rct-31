(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
 const closeMenu=()=>{toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Ouvrir le menu');nav?.classList.remove('is-open')};
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');nav.classList.toggle('is-open',open)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
 document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu()});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 const desktop=matchMedia('(min-width:701px)');desktop.addEventListener('change',closeMenu);
 // Animations never hide content before JavaScript loads; reduced motion is respected.
 const animate=(el,frames,options)=>{if(!reduced.matches&&el.animate)return el.animate(frames,options)};
 document.querySelectorAll('.intro-copy>.eyebrow,.intro-copy>h1,.intro-copy>p,.intro-copy>.contact-actions,.hero-visual').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:i*70,easing:'cubic-bezier(.2,.7,.2,1)'}));
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;observer.unobserve(el);if(el.classList.contains('route-trace'))animate(el,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1500,easing:'ease-out'});else animate(el,[{opacity:.2,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'})}),{threshold:.08});document.querySelectorAll('.section-head,.journey,.story-copy,.story-art,.coverage-drawing,.journal-card,.pmr-section h2,.route-trace').forEach(el=>observer.observe(el))}
 let queued=false;const update=()=>{queued=false;document.body.classList.toggle('is-scrolled',scrollY>10);const max=document.documentElement.scrollHeight-innerHeight;const progress=max>0?Math.max(0,Math.min(1,scrollY/max)):0;const bar=document.querySelector('.reading-progress');if(bar)bar.style.transform=`scaleX(${progress})`};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
 const tabs=document.querySelector('.vehicle-tabs'),gallery=document.querySelector('.vehicle-photos');
 if(tabs&&gallery){const figures=[...gallery.querySelectorAll('figure')],buttons=[...tabs.querySelectorAll('button')];gallery.classList.add('is-gallery');tabs.hidden=false;figures.forEach((figure,i)=>figure.hidden=i!==0);buttons.forEach((button,index)=>{button.setAttribute('aria-controls','vehicle-view-'+index);figures[index].id='vehicle-view-'+index;button.addEventListener('click',()=>{buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));figures.forEach((f,i)=>f.hidden=i!==index);animate(figures[index],[{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'})})})}
 reduced.addEventListener('change',()=>{if(reduced.matches&&document.getAnimations)document.getAnimations().forEach(animation=>animation.finish())});
})();
