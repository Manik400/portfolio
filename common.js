/* manik.dev — shared runtime for every UI.
 *
 *  MG.uis        the list of page designs and where they live
 *  MG.lang(...)  language detection + apply, for pages that don't run their own
 *                engine (index.html does; the alternate UIs call this)
 *  UI picker     the fixed "UI" button + overlay, injected on every page
 *
 * Pages declare  <html data-ui="terminal" data-root="../">  — data-root is the
 * path back to the repo root ("" for index.html, "../" inside ui/).
 */
(function(){
  var root=document.documentElement;
  var base=root.getAttribute('data-root')||'';
  var current=root.getAttribute('data-ui')||'throughput';

  var UIS=[
    {id:'throughput',file:'index.html',name:'Throughput',tag:'Brutalist cockpit · console, deltas, system map',cls:'t-throughput'},
    {id:'terminal',file:'ui/terminal.html',name:'Terminal',tag:'A shell — type or click commands to read the profile',cls:'t-terminal'},
    {id:'editorial',file:'ui/editorial.html',name:'Editorial',tag:'Long-form magazine profile with a table of contents',cls:'t-editorial'},
    {id:'dossier',file:'ui/dossier.html',name:'Dossier',tag:'Typed case file — stamps, paperclips, margin notes',cls:'t-dossier'},
    {id:'newspaper',file:'ui/newspaper.html',name:'Newspaper',tag:'Broadsheet front page — columns, headlines, classifieds',cls:'t-newspaper'},
    {id:'transit',file:'ui/transit.html',name:'Transit',tag:'Metro map — career, stack and projects as lines and stations',cls:'t-transit'},
    {id:'paper',file:'ui/paper.html',name:'Paper',tag:'Two-column academic paper — abstract, tables, references',cls:'t-paper'},
    {id:'passport',file:'ui/passport.html',name:'Passport',tag:'Data page, MRZ and visa stamps for every target country',cls:'t-passport'},
    {id:'desktop',file:'ui/desktop.html',name:'Desktop',tag:'A retro OS — icons, draggable windows, taskbar',cls:'t-desktop'}
  ];
  window.MG=window.MG||{}; MG.uis=UIS; MG.current=current;

  // remembered choice: index.html forwards to it unless the visitor asked to stay
  try{
    var q=new URLSearchParams(location.search);
    if(q.get('ui')){ localStorage.setItem('mg-ui',q.get('ui')); }
    var want=localStorage.getItem('mg-ui');
    if(want&&want!==current&&!q.get('stay')){
      var u=UIS.filter(function(x){return x.id===want;})[0];
      if(u&&current==='throughput'){ location.replace(base+u.file+(location.search||'')+location.hash); return; }
    }
  }catch(e){}

  /* ---------- language (for the alternate UIs) ---------- */
  MG.lang=function(){
    var I18N=window.MG_I18N||{strings:{},tz:{}};
    var nodes=[].slice.call(document.querySelectorAll('[data-i18n]'));
    nodes.forEach(function(el){ el._en=el.innerHTML; });
    var attrs=[].slice.call(document.querySelectorAll('[data-i18n-attr]'));
    attrs.forEach(function(el){ var p=el.getAttribute('data-i18n-attr').split(':'); el._attr=p[0]; el._key=p[1]; el._en=el.getAttribute(p[0]); });
    var enTitle=document.title, sel=document.getElementById('lang'), cur=document.getElementById('lang-cur');
    function has(c){ return c==='en'||!!I18N.strings[c]; }
    function detect(){
      var q=null; try{ q=new URLSearchParams(location.search).get('lang'); }catch(e){}
      if(q&&has(q)) return q;
      try{ var s=localStorage.getItem('mg-lang'); if(s&&has(s)) return s; }catch(e){}
      try{ var tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
        for(var k in I18N.tz) if(tz===k||(k.slice(-1)==='/'&&tz.indexOf(k)===0)) return I18N.tz[k]; }catch(e){}
      var ls=navigator.languages||[navigator.language||''];
      for(var i=0;i<ls.length;i++){ var c=String(ls[i]).slice(0,2).toLowerCase(); if(has(c)) return c; }
      return 'en';
    }
    function apply(code){
      var d=code==='en'?{}:(I18N.strings[code]||{});
      nodes.forEach(function(el){ var v=d[el.getAttribute('data-i18n')]; el.innerHTML=v!=null?v:el._en; });
      attrs.forEach(function(el){ var v=d[el._key]; el.setAttribute(el._attr,v!=null?v:el._en); });
      root.setAttribute('lang',code);
      if(sel) sel.value=code; if(cur) cur.textContent=code.toUpperCase();
      document.dispatchEvent(new CustomEvent('mg:lang',{detail:{code:code,dict:d}}));
    }
    var code=detect(); apply(code);
    if(sel) sel.addEventListener('change',function(){ apply(sel.value); try{ localStorage.setItem('mg-lang',sel.value); }catch(e){} });
    return code;
  };
  MG.langOptions='<option value="en">English · International</option><option value="de">Deutsch · Deutschland</option><option value="nl">Nederlands · Nederland</option><option value="fi">Suomi · Suomi</option><option value="es">Español · España</option><option value="ja">日本語 · 日本</option><option value="th">ไทย · ประเทศไทย</option>';

  /* ---------- theme helper ---------- */
  MG.theme=function(btn){
    try{ var s=localStorage.getItem('mg-theme'); if(s) root.setAttribute('data-theme',s); }catch(e){}
    if(!btn) return;
    btn.addEventListener('click',function(){
      var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
      var next=dark?'light':'dark'; root.setAttribute('data-theme',next);
      try{ localStorage.setItem('mg-theme',next); }catch(e){}
    });
  };

  /* ---------- UI picker ---------- */
  var css=
  '.mgui-btn{position:fixed;right:16px;bottom:16px;z-index:90;font:700 12px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;'+
  'background:#11151A;color:#F5F6F2;border:2px solid #F5F6F2;box-shadow:0 8px 24px rgba(0,0,0,.35);padding:11px 14px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;border-radius:999px}'+
  '.mgui-btn:hover{transform:translateY(-1px)} .mgui-btn i{display:inline-block;width:14px;height:10px;border:2px solid currentColor;border-top-width:4px;border-radius:2px}'+
  '.mgui{position:fixed;inset:0;z-index:100;background:rgba(9,11,14,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px}'+
  '.mgui[hidden]{display:none}'+
  '.mgui-box{width:min(1040px,100%);max-height:92vh;overflow:auto;background:#F5F6F2;color:#11151A;border-radius:16px;padding:22px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}'+
  '.mgui-head{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:16px}'+
  '.mgui-head h2{margin:0;font-size:22px;letter-spacing:-.01em} .mgui-head p{margin:0;color:#4E575F;font-size:13px}'+
  '.mgui-x{margin-left:auto;border:0;background:#11151A;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:16px}'+
  '.mgui-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}'+
  '.mgui-card{display:block;text-decoration:none;color:inherit;border:2px solid #D8DAD2;border-radius:12px;overflow:hidden;background:#fff;transition:transform .12s,border-color .12s}'+
  '.mgui-card:hover{transform:translateY(-2px);border-color:#11151A} .mgui-card.on{border-color:#EE3D28;box-shadow:0 0 0 3px rgba(238,61,40,.25)}'+
  '.mgui-card .th{height:118px;position:relative;overflow:hidden;border-bottom:2px solid #D8DAD2}'+
  '.mgui-card .nm{padding:10px 12px 2px;font-weight:700;font-size:14px;display:flex;justify-content:space-between;align-items:center}'+
  '.mgui-card .nm span{font:700 10px ui-monospace,monospace;color:#EE3D28;letter-spacing:.1em}'+
  '.mgui-card .tg{padding:0 12px 12px;font-size:12px;color:#4E575F;line-height:1.4}'+
  /* thumbnails: tiny abstract renderings of each layout */
  '.th i{position:absolute;display:block}'+
  '.t-throughput{background:#0D1114}.t-throughput i:nth-child(1){left:8%;top:14%;width:40%;height:52%;background:#151A1F;border:2px solid #ECEEE9}.t-throughput i:nth-child(2){left:8%;top:14%;width:40%;height:9px;background:#EE3D28}.t-throughput i:nth-child(3){right:8%;top:20%;width:36%;height:14px;background:#ECEEE9}.t-throughput i:nth-child(4){right:8%;top:40%;width:26%;height:14px;border:2px solid #ECEEE9}.t-throughput i:nth-child(5){left:0;bottom:0;width:100%;height:14px;background:#FFB400}'+
  '.t-terminal{background:#050807}.t-terminal i{height:5px;background:#33FF7A;left:8%}.t-terminal i:nth-child(1){top:16%;width:30%}.t-terminal i:nth-child(2){top:30%;width:60%;background:#C8F5D0}.t-terminal i:nth-child(3){top:40%;width:50%;background:#C8F5D0}.t-terminal i:nth-child(4){top:58%;width:24%}.t-terminal i:nth-child(5){top:72%;width:70%;background:#C8F5D0}.t-terminal i:nth-child(6){top:86%;width:8px;background:#33FF7A}'+
  '.t-editorial{background:#F4EFE6}.t-editorial i{background:#1F1B16;left:14%}.t-editorial i:nth-child(1){top:14%;width:56%;height:16px}.t-editorial i:nth-child(2){top:38%;width:2px;height:50%;left:10%}.t-editorial i:nth-child(3){top:40%;width:60%;height:3px;opacity:.5}.t-editorial i:nth-child(4){top:50%;width:64%;height:3px;opacity:.5}.t-editorial i:nth-child(5){top:60%;width:52%;height:3px;opacity:.5}.t-editorial i:nth-child(6){top:70%;width:60%;height:3px;opacity:.5}.t-editorial i:nth-child(7){right:6%;top:14%;width:14%;height:70%;background:#B23A2E;left:auto}'+
  '.t-dossier{background:#EFE6D0}.t-dossier i{background:#3B3127;height:3px;left:16%}.t-dossier i:nth-child(1){top:22%;width:40%;height:6px}.t-dossier i:nth-child(2){top:40%;width:60%}.t-dossier i:nth-child(3){top:50%;width:56%}.t-dossier i:nth-child(4){top:60%;width:62%}.t-dossier i:nth-child(5){top:70%;width:44%}.t-dossier i:nth-child(6){right:10%;top:14%;width:30%;height:26px;background:transparent;border:2px double #B3261E;transform:rotate(-12deg);left:auto}'+
  '.t-newspaper{background:#F5F1E8}.t-newspaper i{background:#111}.t-newspaper i:nth-child(1){left:10%;top:8%;width:80%;height:12px}.t-newspaper i:nth-child(2){left:10%;top:28%;width:80%;height:2px}.t-newspaper i:nth-child(3){left:10%;top:36%;width:24%;height:50%;opacity:.35}.t-newspaper i:nth-child(4){left:38%;top:36%;width:24%;height:50%;opacity:.35}.t-newspaper i:nth-child(5){left:66%;top:36%;width:24%;height:50%;opacity:.35}'+
  '.t-transit{background:#fff}.t-transit i{height:6px;border-radius:3px}.t-transit i:nth-child(1){left:6%;top:30%;width:88%;background:#E3001B}.t-transit i:nth-child(2){left:6%;top:50%;width:70%;background:#0064B0}.t-transit i:nth-child(3){left:30%;top:70%;width:64%;background:#00A651}.t-transit i:nth-child(4){left:40%;top:27%;width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid #000}.t-transit i:nth-child(5){left:60%;top:47%;width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid #000}'+
  '.t-paper{background:#fff}.t-paper i{background:#222;height:2px}.t-paper i:nth-child(1){left:20%;top:12%;width:60%;height:8px}.t-paper i:nth-child(2){left:8%;top:34%;width:40%}.t-paper i:nth-child(3){left:8%;top:44%;width:40%}.t-paper i:nth-child(4){left:8%;top:54%;width:40%}.t-paper i:nth-child(5){left:52%;top:34%;width:40%}.t-paper i:nth-child(6){left:52%;top:44%;width:40%}.t-paper i:nth-child(7){left:52%;top:54%;width:40%}'+
  '.t-passport{background:#1B2A4A}.t-passport i:nth-child(1){left:18%;top:10%;width:64%;height:80%;background:#F3EBDD;border-radius:4px}.t-passport i:nth-child(2){left:24%;top:18%;width:20%;height:30%;background:#C8C0B0}.t-passport i:nth-child(3){left:50%;top:22%;width:24%;height:24px;border:2px solid #B3261E;border-radius:50%;transform:rotate(-14deg)}.t-passport i:nth-child(4){left:24%;top:70%;width:52%;height:3px;background:#333}.t-passport i:nth-child(5){left:24%;top:78%;width:52%;height:3px;background:#333}'+
  '.t-desktop{background:#008080}.t-desktop i:nth-child(1){left:8%;top:10%;width:14px;height:14px;background:#FFD;border:1px solid #333}.t-desktop i:nth-child(2){left:8%;top:34%;width:14px;height:14px;background:#FFD;border:1px solid #333}.t-desktop i:nth-child(3){left:30%;top:22%;width:56%;height:52%;background:#C0C0C0;border:2px solid #fff;border-right-color:#555;border-bottom-color:#555}.t-desktop i:nth-child(4){left:31%;top:24%;width:53%;height:10px;background:#000080}.t-desktop i:nth-child(5){left:0;bottom:0;width:100%;height:14px;background:#C0C0C0;border-top:2px solid #fff}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  var btn=document.createElement('button'); btn.type='button'; btn.className='mgui-btn'; btn.setAttribute('aria-haspopup','dialog');
  btn.innerHTML='<i></i> UI · '+(UIS.filter(function(x){return x.id===current;})[0]||UIS[0]).name.toUpperCase()+' ▾';
  var ov=document.createElement('div'); ov.className='mgui'; ov.hidden=true; ov.setAttribute('role','dialog'); ov.setAttribute('aria-label','Choose a UI');
  var h='<div class="mgui-box"><div class="mgui-head"><h2>Same engineer, nine interfaces.</h2><p>Pick how you want to read this. Content and languages are identical; the choice is remembered. Or skip the reading: <a href="'+base+'demo.html" style="color:#EE3D28;font-weight:700">▶ run the live demo</a> of three engineering problems.</p><button type="button" class="mgui-x" aria-label="Close">✕</button></div><div class="mgui-grid">';
  UIS.forEach(function(u){
    var dots=''; for(var i=0;i<7;i++) dots+='<i></i>';
    h+='<a class="mgui-card'+(u.id===current?' on':'')+'" href="'+base+u.file+'?ui='+u.id+'" data-ui="'+u.id+'"><div class="th '+u.cls+'">'+dots+'</div><div class="nm">'+u.name+(u.id===current?'<span>CURRENT</span>':'')+'</div><div class="tg">'+u.tag+'</div></a>';
  });
  h+='</div></div>'; ov.innerHTML=h;
  document.addEventListener('DOMContentLoaded',function(){ document.body.appendChild(btn); document.body.appendChild(ov); });
  function open(o){ ov.hidden=!o; }
  btn.addEventListener('click',function(){ open(true); });
  ov.addEventListener('click',function(e){
    if(e.target===ov||e.target.closest('.mgui-x')){ open(false); return; }
    var a=e.target.closest('.mgui-card'); if(a){ try{ localStorage.setItem('mg-ui',a.dataset.ui); }catch(e2){} }
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') open(false); });
})();
