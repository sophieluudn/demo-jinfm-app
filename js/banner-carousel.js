(() => {
  const hero=document.querySelector('.hero');
  const banners=window.homeBanners;
  const phone=document.querySelector('.phone');
  const main=document.querySelector('#home-scroll');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const interval=5000;
  let index=0,timer=null,paused=false,inView=true,interacting=false,touchActive=false,keyboardFocus=false,programmatic=false;
  banners.forEach(b=>{if(!all.some(c=>c.img===b.course.img))all.push(b.course)});
  hero.setAttribute('role','region');hero.setAttribute('aria-roledescription','輪播');hero.setAttribute('aria-label','精選課程 banner');
  hero.innerHTML=`<div id="banner-track" aria-live="off">${banners.map((b,i)=>`<button class="hero-course" data-course="${b.course.img}" aria-label="查看課程：${esc(b.course.title)}" tabindex="${i===0?0:-1}"><img src="${b.image}" alt="${esc(b.course.title)}" draggable="false" ${i===0?'fetchpriority="high"':''}></button>`).join('')}</div><div class="banner-controls"><div class="banner-dots" role="group" aria-label="選擇 banner">${banners.map((b,i)=>`<button data-banner-index="${i}" aria-label="第 ${i+1} 張：${esc(b.course.title)}" aria-pressed="${i===0}"><span></span></button>`).join('')}</div><button id="banner-autoplay" aria-label="暫停自動輪播" aria-pressed="false">${icon('pause')}</button></div>`;
  const track=hero.querySelector('#banner-track');
  const slides=[...track.querySelectorAll('.hero-course')];
  function update(){
    hero.querySelectorAll('[data-banner-index]').forEach((b,i)=>b.setAttribute('aria-pressed',i===index));
    slides.forEach((button,i)=>button.tabIndex=i===index?0:-1);
    hero.dataset.bannerIndex=index;
  }
  function canPlay(){return !paused&&!document.hidden&&inView&&!interacting&&!touchActive&&!keyboardFocus&&!main.inert&&!['searching','notifying','settings-open','library-open','borrow-open','course-open','topic-open','category-open','subscription-area-open'].some(name=>phone.classList.contains(name))}
  function schedule(reset=false){
    if(!canPlay()){clearTimeout(timer);timer=null;return}
    if(reset||timer===null){clearTimeout(timer);timer=setTimeout(()=>{timer=null;go((index+1)%banners.length)},interval)}
  }
  function go(next,animate=true){
    const wrap=index===banners.length-1&&next===0;
    index=next;programmatic=true;update();
    track.scrollTo({left:index*track.clientWidth,behavior:animate&&!wrap&&!reducedMotion.matches?'smooth':'instant'});
    schedule(true);
  }
  hero.querySelector('.banner-dots').addEventListener('click',event=>{const b=event.target.closest('[data-banner-index]');if(b)go(Number(b.dataset.bannerIndex))});
  const toggle=hero.querySelector('#banner-autoplay');
  toggle.onclick=()=>{paused=!paused;if(!paused)keyboardFocus=false;toggle.setAttribute('aria-pressed',paused);toggle.setAttribute('aria-label',paused?'開始自動輪播':'暫停自動輪播');toggle.innerHTML=icon(paused?'play':'pause');schedule(true)};
  track.addEventListener('scroll',()=>{const current=Math.max(0,Math.min(banners.length-1,Math.round(track.scrollLeft/track.clientWidth)));if(current!==index){index=current;update()}},{passive:true});
  track.addEventListener('scrollend',()=>{const manual=!programmatic;programmatic=false;if(manual)schedule(true)});
  let drag=null,dragged=false;
  track.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    interacting=true;programmatic=false;dragged=false;schedule();
    if(event.pointerType==='mouse')drag={id:event.pointerId,x:event.clientX,left:track.scrollLeft};
  });
  track.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const delta=event.clientX-drag.x;if(!dragged&&Math.abs(delta)<6)return;
    dragged=true;track.classList.add('dragging');track.setPointerCapture(event.pointerId);track.scrollLeft=drag.left-delta;event.preventDefault();
  });
  function finish(){drag=null;interacting=false;track.classList.remove('dragging');schedule(true)}
  track.addEventListener('pointerup',finish);track.addEventListener('pointercancel',finish);track.addEventListener('lostpointercapture',finish);
  track.addEventListener('click',event=>{if(dragged){event.preventDefault();event.stopImmediatePropagation();dragged=false}},true);
  track.addEventListener('dragstart',event=>event.preventDefault());
  track.addEventListener('touchstart',()=>{touchActive=true;schedule()},{passive:true});
  const finishTouch=()=>{touchActive=false;schedule(true)};
  track.addEventListener('touchend',finishTouch,{passive:true});track.addEventListener('touchcancel',finishTouch,{passive:true});
  hero.addEventListener('focusin',event=>{keyboardFocus=event.target.matches(':focus-visible');schedule()});
  hero.addEventListener('focusout',event=>{if(!hero.contains(event.relatedTarget)){keyboardFocus=false;schedule(true)}});
  document.addEventListener('visibilitychange',()=>schedule());
  new MutationObserver(()=>schedule()).observe(phone,{attributes:true,attributeFilter:['class']});
  new MutationObserver(()=>schedule()).observe(main,{attributes:true,attributeFilter:['inert']});
  new IntersectionObserver(entries=>{inView=entries[0].intersectionRatio>=.5;schedule()},{root:main,threshold:[0,.5,1]}).observe(hero);
  new ResizeObserver(()=>{track.scrollTo({left:index*track.clientWidth,behavior:'instant'})}).observe(track);
  update();schedule();
})();
