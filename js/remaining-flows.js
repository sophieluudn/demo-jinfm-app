(() => {
  const phone=document.querySelector('.phone');
  const library=document.querySelector('#library-panel');
  const nav=document.querySelector('.bottom-nav');
  const checkout=document.querySelector('#checkout-panel');
  const coupons=document.querySelector('#coupon-panel');
  const gift=document.querySelector('#gift-dialog');
  const readState=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const couponDemo=new URLSearchParams(location.search).get('couponDemo')||'default';
  const couponStorageKey='jinfm-coupon-wallet-'+couponDemo;
  const makeDiscounts=count=>Array.from({length:count},(_,i)=>({id:'discount-'+i,amount:50,expires:i===0?'2026/12/05 16:33':'2027/01/01 16:55',used:false}));
  const seedWallet=couponDemo==='empty'?{self:[],gifts:[]}:couponDemo==='gift'?{self:makeDiscounts(13),gifts:[{id:'gift-1',title:'最有趣的歐美近代史',expires:'2027/10/21 15:03',used:true},{id:'gift-2',title:'頌缽音療 2 舒緩壓力',expires:'2027/10/15 16:29',used:false},{id:'gift-3',title:'最有趣的歐美近代史',expires:'2027/10/21 15:03',used:true}]}:{self:makeDiscounts(9),gifts:[]};
  let wallet=readState(couponStorageKey,seedWallet),couponTab='self',couponStandalone=false,couponGiftItem=null;
  const availableCoupons=()=>wallet.self.filter(c=>!c.used);
  const chosenCoupon=()=>availableCoupons().find(c=>c.id===selectedCoupon);
  const discountAmount=()=>coupon&&chosenCoupon()?Math.min(Number(course.price),chosenCoupon().amount):0;
  const persistCoupons=()=>localStorage.setItem(couponStorageKey,JSON.stringify(wallet));
  window.addEventListener('demo-topup-bonus',event=>{
    const amount=Number(event.detail.amount);if(!Number.isFinite(amount)||amount<=0)return;
    wallet.self.push({id:'topup-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),amount,expires:'示範期限未設定',used:false});
    persistCoupons();
  });
  let purchased=new Set(readState('jinfm-demo-purchases',['east-west']));
  let libraryMain='history',filter='purchased',course=null,coupon=false,selectedCoupon=null,fromGift=false;
  let origin,originFocus;
  function setNav(name){nav.querySelectorAll('[data-nav]').forEach(b=>{const yes=b.dataset.nav===name;b.classList.toggle('selected',yes);if(yes)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');const i=b.querySelector('i');if(['首頁','我聽','設定'].includes(b.dataset.nav))i.className=`${yes?'ph-fill':'ph'} ph-${{'首頁':'house','我聽':'headphones','設定':'user'}[b.dataset.nav]}`})}
  function openLibrary(section='history'){
    filter=section==='history'?'purchased':section;libraryMain=section==='history'?'history':'list';library.hidden=false;
    document.querySelector('#settings-panel').hidden=true;phone.classList.remove('settings-open','settings-subpage');phone.dataset.appearance='light';
    document.querySelector('#home-scroll').inert=true;document.querySelector('.phone>header').inert=true;phone.classList.add('library-open');setNav('我聽');renderLibrary();
  }
  function closeLibrary(){library.hidden=true;phone.classList.remove('library-open');document.querySelector('#home-scroll').inert=false;document.querySelector('.phone>header').inert=false;setNav('首頁')}
  function renderLibrary(){
    library.classList.toggle('library-guest',!window.accountDemo?.loggedIn);
    document.querySelectorAll('[data-library-main]').forEach(b=>b.setAttribute('aria-selected',b.dataset.libraryMain===libraryMain));
    document.querySelector('.library-filters').hidden=libraryMain==='history';
    document.querySelectorAll('[data-library-filter]').forEach(b=>b.classList.toggle('active',b.dataset.libraryFilter===filter));
    const content=document.querySelector('#library-content');content.classList.toggle('library-history',libraryMain==='history');
    const loginRequired=libraryMain==='list'&&!window.accountDemo?.loggedIn&&filter!=='subscribed';
    const subscriptionEmpty=libraryMain==='list'&&filter==='subscribed';
    content.classList.toggle('library-gated',loginRequired||subscriptionEmpty);
    if(loginRequired||subscriptionEmpty){
      content.innerHTML=subscriptionEmpty?'<div class="library-gate library-gate-subscription"><img src="assets/library-subscription-empty.png" alt="戴耳機的鯨魚與訂閱主題清單"><p>尚未收藏專區中任何主題喔</p><button id="library-subscription-open">前往訂閱專區</button></div>':'<div class="library-gate library-gate-login"><img src="assets/library-login-empty.png" alt="戴耳機的鯨魚從門口探出頭"><p>請您先登入！</p><button id="library-login-open">登入</button></div>';
      return;
    }
    let rows=libraryMain==='history'?readState('jinfm-demo-history',[]):filter==='favorites'?all.filter(c=>saved.has(c.img)):filter==='purchased'?all.filter(c=>purchased.has(c.img)):[];
    const toolbar=libraryMain==='history'&&rows.length?'<div class="library-history-toolbar"><button id="history-clear"><i class="ph ph-trash"></i>全部清除</button></div>':'';
    content.innerHTML=toolbar+(rows.length?rows.map(c=>`<article class="library-row"><button data-course="${c.img}" aria-label="查看${esc(c.title)}"><img src="assets/${c.img}.jpg" alt="${esc(c.title)}"></button><div><h2><span class="tag">${c.video?'影像':'聲音'}</span>${esc(c.episodeTitle||c.title)}</h2><p>${esc(libraryMain==='history'?c.title:c.author)}</p><p class="library-purchased">${libraryMain==='history'?(c.elapsed||'00:00')+' / '+(c.duration||'03:34'):filter==='purchased'?'已購買'+c.episodes+'集 / 共'+c.episodes+'集':c.episodes+'集'}</p>${filter==='favorites'&&libraryMain!=='history'?`<div class="result-bottom"><span class="price">${c.price}點</span><button class="favorite" data-favorite="${c.img}" aria-label="取消收藏${esc(c.title)}" aria-pressed="true">${icon('heart',true)}</button><button data-library-play="${c.img}" aria-label="試聽${esc(c.title)}">${icon('play-circle')}</button></div>`:''}</div></article>`).join(''):`<div class="library-empty"><img src="assets/${filter==='subscribed'?'downloads-empty.png':'search-empty.png'}" alt="空白聽單"><p>${libraryMain==='history'?'尚無閱聽紀錄':filter==='borrowed'?'尚未租借任何內容喔':filter==='subscribed'?'尚未訂閱任何內容喔':filter==='favorites'?'尚未收藏任何內容喔':'尚未購買任何內容喔'}</p><button id="library-browse">前往瀏覽內容</button></div>`);
  }
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(!b)return;if(b.dataset.nav==='我聽')openLibrary();else if(b.dataset.nav==='訂閱')window.openSubscriptionArea?.();else if(b.dataset.nav==='借聽')return;else if(!library.hidden){library.hidden=true;phone.classList.remove('library-open');if(b.dataset.nav==='首頁')closeLibrary()}});
  library.addEventListener('click',e=>{const main=e.target.closest('[data-library-main]');const tab=e.target.closest('[data-library-filter]');if(main){libraryMain=main.dataset.libraryMain;renderLibrary()}if(tab){filter=tab.dataset.libraryFilter;renderLibrary()}if(e.target.closest('#library-browse'))closeLibrary();if(e.target.closest('#history-clear')){localStorage.setItem('jinfm-demo-history','[]');renderLibrary()}});
  document.addEventListener('click',e=>{if(!library.hidden&&e.target.closest('[data-favorite]'))queueMicrotask(renderLibrary)});
  library.addEventListener('click',e=>{
    const login=e.target.closest('#library-login-open');
    if(login)window.dispatchEvent(new CustomEvent('open-library-login',{detail:{trigger:login}}));
    if(e.target.closest('#library-subscription-open'))window.openSubscriptionArea?.();
  });
  window.addEventListener('demo-account-changed',()=>{if(!library.hidden)renderLibrary()});
  function setFlow(open){phone.classList.toggle('flow-open',open);if(origin)origin.inert=open}
  function updateCheckout(){
    document.querySelector('#gift-result')?.remove();document.querySelector('#checkout-confirm').disabled=false;
    document.querySelector('#checkout-course').innerHTML=`<div class="checkout-course"><img src="assets/${course.img==='palace'?'course-palace':course.img}.jpg" alt="${esc(course.title)}"><div><h3>${esc(course.title)}</h3><p>${esc(course.author)}</p><span>共 ${course.episodes} 集</span></div></div>`;
    const discount=discountAmount();
    document.querySelector('#checkout-price').textContent=course.price+' 點';document.querySelector('#checkout-original').textContent=course.price+' 點';document.querySelector('#checkout-total').textContent=Math.max(0,course.price-discount);
    document.querySelector('#checkout-discount').hidden=!coupon;document.querySelector('#checkout-discount span').textContent='−'+discount+' 點';
    document.querySelector('#checkout-coupon-label').textContent=coupon?'折抵 '+discount+' 點':'請選擇';
    document.querySelector('#checkout-coupon-checkbox').checked=coupon;document.querySelector('#checkout-coupon-checkbox').disabled=!availableCoupons().length;
    document.querySelector('#checkout-confirm').textContent='立即兌換';
  }
  function openCheckout(c,isGift=false){course=c;coupon=false;selectedCoupon=null;fromGift=isGift;origin=document.querySelector('#course-panel');if(!isGift)originFocus=document.activeElement;checkout.hidden=false;setFlow(true);updateCheckout();document.querySelector('#checkout-close').focus({preventScroll:true})}
  function closeCheckout(){checkout.hidden=true;coupons.hidden=true;checkout.inert=false;setFlow(false);originFocus?.focus({preventScroll:true})}
  window.addEventListener('course-purchase',e=>openCheckout(e.detail.course));
  window.addEventListener('course-gift',e=>{couponGiftItem=null;document.querySelector('#gift-dialog p').textContent='將會使用您的點數兌換此內容給朋友領取使用。兌換期限為一年。';course=e.detail.course;origin=document.querySelector('#course-panel');originFocus=document.activeElement;gift.hidden=false;setFlow(true);document.querySelector('#gift-cancel').focus({preventScroll:true})});
  document.querySelector('#gift-cancel').onclick=()=>{gift.hidden=true;if(couponGiftItem){couponGiftItem=null;coupons.inert=false;return}setFlow(false);originFocus?.focus({preventScroll:true})};
  document.querySelector('#gift-confirm').onclick=()=>{gift.hidden=true;if(couponGiftItem){couponGiftItem.used=true;couponGiftItem.code='COUPON-DEMO-'+Date.now().toString(36).toUpperCase();persistCoupons();coupons.inert=false;origin=checkout.hidden?null:document.querySelector('#course-panel');setFlow(true);renderCoupons();toast('已建立示範贈送代碼：'+couponGiftItem.code);couponGiftItem=null}else openCheckout(course,true)};
  document.querySelector('#checkout-close').onclick=closeCheckout;
  function renderCoupons(){
    const self=availableCoupons();const items=couponTab==='self'?self:wallet.gifts;
    document.querySelector('.coupon-wallet-tabs').hidden=!(couponStandalone||wallet.gifts.length||!self.length);
    document.querySelector('#coupon-self-count').textContent=self.length;document.querySelector('#coupon-gift-count').textContent=wallet.gifts.length;
    document.querySelectorAll('[data-coupon-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.couponTab===couponTab));
    const summary=document.querySelector('.coupon-summary');summary.hidden=!items.length;summary.querySelector('span').textContent='共 '+items.length+' 張';summary.querySelector('small').hidden=couponStandalone||couponTab==='gift';
    document.querySelector('#coupon-list').innerHTML=!items.length?'<div class="coupon-empty">沒有符合的紅包</div>':couponTab==='self'?items.map(c=>`<button class="coupon-card ${selectedCoupon===c.id?'selected':''}" data-coupon="${c.id}" aria-pressed="${selectedCoupon===c.id}"><small>折價券</small><h3>內容兌換抵用</h3><p>（折抵紅包全部或部分點數；部分內容無法抵用）</p><time>兌換有效期限至 ${c.expires} (UTC+8)</time><footer>可折抵 <b>${c.amount}點</b></footer></button>`).join(''):items.map(c=>`<article class="coupon-card gift-card ${c.used?'used':''}">${c.used?'<span class="coupon-used-stamp" aria-hidden="true">USED</span>':''}<small>禮品券</small><h3>${esc(c.title)}</h3><time>兌換有效期限至 ${c.expires} (UTC+8)</time><footer>${c.used?'已使用':`<button data-coupon-gift="${c.id}">${icon('gift')}贈送朋友</button>`}</footer></article>`).join('');
  }
  function openCoupons(standalone=false){couponStandalone=standalone;couponTab=standalone&&couponDemo==='gift'?'gift':'self';coupons.hidden=false;if(!standalone)checkout.inert=true;else phone.classList.add('flow-open','coupon-wallet-open');renderCoupons();if(!standalone)document.querySelector('#coupon-back').focus({preventScroll:true})}
  document.querySelector('#checkout-coupon').onclick=()=>openCoupons();
  document.querySelector('#checkout-coupon-checkbox').onchange=e=>{
    if(!e.target.checked){coupon=false;updateCheckout()}
    else if(chosenCoupon()){coupon=true;updateCheckout()}
    else{e.target.checked=false;openCoupons()}
  };
  document.querySelectorAll('[data-coupon-tab]').forEach(b=>b.onclick=()=>{couponTab=b.dataset.couponTab;renderCoupons()});
  document.querySelector('#coupon-back').onclick=()=>{coupons.hidden=true;checkout.inert=false;if(couponStandalone){phone.classList.remove('flow-open','coupon-wallet-open')}else document.querySelector('#checkout-coupon').focus({preventScroll:true})};

  document.querySelector('#coupon-list').onclick=e=>{
    const b=e.target.closest('[data-coupon]');if(b){if(couponStandalone){toast('請在立即購買頁選擇紅包折抵');return}selectedCoupon=b.dataset.coupon;coupon=true;coupons.hidden=true;checkout.inert=false;updateCheckout();document.querySelector('#checkout-coupon').focus({preventScroll:true})}
    const send=e.target.closest('[data-coupon-gift]');if(send){couponGiftItem=wallet.gifts.find(c=>c.id===send.dataset.couponGift);if(!couponGiftItem||couponGiftItem.used)return;coupons.inert=true;gift.hidden=false;document.querySelector('#gift-title').textContent='贈送朋友';document.querySelector('#gift-dialog p').textContent='將建立「'+couponGiftItem.title+'」的示範贈送代碼。';document.querySelector('#gift-cancel').focus({preventScroll:true})}
  };
  window.addEventListener('open-coupon-wallet',()=>openCoupons(true));
  if(location.hash==='#coupons')openCoupons(true);
  document.querySelector('#checkout-confirm').onclick=()=>{
    if(coupon&&chosenCoupon()){chosenCoupon().used=true;persistCoupons()}
    if(fromGift){
      let result=document.querySelector('#gift-result');
      if(!result){result=document.createElement('div');result.id='gift-result';result.className='gift-result';document.querySelector('.checkout-body').append(result)}
      const code='GIFT-DEMO-'+Date.now().toString(36).toUpperCase();
      result.innerHTML=`<h3>示範贈送代碼已建立</h3><input aria-label="示範贈送代碼" readonly value="${code}"><p>此代碼僅供畫面示範，不具實際兌換效力。</p><button id="gift-copy">複製代碼</button>`;
      document.querySelector('#gift-copy').onclick=async()=>{try{await navigator.clipboard.writeText(code);toast('已複製示範贈送代碼')}catch{toast('請直接選取並複製代碼')}};
      result.scrollIntoView({block:'nearest'});document.querySelector('#checkout-confirm').disabled=true;
    }
    else{purchased.add(course.img);localStorage.setItem('jinfm-demo-purchases',JSON.stringify([...purchased]));window.dispatchEvent(new CustomEvent('demo-purchased',{detail:{id:course.img}}));closeCheckout();toast('模擬兌換成功，可在「我聽」查看')}
  };
  window.addEventListener('demo-playback-start',e=>{const c=e.detail;let history=readState('jinfm-demo-history',[]).filter(x=>x.img!==c.img||x.episodeTitle!==c.episodeTitle);history.unshift(c);localStorage.setItem('jinfm-demo-history',JSON.stringify(history.slice(0,30)))});
  document.addEventListener('keydown',e=>{if(!document.querySelector('#coupon-rules-overlay').hidden)return;if(e.key!=='Escape')return;if(!gift.hidden){e.stopImmediatePropagation();document.querySelector('#gift-cancel').click()}else if(!coupons.hidden){e.stopImmediatePropagation();document.querySelector('#coupon-back').click()}else if(!checkout.hidden){e.stopImmediatePropagation();closeCheckout()}},true);
})();
