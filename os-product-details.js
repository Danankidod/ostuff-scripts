/* ═══ OSTUFF PRODUCT DETAILS — Accordion dropdowns ═══ */
(function(){
if(!location.pathname.startsWith('/product/'))return;

var chevron='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" style="transition:transform .3s;flex-shrink:0"><polyline points="6 9 12 15 18 9"/></svg>';

var sections=[
  {
    title:'SIZE & FIT',
    id:'os-dd-size',
    content:function(){
      var model=document.querySelector('[class*="mannequin"],.info-block_title.padding');
      var modelText=model?model.textContent.trim():'';
      var h='<div class="os-dd-body">';
      if(modelText)h+='<p class="os-dd-text">'+modelText+'</p>';
      h+='<a href="/size-guide" class="os-dd-link">VIEW SIZE GUIDE →</a>';
      h+='</div>';
      return h;
    }
  },
  {
    title:'MATERIALS & CARE',
    id:'os-dd-materials',
    content:function(){
      return '<div class="os-dd-body">'+
        '<p class="os-dd-text">Detailed composition on the product label.</p>'+
        '<ul class="os-dd-list">'+
        '<li>Machine wash at 30°C — cold cycle</li>'+
        '<li>Do not tumble dry</li>'+
        '<li>Iron on low heat — inside out</li>'+
        '<li>Do not dry clean</li>'+
        '</ul>'+
        '</div>';
    }
  },
  {
    title:'SHIPPING & MADE TO ORDER',
    id:'os-dd-shipping',
    content:function(){
      return '<div class="os-dd-body">'+
        '<ul class="os-dd-list">'+
        '<li><strong>Made to order</strong> — production time: 3 to 4 weeks</li>'+
        '<li>Free shipping on orders over €200</li>'+
        '<li>Worldwide delivery via tracked courier</li>'+
        '<li>14-day return policy on unworn items</li>'+
        '</ul>'+
        '<a href="/assistance" class="os-dd-link">SHIPPING & RETURNS POLICY →</a>'+
        '</div>';
    }
  },
  {
    title:'AUTHENTICITY — GIMIQ®',
    id:'os-dd-authenticity',
    content:function(){
      return '<div class="os-dd-body">'+
        '<p class="os-dd-text">Every OSTUFF piece includes a digital authenticity passport powered by GIMIQ® blockchain technology.</p>'+
        '<ul class="os-dd-list">'+
        '<li>NFC chip embedded in the garment</li>'+
        '<li>Scan to verify authenticity instantly</li>'+
        '<li>Ownership history & resale certificate</li>'+
        '<li>Proof of handcrafted origin — Paris, France</li>'+
        '</ul>'+
        '<p class="os-dd-badge">'+
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#a09b93" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'+
        ' VERIFIED BY GIMIQ®</p>'+
        '</div>';
    }
  }
];

function injectAccordions(){
  if(document.getElementById('os-product-accordions'))return;
  /* Find the Add to Cart wrapper or the info block */
  var addToCart=document.querySelector('.Add-to-Cart-3,.w-commerce-commerceaddtocartwrapper,[class*="Add to Cart"]');
  var backBtn=document.querySelector('.Div.Block.15,[class*="backtoshop"]');
  var target=backBtn||addToCart;
  if(!target)return;

  var wrap=document.createElement('div');
  wrap.id='os-product-accordions';

  var h='';
  sections.forEach(function(sec){
    h+='<div class="os-dd-section" id="'+sec.id+'">';
    h+='<button class="os-dd-toggle" aria-expanded="false">';
    h+='<span class="os-dd-title">'+sec.title+'</span>';
    h+=chevron;
    h+='</button>';
    h+='<div class="os-dd-content" style="max-height:0;overflow:hidden;transition:max-height .35s cubic-bezier(.4,0,.2,1)">';
    h+=sec.content();
    h+='</div>';
    h+='</div>';
  });
  wrap.innerHTML=h;

  /* Insert after the info block (below the dark panel) */
  var infoBlock=document.querySelector('.product-page_info-block_,[class*="product-page_info-block"]');
  if(infoBlock&&infoBlock.parentNode){
    infoBlock.parentNode.insertBefore(wrap,infoBlock.nextSibling);
  }else if(backBtn&&backBtn.parentNode){
    backBtn.parentNode.insertBefore(wrap,backBtn);
  }else if(addToCart&&addToCart.parentNode){
    addToCart.parentNode.insertBefore(wrap,addToCart.nextSibling);
  }

  /* Toggle logic */
  wrap.querySelectorAll('.os-dd-toggle').forEach(function(btn){
    btn.addEventListener('click',function(){
      var content=this.nextElementSibling;
      var expanded=this.getAttribute('aria-expanded')==='true';
      var svg=this.querySelector('svg');
      if(expanded){
        content.style.maxHeight='0';
        this.setAttribute('aria-expanded','false');
        if(svg)svg.style.transform='rotate(0deg)';
      }else{
        content.style.maxHeight=content.scrollHeight+'px';
        this.setAttribute('aria-expanded','true');
        if(svg)svg.style.transform='rotate(180deg)';
      }
    });
  });
}

/* CSS injection */
function injectStyles(){
  if(document.getElementById('os-dd-styles'))return;
  var style=document.createElement('style');
  style.id='os-dd-styles';
  style.textContent=
    '#os-product-accordions{padding:24px 40px 0;background:#efece9}'+
    '.os-dd-section{border-bottom:1px solid #ddd8d0}'+
    '.os-dd-toggle{display:flex;justify-content:space-between;align-items:center;width:100%;padding:18px 0;background:none;border:0;cursor:pointer!important;transition:color .2s}'+
    '.os-dd-toggle:hover .os-dd-title{color:#1a1a1a}'+
    '.os-dd-title{font:500 9px/1 "Space Grotesk",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#999;transition:color .2s}'+
    '.os-dd-body{padding:0 0 20px}'+
    '.os-dd-text{font:400 11px/1.7 "Space Grotesk",sans-serif;color:#777;letter-spacing:.03em;margin:0 0 12px}'+
    '.os-dd-list{font:400 11px/2 "Space Grotesk",sans-serif;color:#777;letter-spacing:.03em;padding-left:16px;margin:0 0 12px}'+
    '.os-dd-list li{margin:0}'+
    '.os-dd-list strong{color:#1a1a1a}'+
    '.os-dd-link{display:inline-block;font:500 8px/1 "Space Grotesk",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px;transition:all .2s;margin-top:4px}'+
    '.os-dd-link:hover{border-color:#1a1a1a;background:#1a1a1a;color:#efece9}'+
    '.os-dd-badge{display:flex;align-items:center;gap:6px;font:500 8px/1 "Space Grotesk",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#999;margin-top:12px}'+
    '.os-dd-badge svg{stroke:#999}'+
    '.os-dd-toggle svg{color:#999;transition:transform .3s,color .2s}'+
    '.os-dd-toggle:hover svg{color:#1a1a1a}';
  document.head.appendChild(style);
}

function init(){
  injectStyles();
  setTimeout(injectAccordions,600);
}

if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
