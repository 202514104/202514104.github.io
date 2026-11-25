/* Kinjal Dave · portfolio — small, dependency-free behaviour */
(function(){
  var doc=document.documentElement; doc.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover=window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Mobile menu */
  var btn=document.querySelector('.menu-btn'), menu=document.querySelector('.nav ul');
  if(btn&&menu){
    btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',String(o));btn.textContent=o?'Close':'Menu';});
    menu.addEventListener('click',function(e){if(e.target.closest('a')){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.textContent='Menu';}});
  }

  /* Gentle reveal on scroll */
  var rev=[].slice.call(document.querySelectorAll('.reveal'));
  if(!reduce&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    rev.forEach(function(el){io.observe(el);});
  } else rev.forEach(function(el){el.classList.add('in');});

  /* The junction: signpost navigation on the homepage */
  var J=document.querySelector('.junction');
  if(J){
    var signs=[].slice.call(J.querySelectorAll('.sign'));
    var hero=document.querySelector('.hero .wrap');
    var preview=document.querySelector('.preview');
    var line=document.querySelector('.route-line');
    var lit=J.querySelector('.lit');
    var post=J.querySelector('.post');
    var hideT;
    function place(sign){
      if(!preview||!line||window.innerWidth<=1024) return;
      var hr=hero.getBoundingClientRect(), sr=sign.getBoundingClientRect(), por=post.getBoundingClientRect();
      var ph=preview.offsetHeight, pw=preview.offsetWidth;
      var sy=sr.top+sr.height/2;                       /* board centre, viewport coords */
      var top=sy-ph/2, minTop=96, maxTop=window.innerHeight-ph-24;
      top=Math.max(minTop,Math.min(top,maxTop));       /* keep the whole card on screen */
      preview.style.top=(top-hr.top)+'px';
      preview.style.left=(por.left-hr.left-40-pw)+'px';
      var ly=Math.max(top+20,Math.min(sy,top+ph-20));  /* line meets the card and the post */
      line.style.top=(ly-hr.top-1)+'px'; line.style.left=(por.left-hr.left-40)+'px'; line.style.width='40px';
      lit.style.top='0px'; lit.style.height='0px';
    }
    function show(sign){
      clearTimeout(hideT);
      J.classList.add('engaged');
      signs.forEach(function(s){s.classList.toggle('active',s===sign);});
      if(preview){
        var tpl=document.getElementById('pv-'+sign.dataset.route);
        if(tpl){ preview.innerHTML=tpl.innerHTML; }
        preview.classList.add('show'); preview.setAttribute('aria-hidden','false');
        place(sign); line.classList.add('show'); lit.style.transform='scaleY(1)';
      }
    }
    function hide(){
      hideT=setTimeout(function(){
        J.classList.remove('engaged'); signs.forEach(function(s){s.classList.remove('active');});
        if(preview){preview.classList.remove('show');preview.setAttribute('aria-hidden','true');line.classList.remove('show');lit.style.transform='scaleY(0)';}
      },80);
    }
    if(canHover){
      signs.forEach(function(s){
        s.addEventListener('mouseenter',function(){show(s);});
        s.addEventListener('mouseleave',hide);
        s.addEventListener('focus',function(){show(s);});
        s.addEventListener('blur',hide);
      });
      window.addEventListener('resize',function(){var a=J.querySelector('.sign.active'); if(a) place(a);});
    } else {
      /* Touch: first tap opens the preview under the board, a second tap follows the route */
      signs.forEach(function(s){
        s.addEventListener('click',function(e){
          var tp=document.getElementById('tap-'+s.dataset.route);
          if(!tp) return;
          if(!tp.classList.contains('open')){
            e.preventDefault();
            document.querySelectorAll('.tap-preview.open').forEach(function(x){x.classList.remove('open');});
            signs.forEach(function(x){x.classList.remove('active');});
            tp.classList.add('open'); s.classList.add('active');
          }
        });
      });
    }
  }

  /* Case studies: the route rail marks "you are here" */
  var stops=[].slice.call(document.querySelectorAll('.stop[id]'));
  var items=[].slice.call(document.querySelectorAll('.rail li'));
  var bar=document.querySelector('.progress');
  if(stops.length){
    function update(){
      var mid=window.innerHeight*0.35, cur=-1;
      stops.forEach(function(s,i){ if(s.getBoundingClientRect().top<=mid) cur=i; });
      items.forEach(function(li,i){
        li.classList.toggle('passed',i<cur); li.classList.toggle('current',i===cur);
        var a=li.querySelector('a'); if(a){ if(i===cur) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }
      });
      if(bar){var h=document.documentElement; bar.style.transform='scaleX('+(h.scrollTop/((h.scrollHeight-h.clientHeight)||1))+')';}
    }
    var ticking=false;
    window.addEventListener('scroll',function(){ if(!ticking){ticking=true; requestAnimationFrame(function(){update();ticking=false;});} },{passive:true});
    window.addEventListener('resize',update); update();
  }
})();
