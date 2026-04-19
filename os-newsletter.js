/* ═══ OSTUFF NEWSLETTER — Popup → Supabase + Resend ═══ */
/* Rules:
   - NOT logged in + never subscribed → show popup with 10% code
   - Logged in + never subscribed → show popup WITHOUT 10% code
   - Already subscribed (localStorage) → hide popup entirely
   - Supabase client via window.osAuth (centralized in os-auth.js)
*/
(function(){

function isSubscribed(){
  return localStorage.getItem('os-subscribed')==='true';
}

function isLoggedIn(){
  return window.osAuth&&typeof window.osAuth.getUser==='function';
}

function hidePopup(){
  setTimeout(function(){
    document.querySelectorAll('[class*="pop"],[class*="Pop"],[class*="newsletter"]').forEach(function(el){
      if(el.querySelector('form'))el.style.display='none';
    });
  },500);
  setTimeout(function(){
    document.querySelectorAll('[class*="pop"] [class*="close"],[class*="Pop"] [class*="close"],[class*="pop"] [class*="Close"]').forEach(function(btn){btn.click()});
  },1000);
}

function initNewsletter(){
  /* Already subscribed → hide completely */
  if(isSubscribed()){hidePopup();return}

  /* Check if logged in to decide promo code */
  var showPromo=true;
  if(isLoggedIn()){
    window.osAuth.getUser().then(function(user){
      if(user){
        showPromo=false;
        /* Check if this user already used promo (has orders or is returning) */
        /* For logged in users, hide the promo code mention in the popup */
        var promoElements=document.querySelectorAll('[class*="pop"] [class*="promo"],[class*="pop"] [class*="code"],[class*="Pop"] [class*="promo"],[class*="Pop"] [class*="code"]');
        promoElements.forEach(function(el){el.style.display='none'});
      }
    });
  }

  /* Intercept form submission */
  var forms=document.querySelectorAll('form');
  forms.forEach(function(form){
    var emailInput=form.querySelector('input[type="email"],input[name*="email"],input[placeholder*="email"]');
    var phoneInput=form.querySelector('input[type="tel"],input[name*="phone"],input[placeholder*="phone"]');
    if(!emailInput)return;
    var isPopup=form.closest('[class*="pop"]')||form.closest('[class*="newsletter"]')||form.closest('[class*="Pop"]');
    if(!isPopup)return;

    form.addEventListener('submit',function(e){
      var email=emailInput.value.trim();
      var phone=phoneInput?phoneInput.value.trim():'';
      if(!email)return;

      /* Mark as subscribed */
      localStorage.setItem('os-subscribed','true');

      /* Save to Supabase via centralized client */
      if(window.osAuth){
        window.osAuth.initSupabase().then(function(c){
          c.from('subscribers').insert({email:email,phone:phone,source:'popup',promo_code:showPromo?'WELCOME10':null}).then(function(){});
          /* Send welcome email via Edge Function */
          c.functions.invoke('send-email',{body:{type:'welcome',email:email,data:{show_promo:showPromo}}}).catch(function(){});
        });
      }
    });
  });
}

if(document.readyState==='complete')initNewsletter();
else window.addEventListener('load',function(){setTimeout(initNewsletter,1000)});
})();
