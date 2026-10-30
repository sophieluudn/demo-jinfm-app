(() => {
  const phone=document.querySelector('.phone');
  const panel=document.querySelector('#settings-panel');
  const pages=[...panel.querySelectorAll('[data-settings-page]')];
  const main=document.querySelector('#home-scroll');
  const homeHeader=document.querySelector('.phone>header');
  const nav=document.querySelector('.bottom-nav');
  let active='main',entry;
  let libraryLoginOrigin=false;
  function returnToLibrary(){
    libraryLoginOrigin=false;panel.hidden=true;
    phone.classList.remove('settings-open','settings-subpage');phone.classList.add('library-open');
    phone.dataset.appearance='light';document.querySelector('#library-panel').hidden=false;
    main.inert=true;homeHeader.inert=true;nav.inert=false;selectNav('我聽');
    window.dispatchEvent(new Event('demo-account-changed'));
    document.querySelector('#library-login-open')?.focus({preventScroll:true});
  }
  const pageOpeners=new Map();
  const offlineArea=panel.querySelector('#download-empty');
  const offlineEmptyMarkup=offlineArea.innerHTML;
  function refreshDownloads(){
    let keys=[];try{keys=JSON.parse(localStorage.getItem('jinfm-demo-downloads')||'[]')}catch{}
    const purchased=panel.querySelector('#download-purchased').getAttribute('aria-selected')==='true';
    const grouped=new Map();keys.forEach(key=>{const id=key.split(':')[0];grouped.set(id,(grouped.get(id)||0)+1)});
    const borrowed=panel.querySelector('#download-borrowed').getAttribute('aria-selected')==='true';
    const rows=[...grouped].filter(([id])=>borrowed?id.startsWith('borrow/'):purchased&&!id.startsWith('borrow/')).map(([id,count])=>({course:all.find(c=>c.img===id),count})).filter(x=>x.course);
    offlineArea.classList.toggle('has-downloads',rows.length>0);
    offlineArea.innerHTML=rows.length?rows.map(({course:c,count})=>`<article class="library-row"><button data-course="${c.img}" aria-label="查看${esc(c.title)}"><img src="assets/${c.img}.jpg" alt="${esc(c.title)}"></button><div><h2>${esc(c.title)}</h2><p>已下載 ${count} 集</p><button data-offline-delete="${c.img}">刪除下載</button></div></article>`).join(''):offlineEmptyMarkup;
  }
  panel.addEventListener('click',e=>{const b=e.target.closest('[data-offline-delete]');if(b){let keys=[];try{keys=JSON.parse(localStorage.getItem('jinfm-demo-downloads')||'[]')}catch{}localStorage.setItem('jinfm-demo-downloads',JSON.stringify(keys.filter(k=>!k.startsWith(b.dataset.offlineDelete+':'))));window.dispatchEvent(new Event('demo-downloads-changed'));refreshDownloads()}});
  window.addEventListener('demo-downloads-changed',()=>{if(active==='downloads')refreshDownloads()});
  let prefs={wifi:false,theme:'light'};
  try{prefs={...prefs,...JSON.parse(localStorage.getItem('jinfm-settings')||'{}')}}catch{}
  const savePrefs=()=>{try{localStorage.setItem('jinfm-settings',JSON.stringify(prefs))}catch{}};
  function applyAppearance(){
    phone.dataset.appearance=panel.hidden?'light':prefs.theme;
    panel.querySelectorAll('[data-appearance]').forEach(b=>{
      const selected=b.dataset.appearance===prefs.theme;
      b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);
    });
  }
  function selectNav(name){
    nav.querySelectorAll('[data-nav]').forEach(b=>{
      const selected=b.dataset.nav===name;
      b.classList.toggle('selected',selected);
      if(selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
      const i=b.querySelector('i');if(i&&['首頁','設定'].includes(b.dataset.nav))i.className=`${selected?'ph-fill':'ph'} ph-${b.dataset.nav==='首頁'?'house':'user'}`;
    });
  }
  function showPage(name,trigger){
    if(!pages.some(p=>p.dataset.settingsPage===name))return;
    window.accountDemo?.preparePage(name);
    if(trigger)pageOpeners.set(name,trigger);
    active=name;entry=trigger||entry;
    pages.forEach(p=>p.hidden=p.dataset.settingsPage!==name);
    phone.classList.toggle('settings-subpage',name!=='main');
    nav.inert=name!=='main';
    const page=pages.find(p=>!p.hidden);page.querySelector('.settings-scroll').scrollTop=0;
    page.querySelector('[data-settings-back]')?.focus({preventScroll:true});
    if(name==='downloads')refreshDownloads();
  }
  window.addEventListener('settings-demo-navigate',event=>{
    if(libraryLoginOrigin&&event.detail.page==='main'){returnToLibrary();return}
    showPage(event.detail.page,event.detail.trigger);
  });
  window.addEventListener('open-library-login',()=>{
    libraryLoginOrigin=true;document.querySelector('#library-panel').hidden=true;phone.classList.remove('library-open');
    openSettings();showPage('login');
  });
  function openSettings(){
    panel.hidden=false;phone.classList.add('settings-open');
    main.inert=true;homeHeader.inert=true;
    selectNav('設定');showPage('main');applyAppearance();
  }
  function closeSettings(){
    panel.hidden=true;phone.classList.remove('settings-open','settings-subpage');
    main.inert=false;homeHeader.inert=false;nav.inert=false;
    selectNav('首頁');applyAppearance();
  }
  nav.addEventListener('click',e=>{
    const b=e.target.closest('[data-nav]');if(!b)return;
    if(b.dataset.nav==='設定')openSettings();else if(b.dataset.nav==='首頁'&&!panel.hidden)closeSettings();
  });
  panel.addEventListener('click',e=>{
    const target=e.target.closest('[data-settings-to]');
    if(target?.dataset.settingsTo==='login'&&window.accountDemo?.loggedIn){window.dispatchEvent(new Event('open-coupon-wallet'));return}
    if(target){showPage(target.dataset.settingsTo,target);return}
    if(e.target.closest('[data-settings-back]')){
      if(active==='login'&&libraryLoginOrigin){returnToLibrary();return}
      const previous=active;
      const destination=e.target.closest('[data-settings-back]').dataset.settingsBack||'main';
      showPage(destination);pageOpeners.get(previous)?.focus({preventScroll:true});return;
    }
    const appearance=e.target.closest('[data-appearance]');
    if(appearance){prefs.theme=appearance.dataset.appearance;savePrefs();applyAppearance();return}

  });
  const wifi=panel.querySelector('#wifi-switch');
  wifi.setAttribute('aria-checked',prefs.wifi);
  wifi.onclick=()=>{prefs.wifi=!prefs.wifi;wifi.setAttribute('aria-checked',prefs.wifi);savePrefs()};
  panel.querySelector('#wallet-refresh').onclick=()=>toast(`餘額已更新，目前為 ${window.accountDemo?.loggedIn?window.accountDemo.balance:0} 點`);
  panel.querySelector('#push-preference').onclick=()=>toast('請至裝置的系統設定管理通知權限');
  panel.querySelector('#share-app').onclick=async()=>{
    const url='https://learning.udn.com/jinfm';
    try{
      if(navigator.share)await navigator.share({title:'一刻鯨選',url});
      else{await navigator.clipboard.writeText(url);toast('已複製一刻鯨選連結')}
    }catch(error){if(error.name!=='AbortError')toast('無法開啟分享，請稍後再試')}
  };
  const tabs=[...panel.querySelectorAll('[role="tab"]')];
  function selectDownloadTab(button){
    tabs.forEach(b=>{const selected=b===button;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1});
    panel.querySelector('#download-empty').setAttribute('aria-labelledby',button.id);
    refreshDownloads();
  }
  tabs.forEach((b,i)=>{
    b.onclick=()=>selectDownloadTab(b);
    b.onkeydown=e=>{let index;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();selectDownloadTab(tabs[index]);tabs[index].focus()};
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&active!=='main')pages.find(p=>!p.hidden).querySelector('[data-settings-back]').click()});
  applyAppearance();
})();
