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

  /* The junction: hovering a board lights it and dims the others; each board jumps to its project below */
  var J=document.querySelector('.junction');
  if(J&&canHover){
    var signs=[].slice.call(J.querySelectorAll('.sign')), hideT;
    function show(sign){clearTimeout(hideT);J.classList.add('engaged');signs.forEach(function(s){s.classList.toggle('active',s===sign);});}
    function hide(){hideT=setTimeout(function(){J.classList.remove('engaged');signs.forEach(function(s){s.classList.remove('active');});},80);}
    signs.forEach(function(s){
      s.addEventListener('mouseenter',function(){show(s);}); s.addEventListener('mouseleave',hide);
      s.addEventListener('focus',function(){show(s);}); s.addEventListener('blur',hide);
    });
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
