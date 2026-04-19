
(function(){
/* ═══ MADE TO ORDER — Replace "Out of stock" everywhere ═══ */
function madeToOrder(){
  document.querySelectorAll('*').forEach(function(el){
    if(el.children.length===0&&/out of stock/i.test(el.textContent)){
      el.textContent='MADE TO ORDER — 3-4 WEEKS';
      el.style.cssText='font:500 9px/1 "Space Grotesk",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09b93';
    }
  });
  /* Re-enable disabled add-to-cart buttons */
  document.querySelectorAll('[data-node-type="commerce-add-to-cart-button"][disabled],.w-commerce-commerceaddtocartbutton[disabled]').forEach(function(btn){
    btn.disabled=false;
    btn.style.opacity='1';
    btn.style.cursor='pointer';
  });
}
window.addEventListener('load',function(){setTimeout(madeToOrder,800);setTimeout(madeToOrder,2000)});

document.addEventListener('DOMContentLoaded',function(){
var B=document.getElementById('os-bar'),N=document.getElementById('os-nav');
if(!B||!N)return;
var panels=N.querySelectorAll('.os-panel');
function show(id){panels.forEach(function(p){p.classList.remove('is-active')});var el=document.getElementById('os-panel-'+id);if(el)el.classList.add('is-active')}
function open(){N.classList.add('is-open');show('main')}
function close(){N.classList.remove('is-open')}
var tog=document.getElementById('os-bar-tog');
var srch=document.getElementById('os-bar-search');
if(tog)tog.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(N.classList.contains('is-open')){close()}else{open()}});
if(srch)srch.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();N.classList.add('is-open');show('search');var si=document.getElementById('os-search-input');if(si){si.focus();loadRecent()}});
N.querySelectorAll('.os-ar').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();show(this.getAttribute('data-panel'))})});
N.querySelectorAll('.os-bk').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();show(this.getAttribute('data-panel'))})});
document.addEventListener('click',function(e){if(N.classList.contains('is-open')&&!N.contains(e.target)&&!B.contains(e.target))close()});
var si=document.getElementById('os-search-input');
var sc=document.getElementById('os-search-clear');
var recentDiv=document.getElementById('os-search-recent');
var productCache=null;
function fetchProducts(){if(productCache)return Promise.resolve(productCache);return fetch('/shop').then(function(r){return r.text()}).then(function(html){var doc=new DOMParser().parseFromString(html,'text/html');var items=doc.querySelectorAll('.products_item');var arr=[];items.forEach(function(it){var n=it.querySelector('[class*="product_name"]');var p=it.querySelector('[class*="product_price"]');var img=it.querySelector('img[class*="product-image"],img[class*="image-11"]');var link=it.querySelector('a[href*="/product/"]');var tags=[];it.querySelectorAll('[fs-list-field="tags"]').forEach(function(t){tags.push(t.textContent.trim().toLowerCase())});if(n)arr.push({name:n.textContent.trim(),price:p?p.textContent.trim():'',img:img?img.src:'',url:link?link.href:'',tags:tags})});productCache=arr;return arr})}
function loadRecent(){var r=JSON.parse(localStorage.getItem('os-recent')||'[]');if(!recentDiv)return;var links=recentDiv.querySelectorAll('.os-lk');links.forEach(function(l){l.remove()});if(r.length===0){recentDiv.style.display='none';return}recentDiv.style.display='block';r.slice(0,5).forEach(function(q){var a=document.createElement('a');a.className='os-lk';a.href='/shop?tags='+encodeURIComponent(q);a.textContent=q;a.style.cssText="color:#fff;font:500 11px/1 'Space Grotesk',sans-serif;letter-spacing:.1em;padding:8px 0;display:block";recentDiv.appendChild(a)})}
function showResults(query){var resultsDiv=document.getElementById('os-search-results');if(!resultsDiv){resultsDiv=document.createElement('div');resultsDiv.id='os-search-results';si.closest('.os-panel').appendChild(resultsDiv)}resultsDiv.innerHTML='';if(!query){resultsDiv.style.display='none';if(recentDiv)recentDiv.style.display='block';loadRecent();return}if(recentDiv)recentDiv.style.display='none';resultsDiv.style.display='block';fetchProducts().then(function(products){var q=query.toLowerCase();var matches=products.filter(function(p){return p.name.toLowerCase().indexOf(q)>-1||p.tags.some(function(t){return t.indexOf(q)>-1})});var h='<p style="color:#666;font:400 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;margin-bottom:16px">'+matches.length+' RESULTS</p>';var allTags=[];products.forEach(function(p){p.tags.forEach(function(t){if(t.indexOf(q)>-1&&allTags.indexOf(t)===-1)allTags.push(t)})});if(allTags.length>0){h+='<p style="font:700 10px/1 \'Space Grotesk\',sans-serif;color:#fff;letter-spacing:.14em;margin:16px 0 10px">SUGGESTED</p>';allTags.slice(0,7).forEach(function(t){h+='<a href="/shop?tags='+encodeURIComponent(t)+'" style="display:block;color:#fff;font:500 11px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;padding:6px 0;text-decoration:none;text-transform:uppercase">'+t.toUpperCase()+'</a>'})}if(matches.length>0){h+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:20px">';matches.slice(0,4).forEach(function(p){h+='<a href="/shop?tags='+encodeURIComponent(query)+'" style="text-decoration:none;color:#fff"><div style="aspect-ratio:1/1;overflow:hidden;background:#1a1a1a;margin-bottom:8px">'+(p.img?'<img src="'+p.img+'" style="width:100%;height:100%;object-fit:cover">':'')+'</div><p style="font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;color:#a09b93;margin:0 0 4px">OSTUFF</p><p style="font:500 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.08em;margin:0 0 4px">'+p.name+'</p><p style="font:400 10px/1 \'Space Grotesk\',sans-serif;color:#666;margin:0">'+p.price+'</p></a>'});h+='</div>'}h+='<a href="/shop?tags='+encodeURIComponent(query)+'" style="display:block;text-align:center;padding:20px 0;margin-top:16px;border-top:1px solid #333;color:#fff;font:700 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.16em;text-decoration:none">VIEW ALL</a>';resultsDiv.innerHTML=h})}
var searchTimer;
if(si){si.addEventListener('input',function(){clearTimeout(searchTimer);var v=si.value.trim();searchTimer=setTimeout(function(){showResults(v)},300)});si.addEventListener('keydown',function(e){if(e.key==='Enter'&&si.value.trim()){var q=si.value.trim();var r=JSON.parse(localStorage.getItem('os-recent')||'[]');r=r.filter(function(x){return x!==q});r.unshift(q);if(r.length>5)r.pop();localStorage.setItem('os-recent',JSON.stringify(r));window.location='/shop?tags='+encodeURIComponent(q)}})}
if(sc)sc.addEventListener('click',function(e){e.preventDefault();if(si){si.value='';showResults('')}});
});
if(location.pathname==='/shop'||location.pathname==='/shop/'){
var bcFilter=document.getElementById('os-bc-filter');
if(bcFilter){var p=new URLSearchParams(location.search);var g=p.get('Gamme');var t=p.get('tags');if(g||t){bcFilter.textContent=' / '+(g||'')+(g&&t?' / ':'')+(t||'')}}

var filterBtn=document.getElementById('os-filter-btn');
var sortBtn=document.getElementById('os-sort-btn');
if(filterBtn)filterBtn.addEventListener('click',function(){var fb=document.querySelector('[data-w-id="6538feff-2313-ea01-ddb9-0e73ef305965"]');if(fb){fb.style.pointerEvents='auto';fb.parentElement.style.pointerEvents='auto';fb.click()}});
if(sortBtn)sortBtn.addEventListener('click',function(){var sb=document.querySelector('.dropdown1_toggle');if(sb){sb.style.pointerEvents='auto';sb.parentElement.style.pointerEvents='auto';sb.click()}});

function forceGrid(){document.querySelectorAll('[class*="All Collection wrapper"]').forEach(function(el){el.style.cssText='display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:0!important;width:100%!important'});document.querySelectorAll('.products_item').forEach(function(el){el.style.width='100%'})}
forceGrid();window.addEventListener('load',function(){forceGrid();setTimeout(forceGrid,500);setTimeout(forceGrid,1500)});
var gridWrap=document.querySelector('[class*="All Collection wrapper"]');
if(gridWrap){var _gridTimer;new MutationObserver(function(){clearTimeout(_gridTimer);_gridTimer=setTimeout(forceGrid,100)}).observe(gridWrap,{childList:true,attributes:true,attributeFilter:['style','class']})}

var bd=document.createElement('div');bd.id='os-filter-backdrop';document.body.appendChild(bd);
var fm=document.querySelector('.filters6_filters-modal');
var filterOpen=false;
function showBackdrop(){bd.style.display='block';filterOpen=true}
function hideBackdrop(){bd.style.display='none';filterOpen=false}
bd.addEventListener('click',function(){var btn=document.querySelector('[data-w-id="6538feff-2313-ea01-ddb9-0e73ef305965"]');if(btn)btn.click();hideBackdrop()});
if(fm){new MutationObserver(function(){var r=fm.getBoundingClientRect();if(r.width>50&&r.left>-50&&r.bottom>0&&!filterOpen){showBackdrop()}else if((r.width<50||r.left<-50)&&filterOpen){hideBackdrop()}}).observe(fm,{attributes:true,attributeFilter:['style','class']})}
document.querySelectorAll('.filters6_modal-menu a').forEach(function(el){el.addEventListener('click',function(){setTimeout(hideBackdrop,200)})})

document.querySelectorAll('.products_item img, .w-dyn-item img').forEach(function(img,i){if(i>3){img.setAttribute('loading','lazy');img.setAttribute('decoding','async')}});

var params=new URLSearchParams(location.search);
var gamme=params.get('Gamme');
var tag=params.get('tags');
if(gamme||tag){
function clickFilter(field,value){
var labels=document.querySelectorAll('label[fs-cmsfilter-field]');
labels.forEach(function(lbl){
var f=lbl.getAttribute('fs-cmsfilter-field');
var input=lbl.querySelector('input[fs-list-value="'+value+'"]');
if(input&&f===field){lbl.click();console.log('OS: filter '+field+'='+value)}
});
}
window.addEventListener('load',function(){setTimeout(function(){
if(gamme)clickFilter('Gamme',gamme);
if(tag){setTimeout(function(){
var searchInput=document.querySelector('[fs-list-field="*"]');
if(searchInput){searchInput.value=tag;searchInput.dispatchEvent(new Event('input',{bubbles:true}));console.log('OS: search tag='+tag)}
},600)}
},1000)});
}
}
(function(){if(location.pathname.indexOf('/lookbook')!==0)return;var c=parseInt(localStorage.getItem('os-lb-cols'))||3;function ap(){document.documentElement.style.setProperty('--os-lb-cols',c);}ap();function init(){var g=document.querySelector('.os-lb-grid')||document.querySelector('.w-dyn-list');if(!g)return;var z=document.querySelector('.os-lb-zoom');if(!z)return;var bt=z.querySelectorAll('button,[class*="os-lb-btn"]'),bm=bt[0],bp=bt[1];function zoom(n){if(n===c||n<1||n>6)return;g.classList.add('os-zoom');setTimeout(function(){c=n;localStorage.setItem('os-lb-cols',c);ap();g.classList.remove('os-zoom');},300);}if(bm)bm.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();zoom(c+1);});if(bp)bp.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();zoom(c-1);});g.querySelectorAll('.w-dyn-item,[class*="os-lb-item"]').forEach(function(i){i.style.overflow='hidden';i.style.aspectRatio='1/1';i.style.cursor='pointer';});}if(document.readyState==='complete')init();else window.addEventListener('load',init);})();

})();
