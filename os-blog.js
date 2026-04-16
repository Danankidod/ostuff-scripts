/* ═══ OSTUFF BLOG — Dark theme + Instagram section ═══ */
(function(){
var path=location.pathname;
if(path!=='/blog'&&path!=='/blog/')return;

/* Dark theme for blog page */
document.body.style.background='#0a0a0a';

/* Style the Webflow CMS blog list */
function styleBlogList(){
  /* Make heading small */
  document.querySelectorAll('h1').forEach(function(h){
    h.style.cssText='font:600 11px/1 "Space Grotesk",sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#fff;margin:100px 0 8px';
  });
  /* Style description */
  document.querySelectorAll('.os-blog-list>p,section p').forEach(function(p){
    if(p.closest('#os-ig-feed'))return;
    p.style.cssText='font:400 10px/1.6 "Space Grotesk",sans-serif;color:#555;letter-spacing:.08em;margin:0 0 40px';
  });
  /* Style CMS blog items if they exist */
  document.querySelectorAll('.w-dyn-item').forEach(function(item){
    item.style.cssText='border:1px solid #1a1a1a;overflow:hidden;transition:all .3s';
  });
  document.querySelectorAll('.w-dyn-item a').forEach(function(a){a.style.textDecoration='none'});
  document.querySelectorAll('.w-dyn-item img').forEach(function(img){img.style.cssText='width:100%;height:100%;object-fit:cover'});
  document.querySelectorAll('.w-dyn-list').forEach(function(list){
    list.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;max-width:1100px;margin:0 auto;padding:0 24px';
  });
}

/* Add Instagram section */
function addInstagramSection(){
  var target=document.getElementById('os-ig-feed');
  if(!target){
    target=document.createElement('div');
    target.id='os-ig-feed';
    target.style.cssText='max-width:1100px;margin:60px auto 40px;padding:0 24px';
    var main=document.querySelector('main')||document.querySelector('.page-wrapper')||document.body;
    var footer=document.querySelector('footer,.footer,.footer_');
    if(footer)main.insertBefore(target,footer);
    else main.appendChild(target);
  }
}

setTimeout(function(){
  styleBlogList();
  addInstagramSection();
  /* Load Instagram script */
  var s=document.createElement('script');
  s.src='https://danankidod.github.io/ostuff-scripts/os-instagram.js';
  document.body.appendChild(s);
},500);
})();
