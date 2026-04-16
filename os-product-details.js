/* ═══ OSTUFF PRODUCT DETAILS — Accordion dropdowns ═══ */
(function(){
if(location.pathname.indexOf('/product/')!==0)return;

var SECTIONS=[
  {title:'SIZE & FIT',body:'<p>Consult our detailed size chart for the perfect fit.</p><a href="/size-guide" class="os-pd-link">VIEW SIZE GUIDE \u2192</a>'},
  {title:'MATERIALS & CARE',body:'<p>Machine wash at 30\u00b0C \u2014 cold cycle.<br>Do not tumble dry.<br>Iron on low heat, inside out.<br>Do not dry clean.</p>'},
  {title:'SHIPPING & MADE TO ORDER',body:'<p>Each piece is handcrafted to order in Paris.<br>Production time: 3 to 4 weeks.<br>Free shipping over \u20ac200. Worldwide tracked delivery.<br>14-day return policy on unworn items.</p><a href="/assistance" class="os-pd-link">SHIPPING POLICY \u2192</a>'},
  {title:'AUTHENTICITY \u2014 GIMIQ\u00ae',body:'<p>Every OSTUFF piece includes a digital authenticity passport powered by GIMIQ\u00ae blockchain.<br>NFC chip embedded \u2014 scan to verify instantly.<br>Ownership history & resale certificate included.</p>'}
];

function addCSS(){
  if(document.getElementById('os-pd-css'))return;
  var s=document.createElement('style');s.id='os-pd-css';
  s.textContent=
    '#os-pd-wrap{width:100%;background:#efece9;padding:4px 40px 0}'+
    '.os-pd-row{border-bottom:1px solid #ddd8d0}'+
    '.os-pd-head{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer!important}'+
    '.os-pd-head span:first-child{font:500 9px/1 "Space Grotesk",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#999;transition:color .2s}'+
    '.os-pd-head:hover span:first-child{color:#1a1a1a}'+
    '.os-pd-plus{font:400 16px/1 "Space Grotesk",sans-serif;color:#999;transition:color .2s;user-select:none}'+
    '.os-pd-head:hover .os-pd-plus{color:#1a1a1a}'+
    '.os-pd-panel{display:none;padding:0 0 18px}'+
    '.os-pd-panel.is-open{display:block}'+
    '.os-pd-panel p{font:400 11px/1.7 "Space Grotesk",sans-serif;color:#777;letter-spacing:.03em;margin:0 0 10px}'+
    '.os-pd-link{display:inline-block;font:500 8px/1 "Space Grotesk",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px;margin-top:4px;transition:all .2s}'+
    '.os-pd-link:hover{border-color:#1a1a1a;background:#1a1a1a;color:#efece9}'+
    /* Fix right panel: make scrollable so accordions + back to shop are visible */
    '.product-page_right{overflow-y:auto!important}'+
    '.div-block-15{padding:16px 40px!important;width:100%!important;box-sizing:border-box!important}'+
    '.backtoshop-button{display:block!important}'+
    '.backtoshop-text{text-align:center!important}';
  document.head.appendChild(s);
}

function buildAccordion(){
  var h='';
  SECTIONS.forEach(function(s,i){
    h+='<div class="os-pd-row">';
    h+='<div class="os-pd-head" data-i="'+i+'"><span>'+s.title+'</span><span class="os-pd-plus">+</span></div>';
    h+='<div class="os-pd-panel">'+s.body+'</div>';
    h+='</div>';
  });
  return h;
}

function inject(){
  if(document.getElementById('os-pd-wrap'))return;
  addCSS();

  var wrap=document.createElement('div');
  wrap.id='os-pd-wrap';
  wrap.innerHTML=buildAccordion();

  /* Use the REAL class names from the live page */
  var target=document.querySelector('.div-block-15');
  if(target&&target.parentNode){
    target.parentNode.insertBefore(wrap,target);
  }else{
    /* Fallback: after add-to-cart wrapper */
    var atc=document.querySelector('.add-to-cart-3');
    if(atc&&atc.parentNode){
      atc.parentNode.insertBefore(wrap,atc.nextSibling);
    }else{
      /* Last resort: append to right panel */
      var right=document.querySelector('.product-page_right');
      if(right)right.appendChild(wrap);
    }
  }

  /* Toggle */
  wrap.querySelectorAll('.os-pd-head').forEach(function(h){
    h.addEventListener('click',function(){
      var p=this.nextElementSibling;
      var icon=this.querySelector('.os-pd-plus');
      var open=p.classList.contains('is-open');
      p.classList.toggle('is-open');
      if(icon)icon.textContent=open?'+':'\u2212';
    });
  });

  console.log('[OSTUFF] Product details accordion injected');
}

/* Wait for Webflow to finish rendering */
function init(){setTimeout(inject,600)}
if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
