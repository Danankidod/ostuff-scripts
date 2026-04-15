/* ═══ OSTUFF BLOG — Fetch articles from Supabase ═══ */
(function(){
var SUPA_URL='https://zxhamviljbwzbepvlwaj.supabase.co';
var SUPA_KEY='sb_publishable_9rR3-q7Fon7IMNLEh5u48g_yV9jhSyX';
var SITE='https://www.ostuffcorp.com';

/* ═══ BLOG LIST PAGE ═══ */
function renderBlogList(){
  var target=document.getElementById('os-blog-list');
  if(!target)return;
  target.innerHTML='<p style="color:#999;font:400 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase">LOADING...</p>';
  fetch(SUPA_URL+'/rest/v1/articles?published=eq.true&order=created_at.desc&limit=20',{
    headers:{'apikey':SUPA_KEY}
  }).then(function(r){return r.json()}).then(function(articles){
    if(!articles.length){target.innerHTML='<p style="color:#999">No articles yet.</p>';return}
    var h='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:32px">';
    articles.forEach(function(a){
      var date=new Date(a.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
      h+='<a href="/post/'+a.slug+'" style="text-decoration:none;color:inherit" data-os-article="'+a.slug+'">';
      h+='<div style="border:1px solid #e0ddd8;overflow:hidden;transition:box-shadow .3s">';
      if(a.image_url)h+='<div style="aspect-ratio:16/9;overflow:hidden;background:#efece9"><img src="'+a.image_url+'" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>';
      else h+='<div style="aspect-ratio:16/9;background:#1a1a1a;display:flex;align-items:center;justify-content:center"><span style="font:600 14px/1 \'Space Grotesk\',sans-serif;letter-spacing:.2em;color:#333;text-transform:uppercase">OSTUFF</span></div>';
      h+='<div style="padding:20px">';
      h+='<p style="font:400 9px/1 \'Space Grotesk\',sans-serif;color:#a09b93;letter-spacing:.12em;text-transform:uppercase;margin:0 0 8px">'+date+'</p>';
      h+='<h3 style="font:600 12px/1.3 \'Space Grotesk\',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#1a1a1a;margin:0 0 10px">'+a.title+'</h3>';
      h+='<p style="font:400 11px/1.6 \'Space Grotesk\',sans-serif;color:#777;margin:0">'+a.excerpt+'</p>';
      h+='</div></div></a>';
    });
    h+='</div>';
    target.innerHTML=h;
    /* Schema for blog */
    var schema={'@context':'https://schema.org','@type':'Blog','name':'OSTUFF CORPORATION Blog','url':SITE+'/blog','publisher':{'@type':'Organization','name':'OSTUFF CORPORATION','url':SITE}};
    var s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(schema);document.head.appendChild(s);
  });
}

/* ═══ ARTICLE DETAIL ═══ */
function renderArticle(){
  var slug=location.pathname.replace('/post/','').replace('/','');
  if(!slug)return;
  var target=document.getElementById('os-article');
  if(!target){target=document.createElement('div');target.id='os-article';var main=document.querySelector('main')||document.body;main.appendChild(target)}
  fetch(SUPA_URL+'/rest/v1/articles?slug=eq.'+slug+'&limit=1',{
    headers:{'apikey':SUPA_KEY}
  }).then(function(r){return r.json()}).then(function(articles){
    if(!articles.length){target.innerHTML='<p>Article not found.</p>';return}
    var a=articles[0];
    var date=new Date(a.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    var h='<article style="max-width:680px;margin:100px auto 60px;padding:0 24px;font-family:\'Space Grotesk\',sans-serif">';
    h+='<p style="font:400 9px/1 \'Space Grotesk\',sans-serif;color:#a09b93;letter-spacing:.14em;text-transform:uppercase;margin:0 0 16px">'+date+' — '+a.author+'</p>';
    h+='<h1 style="font:600 20px/1.3 \'Space Grotesk\',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#1a1a1a;margin:0 0 24px">'+a.title+'</h1>';
    if(a.image_url)h+='<div style="margin:0 0 32px;aspect-ratio:16/9;overflow:hidden"><img src="'+a.image_url+'" style="width:100%;height:100%;object-fit:cover"></div>';
    h+='<div style="font:400 13px/1.9 \'Space Grotesk\',sans-serif;color:#333">'+a.content+'</div>';
    if(a.keywords&&a.keywords.length){
      h+='<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e0ddd8">';
      a.keywords.forEach(function(k){h+='<span style="display:inline-block;font:400 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#999;border:1px solid #ddd;padding:4px 10px;margin:0 6px 6px 0">'+k+'</span>'});
      h+='</div>';
    }
    h+='<a href="/blog" style="display:inline-block;margin-top:24px;font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09b93;text-decoration:none">← BACK TO ARTICLES</a>';
    h+='</article>';
    target.innerHTML=h;
    /* Article Schema */
    var schema={'@context':'https://schema.org','@type':'Article','headline':a.title,'datePublished':a.created_at,'author':{'@type':'Organization','name':a.author},'publisher':{'@type':'Organization','name':'OSTUFF CORPORATION','url':SITE},'url':location.href,'keywords':a.keywords?a.keywords.join(', '):''};
    var s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(schema);document.head.appendChild(s);
  });
}

/* ═══ INIT ═══ */
var path=location.pathname;
if(path==='/blog'||path==='/blog/')renderBlogList();
if(path.indexOf('/post/')===0)renderArticle();
})();
