/* ═══ OSTUFF PRODUCT DETAILS — Accordion dropdowns ═══ */
(function(){
if(location.pathname.indexOf('/product/')!==0)return;

var SECTIONS=[
  {title:'SIZE & FIT',body:'Consult our detailed size chart for the perfect fit.<br><br><a href="/size-guide" style="display:inline-block;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px;transition:all .2s">VIEW SIZE GUIDE \u2192</a>'},
  {title:'MATERIALS & CARE',body:'Machine wash at 30\u00b0C \u2014 cold cycle.<br>Do not tumble dry.<br>Iron on low heat, inside out.<br>Do not dry clean.'},
  {title:'SHIPPING & MADE TO ORDER',body:'Each piece is handcrafted to order in Paris.<br>Production time: 3 to 4 weeks.<br>Free shipping over \u20ac200. Worldwide tracked delivery.<br>14-day return policy on unworn items.<br><br><a href="/assistance" style="display:inline-block;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;text-decoration:none;border:1px solid #ccc;padding:8px 16px;transition:all .2s">SHIPPING POLICY \u2192</a>'},
  {title:'AUTHENTICITY \u2014 GIMIQ\u00ae',body:'Every OSTUFF piece includes a digital authenticity passport powered by GIMIQ\u00ae blockchain.<br>NFC chip embedded \u2014 scan to verify instantly.<br>Ownership history & resale certificate included.'}
];

function inject(){
  if(document.getElementById('os-pd-wrap'))return;

  /* Fix right panel scrollability */
  var rightPanel=document.querySelector('.product-page_right');
  if(rightPanel)rightPanel.style.cssText+=';overflow-y:auto!important';

  /* Build accordion with ALL inline styles */
  var wrap=document.createElement('div');
  wrap.id='os-pd-wrap';
  wrap.style.cssText='width:100%;background:#efece9;padding:4px 40px 0;box-sizing:border-box';

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
    wrap.appendChild(row);
  });

  /* Insert before div-block-15 (back to shop) */
  var target=document.querySelector('.div-block-15');
  if(target&&target.parentNode){
    target.parentNode.insertBefore(wrap,target);
  }else{
    /* Fallback */
    var rp=document.querySelector('.product-page_right');
    if(rp)rp.appendChild(wrap);
  }

  /* Fix back to shop */
  var db15=document.querySelector('.div-block-15');
  if(db15)db15.style.cssText+=';padding:16px 40px;width:100%;box-sizing:border-box';

  console.log('[OSTUFF] Product details accordion injected');
}

function init(){setTimeout(inject,600)}
if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
