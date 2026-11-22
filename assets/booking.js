(() => {
 const form=document.querySelector('#trip');if(!form)return;
 const service=form.elements.motif,date=form.elements.date,time=form.elements.heure;
 const aliases={depart:'aeroport',personnel:'prive'};
 const query=new URLSearchParams(location.search).get('motif');
 const choice=aliases[query]||query;
 if([...service.options].some(o=>o.value===choice))service.value=choice;
 const updatePmr=()=>{document.querySelector('#pmr-note').hidden=service.value!=='pmr'};
 service.addEventListener('change',updatePmr);updatePmr();
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 date.min=today();let recap='';
 const result=document.querySelector('#trip-result');
 form.addEventListener('input',()=>{result.hidden=true;time.setCustomValidity('');date.min=today()});
 form.addEventListener('submit',async event=>{
  event.preventDefault();date.min=today();time.setCustomValidity('');
  const when=new Date(`${date.value}T${time.value}`);
  if(!Number.isFinite(when.getTime())||when<=new Date()){time.setCustomValidity('Choisissez une date et une heure futures.');form.reportValidity();return;}
  if(!form.reportValidity())return;
  const d=new FormData(form);if(d.get('website'))return;
  const submit=form.querySelector('button[type=submit]'),status=document.querySelector('#trip-status');
  if(submit.disabled)return;status.textContent='Envoi en cours…';submit.disabled=true;submit.textContent='Envoi en cours…';form.setAttribute('aria-busy','true');
  // Stable fields shared by the booking and callback templates.
  const request={service:service.selectedOptions[0].textContent,departure:d.get('depart').trim(),destination:d.get('arrivee').trim(),date:d.get('date'),time:d.get('heure'),passengers:d.get('passagers'),luggage:d.get('bagages'),customer_name:d.get('nom').trim(),customer_phone:d.get('telephone').trim(),customer_email:d.get('email').trim(),notes:d.get('details').trim()};
  recap=`Bonjour, je souhaite organiser un trajet avec RCT31.\n\nService : ${request.service}\nDépart : ${request.departure}\nArrivée : ${request.destination}\nDate : ${request.date.split('-').reverse().join('/')} à ${request.time}\nPassagers : ${request.passengers}\nBagages : ${request.luggage}\nNom : ${request.customer_name}\nTéléphone : ${request.customer_phone}`;
  if(request.customer_email)recap+=`\nE-mail : ${request.customer_email}`;
  if(request.notes)recap+=`\nPrécisions : ${request.notes}`;
  recap+='\n\nMerci de me confirmer votre disponibilité, les modalités de prise en charge et le tarif. Cette demande ne constitue pas une réservation confirmée.';
  try {
  await window.RCT31Email.send({...request,request_type:'Demande de trajet',name:request.customer_name,from_name:request.customer_name,email:request.customer_email,reply_to:request.customer_email,phone:request.customer_phone,title:'Demande de trajet RCT31',message:recap});
  status.textContent='Votre demande a bien été envoyée. René vous recontactera pour confirmer le tarif et la disponibilité.';
  document.querySelector('#result').textContent=recap;
  document.querySelector('#send-whatsapp').href='https://wa.me/33688793683?text='+encodeURIComponent(recap);
  result.hidden=false;document.querySelector('#result-title').focus({preventScroll:true});result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }catch(error){status.textContent=error.message;status.focus({preventScroll:true});}
  finally{submit.disabled=false;submit.textContent='Envoyer ma demande';form.removeAttribute('aria-busy');}
 });
 document.querySelector('#download').addEventListener('click',()=>{if(!recap)return;const url=URL.createObjectURL(new Blob([recap],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='demande-trajet-rct31.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
})();
