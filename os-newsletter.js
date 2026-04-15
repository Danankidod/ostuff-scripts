/* ═══ OSTUFF NEWSLETTER — Popup → Supabase + Resend ═══ */
(function(){
var SUPA_URL='https://zxhamviljbwzbepvlwaj.supabase.co';
var SUPA_KEY='sb_publishable_9rR3-q7Fon7IMNLEh5u48g_yV9jhSyX';
var RESEND_ENDPOINT=SUPA_URL+'/functions/v1/send-welcome';

function initNewsletter(){
  /* Find the Webflow popup newsletter form */
  var forms=document.querySelectorAll('form');
  forms.forEach(function(form){
    var emailInput=form.querySelector('input[type="email"],input[name*="email"],input[placeholder*="email"]');
    var phoneInput=form.querySelector('input[type="tel"],input[name*="phone"],input[placeholder*="phone"]');
    if(!emailInput)return;
    /* Check if this is inside the popup newsletter */
    var isPopup=form.closest('[class*="pop"]')||form.closest('[class*="newsletter"]')||form.closest('[class*="Pop"]');
    if(!isPopup)return;
    form.addEventListener('submit',function(e){
      var email=emailInput.value.trim();
      var phone=phoneInput?phoneInput.value.trim():'';
      if(!email)return;
      /* Save to Supabase */
      fetch(SUPA_URL+'/rest/v1/subscribers',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Prefer':'return=minimal'},
        body:JSON.stringify({email:email,phone:phone,source:'popup'})
      }).then(function(){console.log('OS: subscriber saved')}).catch(function(){});
      /* Trigger welcome email via Edge Function */
      fetch(RESEND_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+SUPA_KEY},
        body:JSON.stringify({email:email})
      }).then(function(){console.log('OS: welcome email sent')}).catch(function(){});
    });
  });
}

if(document.readyState==='complete')initNewsletter();
else window.addEventListener('load',function(){setTimeout(initNewsletter,1000)});
})();
