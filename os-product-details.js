/* ═══ OSTUFF PRODUCT DETAILS — Accordion dropdowns ═══ */
(function(){
if(location.pathname.indexOf('/product/')!==0)return;

var SECTIONS=[
  {title:'SIZE & FIT',body:'<p>Consult our detailed size chart for the perfect fit.</p><a href="/size-guide" class="os-pd-link">VIEW SIZE GUIDE →</a>'},
  {title:'MATERIALS & CARE',body:'<p>Machine wash at 30°C — cold cycle. Do not tumble dry. Iron on low heat, inside out. Do not dry clean.</p>'},
  {title:'SHIPPING & MADE TO ORDER',body:'<p>Each piece is handcrafted to order in Paris.<br>Production time: 3 to 4 weeks.<br>Free shipping over €200. Worldwide tracked delivery.<br>14-day return policy on unworn items.</p><a href="/assistance" class="os-pd-link">SHIPPING POLICY →</a>'},
  {title:'AUTHENTICITY — GIMIQ®',body:'<p>Every OSTUFF piece includes a digital authenticity passport powered by GIMIQ® blockchain technology.<br>NFC chip embedded — scan to verify instantly.<br>Ownership history & resale certificate included.</p>'}
];

function buildHTML(){
  var h='<div id="os-pd-wrap">';
  SECTIONS.forEach(function(s,i){
    h+='<div class="os-pd-row">';
    h+='<div class="os-pd-head" data-idx="'+i+'">';
    h+='<span>'+s.title+'</span><span class="os-pd-plus">+</span>';
    h+='</div>';
    h+='<div class="os-pd-panel">'+s.body+'</div>';
    h+='</div>';
  });
  h+='</div>';
  return h;
}

function addCSS(){
  if(document.getElementById('os-pd-css'))return;
  var s=document.createElement('style');s.id='os-pd-css';
  s.textContent=[
    '#os-pd-wrap{width:100%;background:#efece9;padding:4px 40px 0}',
    '.os-pd-row{border-bottom:1px solid #ddd8d0}',
    '.os-pd-head{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer}',
    '.os-pd-head span:first-child{font:500 9px/1 "Space Grotesk",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#999;transition:color .2s}',
    '.os-pd-head:hover span:first-child{color:#1a1a1a}',
    '.os-pd-plus{font:400 16px/1 "Space Grotesk",sans-serif;color:#999;transition:color .2s}',
    '.os-pd-head:hover .os-pd-plus{color:#1a1a1a}',
    '.os-pd-panel{display:none;padding:0 0 18px}',
    '.os-pd-panel p{font:400 11px/1.7 "Space Grotesk",sans-serif;color:#777;letter-spacing:.03em;margin:0 0 10px}',
    '.os-pd-link{display:inline-block;font:500 8px/1 "Space Grotesk",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px;margin-top:4px;transition:all .2s}',
    '.os-pd-link:hover{border-color:#1a1a1a;background:#1a1a1a;color:#efece9}',
  ].join('');
  document.head.appendChild(s);
}

function inject(){
  if(document.getElementById('os-pd-wrap'))return;
  addCSS();

  /* Strategy: find the "back to shop" link anywhere on the page */
  var allLinks=document.querySelectorAll('a');
  var backLink=null;
  for(var i=0;i<allLinks.length;i++){
    var txt=allLinks[i].textContent.toLowerCase().trim();
    if(txt==='back to shop'||txt.indexOf('back to shop')>-1){
      backLink=allLinks[i];break;
    }
  }

  var container=document.createElement('div');
  container.innerHTML=buildHTML();
  var wrap=container.firstChild;

  if(backLink){
    /* Insert before the back-to-shop link's parent div */
    var parentDiv=backLink.parentNode;
    if(parentDiv&&parentDiv.parentNode){
      parentDiv.parentNode.insertBefore(wrap,parentDiv);
    }
  }else{
    /* Fallback: find Add to Cart button */
    var atcBtn=document.querySelector('input[value*="Add to Cart"],button[class*="add-to-cart"],.w-commerce-commerceaddtocartbutton');
    if(atcBtn){
      var atcWrap=atcBtn.closest('form')||atcBtn.parentNode;
      if(atcWrap&&atcWrap.parentNode&&atcWrap.parentNode.parentNode){
        atcWrap.parentNode.parentNode.appendChild(wrap);
      }
    }
  }

  /* Toggle click */
  document.querySelectorAll('.os-pd-head').forEach(function(h){
    h.addEventListener('click',function(){
      var panel=this.nextElementSibling;
      var plus=this.querySelector('.os-pd-plus');
      if(panel.style.display==='block'){
        panel.style.display='none';
        if(plus)plus.textContent='+';
      }else{
        panel.style.display='block';
        if(plus)plus.textContent='\u2212';
      }
    });
  });
}

/* Run after page is fully loaded + small delay for Webflow rendering */
function init(){
  setTimeout(inject,800);
}
if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
