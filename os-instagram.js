/* ═══ OSTUFF INSTAGRAM FEED ═══ */
(function(){
var IG_USER='ostufff';

function createFeed(){
  var target=document.getElementById('os-ig-feed');
  if(!target)return;

  var h='<div style="margin:60px 0 0;font-family:\'Space Grotesk\',sans-serif">';
  h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #1a1a1a">';
  h+='<div style="display:flex;align-items:center;gap:12px">';
  h+='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a09b93" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#a09b93"/></svg>';
  h+='<span style="font:600 10px/1 \'Space Grotesk\',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#fff">@'+IG_USER+'</span>';
  h+='</div>';
  h+='<a href="https://instagram.com/'+IG_USER+'" target="_blank" rel="noopener" style="font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#555;text-decoration:none;border:1px solid #333;padding:6px 14px;transition:all .2s">FOLLOW</a>';
  h+='</div>';

  /* Instagram embed grid — uses official embeds */
  h+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px" id="os-ig-grid">';
  h+='<div style="aspect-ratio:1/1;background:#1a1a1a;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="window.open(\'https://instagram.com/'+IG_USER+'\',\'_blank\')">';
  h+='<div style="text-align:center"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#333" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#333"/></svg>';
  h+='<p style="font:500 8px/1 \'Space Grotesk\',sans-serif;letter-spacing:.12em;color:#333;text-transform:uppercase;margin:10px 0 0">VIEW ON<br>INSTAGRAM</p></div>';
  h+='</div>';
  h+='</div>';

  /* Elfsight-free approach: embed latest posts via blockquote */
  h+='<div style="margin-top:20px;text-align:center">';
  h+='<a href="https://instagram.com/'+IG_USER+'" target="_blank" rel="noopener" style="font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09b93;text-decoration:none;transition:color .2s">VIEW ALL POSTS ON INSTAGRAM →</a>';
  h+='</div>';

  h+='</div>';
  target.innerHTML=h;

  /* Try to load Instagram oEmbed for recent posts */
  loadIGPosts();
}

function loadIGPosts(){
  var grid=document.getElementById('os-ig-grid');
  if(!grid)return;
  /* Use Instagram oEmbed API (no token needed for public posts) */
  var igUrl='https://www.instagram.com/'+IG_USER+'/';
  fetch('https://graph.facebook.com/v18.0/instagram_oembed?url='+encodeURIComponent(igUrl)+'&omit_script=true',{mode:'no-cors'}).catch(function(){
    /* Fallback: show placeholder grid */
    var placeholders='';
    for(var i=0;i<3;i++){
      placeholders+='<a href="https://instagram.com/'+IG_USER+'" target="_blank" rel="noopener" style="aspect-ratio:1/1;background:#111;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s">';
      placeholders+='<span style="font:500 9px/1 \'Space Grotesk\',sans-serif;letter-spacing:.12em;color:#333;text-transform:uppercase">OSTUFF</span>';
      placeholders+='</a>';
    }
    grid.innerHTML+=placeholders;
  });
}

/* ═══ INIT ═══ */
if(document.readyState==='complete')createFeed();
else window.addEventListener('load',createFeed);
})();
