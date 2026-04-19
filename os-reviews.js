/* ═══ OSTUFF REVIEWS — Display + Submit + Google Schema ═══ */
(function(){

function esc(s){if(!s)return'';var d=document.createElement('div');d.textContent=s;return d.innerHTML}

function getSlug(){
  var m=location.pathname.match(/\/product\/([^\/]+)/);
  return m?m[1]:null;
}

function stars(n){
  var h='';
  for(var i=1;i<=5;i++)h+='<span style="color:'+(i<=n?'#a09b93':'#333')+'">&#9733;</span>';
  return h;
}

function injectSchema(slug,reviews){
  if(!reviews.length)return;
  var avg=0;reviews.forEach(function(r){avg+=r.rating});avg=(avg/reviews.length).toFixed(1);
  var name=document.querySelector('[class*="product_name"]');
  var price=document.querySelector('[class*="product_price"]');
  var img=document.querySelector('.product_image-wrapper img, [class*="product-image"]');
  var schema={
    '@context':'https://schema.org',
    '@type':'Product',
    'name':name?name.textContent.trim():'OSTUFF Product',
    'brand':{'@type':'Brand','name':'OSTUFF CORPORATION'},
    'url':location.href,
    'aggregateRating':{'@type':'AggregateRating','ratingValue':avg,'reviewCount':reviews.length,'bestRating':'5','worstRating':'1'}
  };
  if(price)schema.offers={'@type':'Offer','price':price.textContent.replace(/[^0-9.,]/g,'').trim(),'priceCurrency':'EUR','availability':'https://schema.org/InStock','url':location.href};
  if(img)schema.image=img.src;
  schema.review=reviews.slice(0,5).map(function(r){return{'@type':'Review','author':{'@type':'Person','name':esc(r.author_name)},'datePublished':r.created_at.split('T')[0],'reviewRating':{'@type':'Rating','ratingValue':r.rating},'reviewBody':esc(r.content)}});
  var s=document.createElement('script');
  s.type='application/ld+json';
  s.textContent=JSON.stringify(schema);
  document.head.appendChild(s);
}

function loadReviews(slug){
  if(!window.osAuth)return;
  window.osAuth.initSupabase().then(function(c){
  c.from('reviews').select('*').eq('product_slug',slug).order('created_at',{ascending:false}).limit(20).then(function(r){
    var reviews=r.data||[];
    injectSchema(slug,reviews);
    renderReviews(reviews,slug);
  });
  });
}

function renderReviews(reviews,slug){
  if(document.getElementById('os-reviews'))return;
  /* Insert after the product section, before related products — full width */
  var target=document.querySelector('.section_product-page_')||document.querySelector('[class*="section_product"]');
  if(!target)target=document.querySelector('main')||document.body;
  var wrap=document.createElement('div');
  wrap.id='os-reviews';
  wrap.style.cssText='max-width:700px;margin:0 auto;padding:40px 24px;font-family:"Space Grotesk",sans-serif';
  var avg=0;if(reviews.length)reviews.forEach(function(r){avg+=r.rating});
  if(reviews.length)avg=(avg/reviews.length).toFixed(1);
  var h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;border-top:1px solid #e0ddd8;padding-top:24px">';
  h+='<div><span style="font:600 11px/1 \'Space Grotesk\',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#1a1a1a">REVIEWS</span>';
  if(reviews.length)h+=' <span style="font:400 10px/1 \'Space Grotesk\',sans-serif;color:#999;letter-spacing:.1em">'+avg+' '+stars(Math.round(avg))+' ('+reviews.length+')</span>';
  h+='</div>';
  h+='<button id="os-review-toggle" style="background:none;border:1px solid #ddd;padding:6px 14px;font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;color:#999;transition:all .2s">WRITE A REVIEW</button>';
  h+='</div>';
  h+='<div id="os-review-form" style="display:none;margin-bottom:32px;padding:20px;border:1px solid #e0ddd8">';
  h+='<div style="margin-bottom:12px"><span style="font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#999">RATING</span><br>';
  h+='<div id="os-review-stars" style="font-size:24px;cursor:pointer;margin-top:8px" data-rating="5">';
  for(var i=1;i<=5;i++)h+='<span data-star="'+i+'" style="color:#a09b93">&#9733;</span>';
  h+='</div></div>';
  h+='<input id="os-review-name" placeholder="YOUR NAME" style="width:100%;padding:10px 0;border:0;border-bottom:1px solid #ddd;font:400 11px/1.4 \'Space Grotesk\',sans-serif;letter-spacing:.06em;background:transparent;outline:0;margin-bottom:12px">';
  h+='<textarea id="os-review-content" placeholder="YOUR REVIEW" rows="3" style="width:100%;padding:10px 0;border:0;border-bottom:1px solid #ddd;font:400 11px/1.4 \'Space Grotesk\',sans-serif;letter-spacing:.06em;background:transparent;outline:0;resize:none;margin-bottom:16px"></textarea>';
  h+='<button id="os-review-submit" style="background:#1a1a1a;color:#efece9;border:0;padding:12px 24px;font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:background .2s">SUBMIT</button>';
  h+='<p id="os-review-msg" style="font:400 9px/1.4 \'Space Grotesk\',sans-serif;color:#999;margin-top:8px"></p>';
  h+='</div>';
  if(reviews.length===0){
    h+='<p style="color:#999;font:400 10px/1.6 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase;text-align:center;padding:20px 0">No reviews yet. Be the first!</p>';
  }else{
    reviews.forEach(function(r){
      h+='<div style="padding:16px 0;border-bottom:1px solid #f0ede9">';
      h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
      h+='<span style="font:500 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#1a1a1a">'+esc(r.author_name)+'</span>';
      h+='<span style="font:400 9px/1 \'Space Grotesk\',sans-serif;color:#ccc">'+esc(r.created_at.split('T')[0])+'</span>';
      h+='</div>';
      h+='<div style="margin-bottom:8px">'+stars(r.rating)+'</div>';
      h+='<p style="font:400 11px/1.6 \'Space Grotesk\',sans-serif;color:#555;margin:0">'+esc(r.content)+'</p>';
      if(r.verified_purchase)h+='<span style="font:500 8px/1 \'Space Grotesk\',sans-serif;color:#a09b93;letter-spacing:.12em;text-transform:uppercase;margin-top:6px;display:inline-block">VERIFIED PURCHASE</span>';
      h+='</div>';
    });
  }
  wrap.innerHTML=h;
  /* Insert after the product page section, as a sibling — full width block */
  if(target.nextSibling)target.parentNode.insertBefore(wrap,target.nextSibling);
  else target.parentNode.appendChild(wrap);
  document.getElementById('os-review-toggle').addEventListener('click',function(){
    var f=document.getElementById('os-review-form');
    f.style.display=f.style.display==='none'?'block':'none';
  });
  var starsEl=document.getElementById('os-review-stars');
  if(starsEl){
    starsEl.querySelectorAll('span').forEach(function(s){
      s.addEventListener('click',function(){
        var val=parseInt(this.getAttribute('data-star'));
        starsEl.setAttribute('data-rating',val);
        starsEl.querySelectorAll('span').forEach(function(sp){
          sp.style.color=parseInt(sp.getAttribute('data-star'))<=val?'#a09b93':'#333';
        });
      });
      s.addEventListener('mouseenter',function(){
        var val=parseInt(this.getAttribute('data-star'));
        starsEl.querySelectorAll('span').forEach(function(sp){
          sp.style.color=parseInt(sp.getAttribute('data-star'))<=val?'#a09b93':'#333';
        });
      });
    });
  }
  document.getElementById('os-review-submit').addEventListener('click',function(){
    if(!window.osAuth){document.getElementById('os-review-msg').textContent='Please log in first';return}
    window.osAuth.getUser().then(function(user){
      if(!user){window.location='/log-in';return}
      var rating=parseInt(starsEl.getAttribute('data-rating'))||5;
      var name=document.getElementById('os-review-name').value.trim();
      var content=document.getElementById('os-review-content').value.trim();
      if(!name||!content){document.getElementById('os-review-msg').textContent='Please fill all fields';return}
      window.osAuth.initSupabase().then(function(c){
        c.from('reviews').insert({user_id:user.id,product_slug:slug,rating:rating,author_name:name,content:content}).then(function(r){
          if(!r.error){document.getElementById('os-review-msg').textContent='Review submitted! Thank you.';setTimeout(function(){location.reload()},1500)}
          else{document.getElementById('os-review-msg').textContent='Error submitting review. Please try again.'}
        });
      });
    });
  });
}

function init(){
  if(window._osReviewsLoaded)return;
  window._osReviewsLoaded=true;
  var slug=getSlug();
  if(!slug)return;
  setTimeout(function(){loadReviews(slug)},500);
}

if(document.readyState==='complete')init();
else window.addEventListener('load',init);
})();
