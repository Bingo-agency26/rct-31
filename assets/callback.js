(() => {
 const form=document.querySelector('#callback-form');if(!form)return;
 const result=document.querySelector('#callback-result');
 form.addEventListener('input',()=>{result.hidden=true;document.querySelector('#callback-send').removeAttribute('href')});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form);if(data.get('website'))return;const submit=form.querySelector('button[type=submit]'),status=document.querySelector('#callback-status');if(submit.disabled)return;submit.disabled=true;submit.textContent='Envoi en cours…';status.textContent='Envoi en cours…';form.setAttribute('aria-busy','true');
  const request={customer_name:data.get('customer_name').trim(),customer_phone:data.get('customer_phone').trim(),preferred_time:data.get('preferred_time'),service:data.get('service')};
  const message=`Bonjour René, je souhaite être rappelé par RCT31.\nPrénom : ${request.customer_name}\nTéléphone : ${request.customer_phone}\nMoment souhaité : ${request.preferred_time}\nBesoin : ${request.service}\nMerci de me confirmer un créneau selon votre disponibilité.`;
  try{
  await window.RCT31Email.send({...request,request_type:'Demande de rappel',name:request.customer_name,from_name:request.customer_name,phone:request.customer_phone,email:'',reply_to:'',customer_email:'',departure:'',destination:'',date:'',time:request.preferred_time,passengers:'',luggage:'',notes:request.service,title:'Demande de rappel RCT31',message});
  status.textContent='Votre demande de rappel a bien été envoyée.';
  document.querySelector('#callback-send').href='https://wa.me/33688793683?text='+encodeURIComponent(message);
  result.hidden=false;document.querySelector('#callback-result-title').focus({preventScroll:true});
  }catch(error){status.textContent=error.message;status.focus({preventScroll:true});}
  finally{submit.disabled=false;submit.textContent='Demander mon rappel';form.removeAttribute('aria-busy');}
 });
})();
