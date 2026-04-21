/* ═══ OSTUFF PRODUCT DETAILS — Accordion + Mobile sticky bar ═══ */
(function(){
if(location.pathname.indexOf('/product/')!==0)return;

var SECTIONS=[
  {title:'SIZE & FIT',body:'Consult our detailed size chart for the perfect fit.<br><br><a href="/size-guide" style="display:inline-block;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09b93;text-decoration:none;border:1px solid #444;padding:8px 16px">VIEW SIZE GUIDE \u2192</a>'},
  {title:'MATERIALS & CARE',body:'Machine wash at 30\u00b0C \u2014 cold cycle.<br>Do not tumble dry.<br>Iron on low heat, inside out.<br>Do not dry clean.'},
  {title:'SHIPPING & MADE TO ORDER',body:'Each piece is handcrafted to order in Paris.<br>Production time: 3 to 4 weeks.<br>Free shipping over \u20ac200. Worldwide tracked delivery.<br>14-day return policy on unworn items.<br><br><a href="/assistance" style="display:inline-block;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09b93;text-decoration:none;border:1px solid #444;padding:8px 16px">SHIPPING POLICY \u2192</a>'},
  {title:'AUTHENTICITY \u2014 GIMIQ\u00ae',body:'Every OSTUFF piece includes a digital authenticity passport powered by GIMIQ\u00ae blockchain.<br>NFC chip embedded \u2014 scan to verify instantly.<br>Ownership history & resale certificate included.'}
];

var allPanels=[];
var isMobile=window.innerWidth<768;

/* ─── MOBILE STICKY BAR ─── */
function createStickyBar(){
  if(!isMobile)return;
  if(document.getElementById('os-sticky-bar'))return;

  /* Get product name from og:title meta or page title */
  var name='';
  var price='';

  /* Try og:title first */
  var ogTitle=document.querySelector('meta[property="og:title"]');
  if(ogTitle) name=ogTitle.content.replace('OSTUFF CORPORATION ® - ','').replace('OSTUFF CORPORATION® - ','').trim();

  /* Fallback: try page title */
  if(!name){
    name=document.title.replace('OSTUFF CORPORATION ® - ','').replace('OSTUFF CORPORATION® - ','').trim();
  }

  /* Get price: search all visible text for € pattern */
  var allEls=document.querySelectorAll('.product-page_right *');
  for(var i=0;i<allEls.length;i++){
    var txt=allEls[i].textContent.trim();
    if(txt.match(/^€\s*[\d\s]+\s*EUR$/)){
      price=txt;
      break;
    }
  }

  if(!name)return;

  /* Inject CSS */
  var style=document.createElement('style');
  style.textContent=
    '#os-sticky-bar{position:fixed;bottom:0;left:0;width:100%;background:#fff;z-index:999;'+
    'padding:12px 16px;box-shadow:0 -2px 10px rgba(0,0,0,.1);display:flex;'+
    'justify-content:space-between;align-items:center;transition:transform .3s ease}'+
    '#os-sticky-bar.hidden{transform:translateY(100%)}'+
    '#os-sticky-bar .os-sn{font:500 13px/1.2 "Space Grotesk",sans-serif;color:#1a1a1a;'+
    'text-transform:uppercase;letter-spacing:.05em}'+
    '#os-sticky-bar .os-sp{font:400 13px/1.2 "Space Grotesk",sans-serif;color:#1a1a1a}';
  document.head.appendChild(style);

  /* Build bar */
  var bar=document.createElement('div');
  bar.id='os-sticky-bar';
  bar.innerHTML='<span class="os-sn">'+name+'</span><span class="os-sp">'+price+'</span>';
  document.body.appendChild(bar);

  /* Show/hide on scroll */
  var imgSection=document.querySelector('.product-page_left');
  if(imgSection){
    window.addEventListener('scroll',function(){
      var rect=imgSection.getBoundingClientRect();
      bar.classList.toggle('hidden',rect.bottom<0);
    });
  }
}

/* ─── ACCORDION ─── */
function inject(){
  if(document.getElementById('os-pd-wrap'))return;

  var infoBlock=document.querySelector('.product-page_info-block');
  if(!infoBlock)return;

  var wrap=document.createElement('div');
  wrap.id='os-pd-wrap';

  if(isMobile){
    wrap.style.cssText='width:100%;padding:8px 0;background:transparent;box-sizing:border-box';
  }else{
    var ibWidth=window.getComputedStyle(infoBlock).width;
    wrap.style.cssText='width:'+ibWidth+';padding:16px 0;background:#efece9;position:absolute;left:10%;top:'+(infoBlock.offsetTop+infoBlock.offsetHeight)+'px;box-sizing:border-box';
  }

  var titleColor=isMobile?'#1a1a1a':'#666';
  var iconColor=isMobile?'#1a1a1a':'#666';
  var bodyColor=isMobile?'#666':'#999';

  SECTIONS.forEach(function(sec,idx){
    var row=document.createElement('div');
    row.style.cssText='border-bottom:1px solid '+(isMobile?'#ddd':'#ddd8d0')+';padding:0 '+(isMobile?'16':'30')+'px';

    var head=document.createElement('div');
    head.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer';

    var titleSpan=document.createElement('span');
    titleSpan.textContent=sec.title;
    titleSpan.style.cssText='font:500 9px/1 "Space Grotesk",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:'+titleColor;

    var plus=document.createElement('span');
    plus.textContent='+';
    plus.style.cssText='font:400 16px/1 "Space Grotesk",sans-serif;color:'+iconColor+';user-select:none';

    head.appendChild(titleSpan);
    head.appendChild(plus);

    var panel=document.createElement('div');
    panel.style.cssText='display:none;padding:0 0 18px';
    panel.innerHTML='<div style="font:400 11px/1.7 \'Space Grotesk\',sans-serif;color:'+bodyColor+';letter-spacing:.03em">'+sec.body+'</div>';

    allPanels.push({panel:panel,plus:plus,titleSpan:titleSpan});

    head.addEventListener('click',function(){
      var open=panel.style.display==='block';
      allPanels.forEach(function(item,i){
        if(i!==idx && item.panel.style.display==='block'){
          item.panel.style.display='none';
          item.plus.textContent='+';
          item.titleSpan.style.color=titleColor;
          item.plus.style.color=iconColor;
        }
      });
      panel.style.display=open?'none':'block';
      plus.textContent=open?'+':'\u2212';
      titleSpan.style.color=open?titleColor:'#1a1a1a';
      plus.style.color=open?iconColor:'#1a1a1a';
    });

    if(!isMobile){
      head.addEventListener('mouseenter',function(){titleSpan.style.color='#1a1a1a';plus.style.color='#1a1a1a'});
      head.addEventListener('mouseleave',function(){
        if(panel.style.display==='none'){titleSpan.style.color=titleColor;plus.style.color=iconColor}
      });
    }

    row.appendChild(head);
    row.appendChild(panel);
    wrap.appendChild(row);
  });

  if(isMobile){
    if(infoBlock.nextSibling)infoBlock.parentNode.insertBefore(wrap,infoBlock.nextSibling);
    else infoBlock.parentNode.appendChild(wrap);
  }else{
    infoBlock.parentNode.appendChild(wrap);
  }

  /* Create sticky bar after accordion is injected */
  createStickyBar();
}

function init(){setTimeout(inject,600)}
if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
