/* ═══ OSTUFF WISHLIST ═══ */
(function(){
var heartSVG='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
var heartFilledSVG='<svg viewBox="0 0 24 24" width="18" height="18" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

var wishedSlugs=[];

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
  return{
    slug:slug,
    name:name?name.textContent.trim():'',
    price:price?price.textContent.trim():'',
    image:img?img.src:''
  };
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
          updateBtn(btn,false);
          updateCounter();
        });
      }else{
        c.from('wishlists').insert({user_id:user.id,product_slug:data.slug,product_name:data.name,product_image:data.image,product_price:data.price}).then(function(r){
          if(!r.error){wishedSlugs.push(data.slug);updateBtn(btn,true);updateCounter()}
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
    btn.style.cssText='position:absolute;top:12px;right:12px;z-index:10;background:rgba(255,255,255,.85);border:0;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;backdrop-filter:blur(4px)';
    updateBtn(btn,isWished(slug));
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleWish(card,btn)});
    btn.addEventListener('mouseenter',function(){btn.style.transform='scale(1.1)'});
    btn.addEventListener('mouseleave',function(){btn.style.transform='scale(1)'});
    card.style.position='relative';
    card.appendChild(btn);
  });
}

function loadUserWishlist(){
  if(!window.osAuth)return;
  window.osAuth.getUser().then(function(user){
    if(!user){wishedSlugs=[];addHearts();return}
    window.osAuth.initSupabase().then(function(c){
      c.from('wishlists').select('product_slug').eq('user_id',user.id).then(function(r){
        wishedSlugs=(r.data||[]).map(function(w){return w.product_slug});
        updateCounter();
        addHearts();
      });
    });
  });
}

/* ═══ INIT ═══ */
function init(){
  setTimeout(loadUserWishlist,500);
  var gridWrap=document.querySelector('[class*="All Collection wrapper"]');
  if(gridWrap){new MutationObserver(function(){addHearts()}).observe(gridWrap,{childList:true})}
}

if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
