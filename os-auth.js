/* ═══ OSTUFF AUTH — Supabase ═══ */
(function(){
var SUPA_URL='https://zxhamviljbwzbepvlwaj.supabase.co';
var SUPA_KEY='sb_publishable_9rR3-q7Fon7IMNLEh5u48g_yV9jhSyX';
var sb=null;

function initSupabase(){
  if(sb)return Promise.resolve(sb);
  return new Promise(function(resolve){
    if(window.supabase){sb=window.supabase.createClient(SUPA_URL,SUPA_KEY);resolve(sb);return}
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload=function(){sb=window.supabase.createClient(SUPA_URL,SUPA_KEY);resolve(sb)};
    document.head.appendChild(s);
  });
}

function getUser(){
  return initSupabase().then(function(c){
    return c.auth.getUser().then(function(r){return r.data.user});
  });
}

function onAuthChange(cb){
  initSupabase().then(function(c){
    c.auth.onAuthStateChange(function(ev,session){cb(ev,session)});
  });
}

/* ═══ LOGIN PAGE ═══ */
function initLogin(){
  var form=document.getElementById('os-login-form');
  var err=document.getElementById('os-login-error');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var email=form.querySelector('[name="email"]').value.trim();
    var pass=form.querySelector('[name="password"]').value;
    if(err)err.textContent='';
    initSupabase().then(function(c){
      c.auth.signInWithPassword({email:email,password:pass}).then(function(r){
        if(r.error){if(err)err.textContent=r.error.message;return}
        window.location='/account';
      });
    });
  });
}

/* ═══ SIGNUP PAGE ═══ */
function initSignup(){
  var form=document.getElementById('os-signup-form');
  var err=document.getElementById('os-signup-error');
  var ok=document.getElementById('os-signup-success');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var email=form.querySelector('[name="email"]').value.trim();
    var pass=form.querySelector('[name="password"]').value;
    var pass2=form.querySelector('[name="password2"]');
    if(pass2&&pass2.value!==pass){if(err)err.textContent='Passwords do not match';return}
    if(err)err.textContent='';
    initSupabase().then(function(c){
      c.auth.signUp({email:email,password:pass}).then(function(r){
        if(r.error){if(err)err.textContent=r.error.message;return}
        if(ok)ok.style.display='block';
        form.style.display='none';
      });
    });
  });
}

/* ═══ ACCOUNT PAGE ═══ */
function initAccount(){
  var wrap=document.getElementById('os-account');
  if(!wrap)return;
  var emailEl=document.getElementById('os-account-email');
  var logoutBtn=document.getElementById('os-account-logout');
  var wishlistEl=document.getElementById('os-account-wishlist');

  getUser().then(function(user){
    if(!user){window.location='/log-in';return}
    if(emailEl)emailEl.textContent=user.email;
    if(logoutBtn)logoutBtn.addEventListener('click',function(){
      initSupabase().then(function(c){c.auth.signOut().then(function(){window.location='/'})});
    });
    if(wishlistEl)loadAccountWishlist(user.id,wishlistEl);
  });
}

function loadAccountWishlist(userId,el){
  initSupabase().then(function(c){
    c.from('wishlists').select('*').eq('user_id',userId).order('created_at',{ascending:false}).then(function(r){
      if(!r.data||r.data.length===0){el.innerHTML='<p style="color:#999;font:400 11px/1.6 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase">Your wishlist is empty</p>';return}
      var h='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">';
      r.data.forEach(function(item){
        h+='<a href="/product/'+item.product_slug+'" style="text-decoration:none;color:#fff">';
        h+='<div style="aspect-ratio:1/1;overflow:hidden;background:#1a1a1a;margin-bottom:8px">';
        if(item.product_image)h+='<img src="'+item.product_image+'" style="width:100%;height:100%;object-fit:cover" loading="lazy">';
        h+='</div>';
        h+='<p style="font:500 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase;margin:0 0 4px;color:#fff">'+item.product_name+'</p>';
        h+='<p style="font:400 10px/1 \'Space Grotesk\',sans-serif;color:#555;margin:0">'+item.product_price+'</p>';
        h+='<button onclick="event.preventDefault();event.stopPropagation();osRemoveWish(\''+item.product_slug+'\',this.closest(\'a\'))" style="margin-top:8px;background:none;border:1px solid #333;padding:4px 10px;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;color:#555;transition:all .2s">REMOVE</button>';
        h+='</a>';
      });
      h+='</div>';
      el.innerHTML=h;
    });
  });
}

window.osRemoveWish=function(slug,el){
  getUser().then(function(user){
    if(!user)return;
    initSupabase().then(function(c){
      c.from('wishlists').delete().eq('user_id',user.id).eq('product_slug',slug).then(function(){
        if(el)el.remove();
      });
    });
  });
};

/* ═══ NAV ICONS ═══ */
function injectNavIcons(){
  if(document.querySelector('.os-nav-icons'))return;
  var wrap=document.createElement('div');
  wrap.className='os-nav-icons';
  var heartSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var userSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  wrap.innerHTML='<a href="/account" class="os-nav-icon" title="Wishlist">'+heartSvg+'<span id="os-wish-count"></span></a><a href="/account" class="os-nav-icon" title="Account">'+userSvg+'</a>';
  document.body.appendChild(wrap);
}

/* ═══ NAV AUTH STATE ═══ */
function updateNavAuth(){
  getUser().then(function(user){
    var icons=document.querySelectorAll('.os-nav-icon');
    icons.forEach(function(icon){
      if(icon.title==='Account')icon.href=user?'/account':'/log-in';
    });
  });
}

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded',function(){
  var path=location.pathname;
  if(path==='/log-in'||path==='/log-in/')initLogin();
  if(path==='/sign-up'||path==='/sign-up/')initSignup();
  if(path==='/account'||path==='/account/')initAccount();
  injectNavIcons();
  updateNavAuth();
});

window.osAuth={initSupabase:initSupabase,getUser:getUser};
})();
