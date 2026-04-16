/* ═══ OSTUFF PRODUCT DETAILS — Accordion dropdowns ═══ */
(function(){
if(location.pathname.indexOf('/product/')!==0)return;

var SECTIONS=[
  {title:'SIZE & FIT',body:'Consult our detailed size chart for the perfect fit.<br><br><a href="/size-guide" style="display:inline-block;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px">VIEW SIZE GUIDE \u2192</a>'},
  {title:'MATERIALS & CARE',body:'Machine wash at 30\u00b0C \u2014 cold cycle.<br>Do not tumble dry.<br>Iron on low heat, inside out.<br>Do not dry clean.'},
  {title:'SHIPPING & MADE TO ORDER',body:'Each piece is handcrafted to order in Paris.<br>Production time: 3 to 4 weeks.<br>Free shipping over \u20ac200. Worldwide tracked delivery.<br>14-day return policy on unworn items.<br><br><a href="/assistance" style="display:inline-block;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px">SHIPPING POLICY \u2192</a>'},
  {title:'AUTHENTICITY \u2014 GIMIQ\u00ae',body:'Every OSTUFF piece includes a digital authenticity passport powered by GIMIQ\u00ae blockchain.<br>NFC chip embedded \u2014 scan to verify instantly.<br>Ownership history & resale certificate included.'}
];

function inject(){
  if(document.getElementById('os-pd-wrap'))return;

  /* Build the full-width accordion section */
  var section=document.createElement('div');
  section.id='os-pd-wrap';
  section.style.cssText='width:100%;max-width:700px;margin:0 auto;padding:40px 24px;font-family:"Space Grotesk",sans-serif;background:#efece9;border-top:1px solid #e0ddd8';

  SECTIONS.forEach(function(sec){
    var row=document.createElement('div');
    row.style.cssText='border-bottom:1px solid #ddd8d0';

    var head=document.createElement('div');
    head.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer';

    var titleSpan=document.createElement('span');
    titleSpan.textContent=sec.title;
    titleSpan.style.cssText='font:500 9px/1 "Space Grotesk",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#999';

    var plus=document.createElement('span');
    plus.textContent='+';
    plus.style.cssText='font:400 16px/1 "Space Grotesk",sans-serif;color:#999;user-select:none';

    head.appendChild(titleSpan);
    head.appendChild(plus);

    var panel=document.createElement('div');
    panel.style.cssText='display:none;padding:0 0 18px';
    panel.innerHTML='<div style="font:400 11px/1.7 \'Space Grotesk\',sans-serif;color:#777;letter-spacing:.03em">'+sec.body+'</div>';

    head.addEventListener('click',function(){
      if(panel.style.display==='none'){
        panel.style.display='block';
        plus.textContent='\u2212';
        titleSpan.style.color='#1a1a1a';
        plus.style.color='#1a1a1a';
      }else{
        panel.style.display='none';
        plus.textContent='+';
        titleSpan.style.color='#999';
        plus.style.color='#999';
      }
    });

    head.addEventListener('mouseenter',function(){titleSpan.style.color='#1a1a1a';plus.style.color='#1a1a1a'});
    head.addEventListener('mouseleave',function(){
      if(panel.style.display==='none'){titleSpan.style.color='#999';plus.style.color='#999'}
    });

    row.appendChild(head);
    row.appendChild(panel);
    section.appendChild(row);
  });

  /* INSERT OUTSIDE the sticky panel — after the product section, before related products */
  var productSection=document.querySelector('section.section_product-page');
  if(!productSection){
    /* Try finding by the wrapper class */
    var wrapper=document.querySelector('.section_product-page_wrapper');
    if(wrapper)productSection=wrapper.closest('section');
  }
  if(!productSection){
    /* Last resort: find the section containing the product images */
    var img=document.querySelector('.product-page_left');
    if(img)productSection=img.closest('section');
  }

  if(productSection&&productSection.parentNode){
    productSection.parentNode.insertBefore(section,productSection.nextSibling);
    console.log('[OSTUFF] Product accordions inserted AFTER product section');
  }else{
    /* Absolute fallback */
    var related=document.querySelector('.section_products');
    if(related&&related.parentNode){
      related.parentNode.insertBefore(section,related);
      console.log('[OSTUFF] Product accordions inserted BEFORE related products');
    }
  }
}

function init(){setTimeout(inject,600)}
if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
