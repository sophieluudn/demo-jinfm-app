(() => {
  const phone=document.querySelector('.phone');
  const panel=document.querySelector('#topic-panel');
  const subscriptions=document.querySelector('#subscription-area');
  const nav=document.querySelector('.bottom-nav');
  let opener=null,background=[];
  function openTopic(index,trigger){
    const section=sections[index];if(!section)return;
    opener=trigger;
    background=[...document.querySelectorAll('.phone>header,#home-scroll,.bottom-nav,#library-panel,#subscription-area')].map(el=>[el,el.inert]);
    background.forEach(([el])=>el.inert=true);
    document.querySelector('#topic-title').textContent=section[0];
    document.querySelector('#topic-courses').innerHTML=section[3].map(c=>`<article class="category-course"><button class="category-cover" data-course="${c.img}" aria-label="查看${esc(c.title)}"><img src="assets/${c.img}.jpg" alt="${esc(c.title)}" loading="lazy"></button><div class="category-course-info"><h2><span class="tag ${c.video?'video':''}">${c.video?'影像':'聲音'}</span>${esc(c.title)}</h2><p class="category-author">${esc(c.author)}</p><p>${c.episodes}集</p><div class="category-course-actions"><span class="category-price">${c.price}點${c.old>c.price?`<del>${c.old}點</del>`:''}</span><button class="favorite" data-favorite="${c.img}" aria-label="收藏${esc(c.title)}" aria-pressed="${saved.has(c.img)}">${icon('heart',saved.has(c.img))}</button><button class="category-play" data-course="${c.img}" aria-label="試聽${esc(c.title)}">${icon('play-circle')}</button></div></div></article>`).join('');
    panel.hidden=false;phone.classList.add('topic-open');
    document.querySelector('#topic-courses').scrollTop=0;
    document.querySelector('#topic-back').focus({preventScroll:true});
  }
  function closeTopic(){panel.hidden=true;phone.classList.remove('topic-open');background.forEach(([el,inert])=>el.inert=inert);opener?.focus({preventScroll:true})}
  document.querySelector('#topic-back').onclick=closeTopic;
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden&&document.querySelector('#course-panel').hidden){event.preventDefault();event.stopImmediatePropagation();closeTopic()}},true);
  window.openTopicList=openTopic;
  function openSubscriptions(){
    document.querySelector('#library-panel').hidden=true;
    document.querySelector('#settings-panel').hidden=true;
    phone.classList.remove('library-open','settings-open','settings-subpage');phone.classList.add('subscription-area-open');
    document.querySelector('#home-scroll').inert=true;document.querySelector('.phone>header').inert=true;
    subscriptions.hidden=false;
    document.querySelector('#subscription-topics').innerHTML=sections.slice(0,3).map((s,index)=>`<button data-subscription-topic="${index}"><img src="assets/${s[3][0].img}.jpg" alt=""><span>${esc(s[0])}</span>${icon('caret-right')}</button>`).join('');
    nav.querySelectorAll('[data-nav]').forEach(button=>{const selected=button.dataset.nav==='訂閱';button.classList.toggle('selected',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});
    subscriptions.querySelector('h1').focus({preventScroll:true});
  }
  window.openSubscriptionArea=openSubscriptions;
  subscriptions.addEventListener('click',event=>{const button=event.target.closest('[data-subscription-topic]');if(button)openTopic(Number(button.dataset.subscriptionTopic),button)});
  nav.addEventListener('click',event=>{
    const button=event.target.closest('[data-nav]');if(!button||button.dataset.nav==='訂閱'||subscriptions.hidden)return;
    subscriptions.hidden=true;phone.classList.remove('subscription-area-open');
    if(button.dataset.nav==='首頁'){document.querySelector('#home-scroll').inert=false;document.querySelector('.phone>header').inert=false}
  });
  document.querySelectorAll('#sections .rail').forEach(rail=>{
    rail.querySelectorAll('img').forEach(img=>img.draggable=false);
    let drag=null,moved=false;
    rail.addEventListener('dragstart',event=>event.preventDefault());
    rail.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;moved=false;drag={id:event.pointerId,x:event.clientX,left:rail.scrollLeft}});
    rail.addEventListener('pointermove',event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const delta=event.clientX-drag.x;if(!moved&&Math.abs(delta)<6)return;
      moved=true;rail.classList.add('is-dragging');rail.setPointerCapture(event.pointerId);rail.scrollLeft=drag.left-delta;event.preventDefault();
    });
    const end=()=>{drag=null;rail.classList.remove('is-dragging')};
    rail.addEventListener('pointerup',end);rail.addEventListener('lostpointercapture',end);rail.addEventListener('pointercancel',()=>{end();moved=false});
    rail.addEventListener('click',event=>{if(moved){event.preventDefault();event.stopImmediatePropagation();moved=false}},true);
  });
})();
