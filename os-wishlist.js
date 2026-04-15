/* ═══ OSTUFF WISHLIST — Side Panel ═══ */
(function(){
var heartSVG='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
var heartFilledSVG='<svg viewBox="0 0 24 24" width="18" height="18" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
var wishedSlugs=[];
var wishData=[];
var panel=null;
var overlay=null;

/* ═══ SIDE PANEL ═══ */
function createPanel(){
  if(panel)return;
  overlay=document.createElement('div');
  overlay.id='os-wish-overlay';
  overlay.style.cssText='position:fixed;inset:0;z-index:10010;background:rgba(0,0,0,.4);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;transition:opacity .3s';
  overlay.addEventListener('click',closePanel);
  document.body.appendChild(overlay);

  panel=document.createElement('div');
  panel.id='os-wish-panel';
  panel.style.cssText='position:fixed;top:0;right:0;bottom:0;z-index:10011;width:min(420px,90vw);background:#0a0a0a;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);overflow-y:auto;font-family:"Space Grotesk",sans-serif';
  panel.innerHTML='<div style="padding:24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1a1a1a"><p style="font:600 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#fff;margin:0">WISHLIST</p><button id="os-wish-close" style="background:none;border:0;color:#555;font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:color .2s">CLOSE</button></div><div id="os-wish-items" style="padding:16px"></div>';
  document.body.appendChild(panel);
  document.getElementById('os-wish-close').addEventListener('click',closePanel);
}

function openPanel(){
  createPanel();
  renderPanel();
  overlay.style.display='block';
  requestAnimationFrame(function(){panel.style.transform='translateX(0)'});
}

function closePanel(){
  if(!panel)return;
  panel.style.transform='translateX(100%)';
  overlay.style.display='none';
}

function renderPanel(){
  var el=document.getElementById('os-wish-items');
  if(!el)return;
  if(wishData.length===0){
    el.innerHTML='<p style="color:#555;font:400 10px/1.6 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase;text-align:center;padding:40px 0">Your wishlist is empty</p>';
    return;
  }
  var h='';
  wishData.forEach(function(item){
    h+='<div class="os-wish-row" data-slug="'+item.product_slug+'" style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid #1a1a1a;align-items:center">';
    h+='<a href="/product/'+item.product_slug+'" style="flex-shrink:0"><div style="width:80px;height:80px;overflow:hidden;background:#1a1a1a">';
    if(item.product_image)h+='<img src="'+item.product_image+'" style="width:100%;height:100%;object-fit:cover">';
    h+='</div></a>';
    h+='<div style="flex:1;min-width:0">';
    h+='<a href="/product/'+item.product_slug+'" style="text-decoration:none"><p style="font:500 10px/1.2 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin:0 0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+item.product_name+'</p></a>';
    h+='<p style="font:400 10px/1 \'Space Grotesk\',sans-serif;color:#555;margin:0">'+item.product_price+'</p>';
    h+='</div>';
    h+='<button onclick="osRemoveWishPanel(\''+item.product_slug+'\')" style="background:none;border:0;color:#333;cursor:pointer;padding:8px;transition:color .2s;flex-shrink:0" title="Remove"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
    h+='</div>';
  });
  h+='<a href="/shop" style="display:block;text-align:center;padding:20px 0;margin-top:8px;color:#fff;font:600 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;transition:color .2s">CONTINUE SHOPPING</a>';
  el.innerHTML=h;
}

window.osRemoveWishPanel=function(slug){
  if(!window.osAuth)return;
  window.osAuth.getUser().then(function(user){
    if(!user)return;
    window.osAuth.initSupabase().then(function(c){
      c.from('wishlists').delete().eq('user_id',user.id).eq('product_slug',slug).then(function(){
        wishedSlugs=wishedSlugs.filter(function(s){return s!==slug});
        wishData=wishData.filter(function(w){return w.product_slug!==slug});
        updateCounter();
        renderPanel();
        var btn=document.querySelector('.os-wish-btn[data-slug="'+slug+'"]');
        if(btn)updateBtn(btn,false);
        document.querySelectorAll('.products_item').forEach(function(card){
          var b=card.querySelector('.os-wish-btn');
          if(b&&getSlug(card)===slug)updateBtn(b,false);
        });
      });
    });
  });
};

/* ═══ EXPOSE OPEN PANEL ═══ */
window.osOpenWishPanel=openPanel;

/* ═══ PRODUCT CARDS ═══ */
function getSlug(card){
  var link=card.querySelector('a[href*="/product/"]');
  if(!link)return null;
  var parts=link.href.split('/product/');
  return parts[1]?parts[1].replace(/\/$/,''):null;
}

function getProductData(card){
  var slug=getSlug(card);
  if(!slug)return null;
  var name=card.querySelector('[class*="product_name"]');
  var price=card.querySelector('[class*="product_price"]');
  var img=card.querySelector('.Overlay img, img[class*="product-image"], img[class*="image-11"]');
  var link=card.querySelector('a[href*="/product/"]');
  var imgSrc=img?img.src:'';
  /* Convert avif/webp to jpg for email compatibility */
  if(imgSrc)imgSrc=imgSrc.replace('.avif','.jpg').replace('.webp','.jpg');
  return{slug:slug,name:name?name.textContent.trim():'',price:price?price.textContent.trim():'',image:imgSrc,url:link?link.href:''};
}

function isWished(slug){return wishedSlugs.indexOf(slug)>-1}

function updateBtn(btn,wished){
  btn.innerHTML=wished?heartFilledSVG:heartSVG;
  btn.title=wished?'Remove from wishlist':'Add to wishlist';
  btn.style.color=wished?'#1a1a1a':'#999';
}

function toggleWish(card,btn){
  if(!window.osAuth){alert('Loading...');return}
  window.osAuth.getUser().then(function(user){
    if(!user){window.location='/log-in';return}
    var data=getProductData(card);
    if(!data)return;
    window.osAuth.initSupabase().then(function(c){
      if(isWished(data.slug)){
        c.from('wishlists').delete().eq('user_id',user.id).eq('product_slug',data.slug).then(function(){
          wishedSlugs=wishedSlugs.filter(function(s){return s!==data.slug});
          wishData=wishData.filter(function(w){return w.product_slug!==data.slug});
          updateBtn(btn,false);
          updateCounter();
        });
      }else{
        c.from('wishlists').insert({user_id:user.id,product_slug:data.slug,product_name:data.name,product_image:data.image,product_price:data.price,product_url:data.url}).then(function(r){
          if(!r.error){wishedSlugs.push(data.slug);wishData.push({product_slug:data.slug,product_name:data.name,product_image:data.image,product_price:data.price});updateBtn(btn,true);updateCounter()}
        });
      }
    });
  });
}

function updateCounter(){
  var el=document.getElementById('os-wish-count');
  if(el)el.textContent=wishedSlugs.length>0?'( '+wishedSlugs.length+' )':'';
}

function addHearts(){
  document.querySelectorAll('.products_item').forEach(function(card){
    if(card.querySelector('.os-wish-btn'))return;
    var slug=getSlug(card);
    if(!slug)return;
    var btn=document.createElement('button');
    btn.className='os-wish-btn';
    btn.setAttribute('data-slug',slug);
    btn.style.cssText='position:absolute;top:12px;right:12px;z-index:10;background:rgba(255,255,255,.85);border:0;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;backdrop-filter:blur(4px)';
    updateBtn(btn,isWished(slug));
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleWish(card,btn)});
    card.style.position='relative';
    card.appendChild(btn);
  });
}

function loadUserWishlist(){
  if(!window.osAuth)return;
  window.osAuth.getUser().then(function(user){
    if(!user){wishedSlugs=[];wishData=[];addHearts();return}
    window.osAuth.initSupabase().then(function(c){
      c.from('wishlists').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).then(function(r){
        wishData=r.data||[];
        wishedSlugs=wishData.map(function(w){return w.product_slug});
        updateCounter();
        addHearts();
      });
    });
  });
}

function init(){
  setTimeout(loadUserWishlist,500);
  var gridWrap=document.querySelector('[class*="All Collection wrapper"]');
  if(gridWrap){new MutationObserver(function(){addHearts()}).observe(gridWrap,{childList:true})}
}

if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
