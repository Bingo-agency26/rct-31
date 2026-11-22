(() => {
 let sending=false, lastSuccess=0;
 window.RCT31Email={async send(params){
  if(sending)throw new Error('Un envoi est déjà en cours.');
  if(Date.now()-lastSuccess<15000)throw new Error('Votre demande vient d’être envoyée. Patientez quelques secondes avant un nouvel envoi.');
  const config=window.RCT31_EMAIL_CONFIG;
  if(!config?.publicKey)throw new Error('L’envoi est momentanément indisponible. Contactez le chauffeur par téléphone.');
  sending=true;
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch('https://api.emailjs.com/api/v1.0/email/send',{
    method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
    body:JSON.stringify({service_id:config.serviceId,template_id:config.templateId,user_id:config.publicKey,template_params:params})
   });
   if(!response.ok){
    if(response.status===429)throw new Error('Trop de demandes rapprochées. Patientez puis réessayez, ou appelez le chauffeur.');
    throw new Error('L’envoi n’a pas pu aboutir. Vos informations sont conservées : réessayez ou contactez le chauffeur au 06 88 79 36 83.');
   }
   lastSuccess=Date.now();
  }catch(error){
   if(error.name==='AbortError')throw new Error('Le délai de réponse est dépassé. La réception n’a pas pu être confirmée. Contactez le chauffeur avant de renvoyer votre demande.');
   if(error instanceof TypeError)throw new Error('Connexion interrompue. La réception n’a pas pu être confirmée. Vérifiez votre connexion ou appelez le chauffeur.');
   throw error;
  }finally{clearTimeout(timer);sending=false;}
 }};
})();
