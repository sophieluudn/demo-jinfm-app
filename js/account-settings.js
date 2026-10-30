(() => {
  const panel=document.querySelector('#settings-panel');
  const stateKey='jinfm-account-demo';
  let state={loggedIn:true,nickname:'程仕碼',avatar:'assets/account-avatar.png',devices:['iphone13','iphone14'],balance:990};
  try{state={...state,...JSON.parse(localStorage.getItem(stateKey)||'{}')}}catch{}
  if(!Number.isSafeInteger(state.balance)||state.balance<0)state.balance=990;
  const persist=()=>{try{localStorage.setItem(stateKey,JSON.stringify(state))}catch{toast('已套用變更；此瀏覽器目前無法保存資料')}};
  const navigate=page=>window.dispatchEvent(new CustomEvent('settings-demo-navigate',{detail:{page}}));
  const header=(title,action='')=>`<div class="settings-header"><button class="settings-back" data-settings-back aria-label="返回設定"><i class="ph ph-caret-left" aria-hidden="true"></i></button><h2>${title}</h2>${action}</div>`;
  const transactions=[
    {title:'中年必修課：面對一個人的勇敢',points:199,status:'App 交易成功（贈禮）',time:'2026/09/15 15:28:42',gift:'CGCK6HH69GXY'},
    {title:'加值點數',points:570,status:'App 交易成功',time:'2026/09/15 15:28:12',order:'A260915072701468d8',payment:'2000001236445335'},
    {title:'易學大師劉君祖 教你一次讀懂易經',points:500,status:'App 兌換成功',time:'2026/08/28 11:02:55'},
    {title:'加值點數',points:570,status:'App 交易成功',time:'2026/08/28 11:02:35',order:'A260828110235001',payment:'2000001236445001'},
    {title:'牧羊少年奇幻之旅',points:420,status:'App 兌換成功',time:'2026/08/28 10:54:34'},
    {title:'加值點數',points:570,status:'App 交易成功',time:'2026/08/28 10:54:17',order:'A260828105417002',payment:'2000001236445002'},
    {title:'小婦人',points:480,status:'App 兌換成功',time:'2026/08/27 16:23:12'},
    {title:'加值點數',points:30,status:'App 交易成功',time:'2026/08/27 16:23:01',order:'A260827162301003',payment:'2000001236445003'},
    {title:'頌缽音療 3 放鬆心情',points:100,status:'App 兌換成功',time:'2026/08/27 16:19:51'}
  ];
  const menu=(page,icon,text)=>`<button data-settings-to="${page}" data-member-only><i class="ph ph-${icon}" aria-hidden="true"></i><span>${text}</span><i class="ph ph-caret-right" aria-hidden="true"></i></button>`;
  const topupPlans=[{points:130},{points:230},{points:570,bonus:50},{points:1090,bonus:100},{points:1690,bonus:180},{points:2990,bonus:380},{points:4990,bonus:660}];
  const downloadsButton=panel.querySelector('[data-settings-to="downloads"]');
  downloadsButton.insertAdjacentHTML('afterend',menu('transactions','currency-circle-dollar','交易紀錄')+menu('subscriptions','crown-simple','訂閱項目'));
  panel.querySelector('[data-settings-to="other"]').insertAdjacentHTML('beforebegin',menu('devices','device-mobile','裝置管理'));
  panel.insertAdjacentHTML('beforeend',`
    <div class="settings-page" data-settings-page="profile" hidden>
      ${header('編輯','<button id="profile-save" class="settings-save">儲存</button>')}
      <div class="settings-scroll profile-body">
        <button id="profile-avatar-change" class="profile-avatar-change"><img src="assets/account-avatar.png" alt="會員頭像"><span>更換大頭貼</span></button><input type="file" id="profile-avatar-file" accept="image/*" hidden>
        <form id="profile-form"><label for="profile-nickname">暱稱 <span>*</span></label><input id="profile-nickname" name="nickname" required maxlength="32" autocomplete="nickname"></form>
        <dl class="profile-fields"><div><dt>一刻鯨選 ID</dt><dd>5bf6577a52511</dd></div><div><dt>udn ID</dt><dd>udndevice</dd></div><div><dt>udn 登入方式</dt><dd><span id="profile-login-method">透過Facebook登入</span><br>udn.device@gmail.com</dd></div></dl>
        <button id="account-logout" class="account-primary">登出</button><button id="account-delete" class="account-delete">申請刪除帳號</button>
      </div>
    </div>
    <div class="settings-page" data-settings-page="transactions" hidden>
      ${header('交易紀錄')}
      <div class="settings-scroll transaction-list">${transactions.map((t,i)=>`<button data-transaction="${i}"><span class="transaction-copy"><small>${t.status}</small><span>${t.title}</span><time>${t.time}</time></span><span class="transaction-points">${t.points}點</span><i class="ph ph-caret-right" aria-hidden="true"></i></button>`).join('')}</div>
    </div>
    <div class="settings-page" data-settings-page="transaction-detail" hidden>
      ${header('交易紀錄').replace('data-settings-back ', 'data-settings-back="transactions" ')}
      <div class="settings-scroll transaction-detail"><dl id="transaction-detail-fields"></dl></div>
    </div>
    <div class="settings-page" data-settings-page="subscriptions" hidden>
      ${header('訂閱項目')}
      <div class="settings-scroll subscriptions-body"><div class="subscription-divider">已到期</div><article class="subscription-card"><p class="subscription-expired"><i class="ph-fill ph-info" aria-hidden="true"></i> 授權已過期</p><img src="assets/borrow/ocean.jpg" alt="訂閱方案"><div><p>從 2024/03/12 開始訂閱</p><button id="subscription-manage">訂閱管理</button></div></article></div>
    </div>
    <div class="settings-page" data-settings-page="devices" hidden>
      ${header('裝置管理')}
      <div class="settings-scroll devices-body"><div id="account-devices"></div></div><div class="devices-footer"><p>最多可同時登入 3 台裝置</p><button id="devices-delete" class="account-primary" disabled>刪除裝置</button></div>
    </div>
    <div class="settings-page topup-page" data-settings-page="topup" hidden>
      ${header('加值點數')}
      <div class="settings-scroll topup-body"><p class="topup-balance">錢包餘額 <strong id="topup-balance"></strong></p><div class="topup-plans" role="radiogroup" aria-label="選擇加值點數">${topupPlans.map((p,i)=>`<button type="button" role="radio" data-topup-plan="${p.points}" aria-checked="${i===0}" tabindex="${i===0?0:-1}"><span>${p.points} 點</span>${p.bonus?`<span>贈 ${p.bonus} 點紅包</span>`:''}<small>TWD ${p.points}</small></button>`).join('')}</div></div>
      <div class="topup-footer"><button id="topup-confirm" class="account-primary">確定加值</button></div>
      <div id="topup-status" role="status" aria-live="polite" hidden><span class="topup-spinner" aria-label="加值處理中"></span><img src="assets/favorite-whale.png" alt="" hidden><span id="topup-status-text"></span></div>
    </div>
  `);
  const demoLogin=document.createElement('button');
  demoLogin.className='guest-login';demoLogin.id='account-demo-login';demoLogin.textContent='體驗已登入畫面';
  panel.querySelector('.guest-login').before(demoLogin);
  function renderAccount(){
    const profile=panel.querySelector('.account-profile');
    profile.innerHTML=state.loggedIn?`<img src="${state.avatar}" alt="會員頭像"><h1>${esc(state.nickname)}</h1><button class="account-login" data-settings-to="profile">編輯</button>`:'<span class="account-avatar" role="img" aria-label="預設會員頭像"><i class="ph-fill ph-user" aria-hidden="true"></i></span><h1>未登入</h1><button class="account-login" data-settings-to="login">登入</button>';
    panel.querySelectorAll('[data-member-only]').forEach(el=>el.hidden=!state.loggedIn);
    panel.querySelector('.wallet b').textContent=state.loggedIn?`${state.balance}點`:'0點';
    panel.querySelector('.wallet-topup').dataset.settingsTo=state.loggedIn?'topup':'login';
    const used=state.loggedIn?'90.9':'92.4',free=state.loggedIn?'30.8':'27.8';
    panel.querySelector('.storage-bar').setAttribute('aria-label',`示範手機容量：已使用 ${used} GB，一刻鯨選 0 MB，可用 ${free} GB`);
    panel.querySelector('.storage-bar>span').style.width=state.loggedIn?'74.7%':'76.87%';
    panel.querySelector('.storage-legend').innerHTML=`<span><i></i>已使用 ${used} GB</span><span><i></i>一刻鯨選 0 MB</span><span><i></i>可用 ${free} GB</span>`;
    panel.classList.toggle('account-signed-in',state.loggedIn);
    window.dispatchEvent(new Event('demo-account-changed'));
  }
  function renderDevices(){
    const deviceRows=[{id:'current',name:'iPhone',model:'iPhone17,4',current:true},{id:'iphone13',name:'iPhone 13',model:'iPhone 13',time:'2026/09/15 15:22'},{id:'iphone14',name:'iPhone',model:'iPhone 14',time:'2026/10/15 16:50'}].filter(d=>d.current||state.devices.includes(d.id));
    document.querySelector('#account-devices').innerHTML=deviceRows.map(d=>`<label class="account-device"><input type="checkbox" value="${d.id}" ${d.current?'disabled':''} aria-label="${d.current?'現在的裝置，無法刪除':`選取 ${d.name} ${d.model}`}"><span><span class="device-name">${d.name} <span>${d.model}</span></span>${d.current?'<small class="device-current">● 現在的裝置</small>':`<small>上次使用時間：${d.time}</small>`}</span></label>`).join('');
    document.querySelector('#devices-delete').disabled=true;
  }
  let draftAvatar=state.avatar;
  let selectedTopup=130,topupPending=false,topupResultTimer;
  const topupPage=panel.querySelector('[data-settings-page="topup"]');
  const topupStatus=panel.querySelector('#topup-status');
  function selectTopup(points){
    if(topupPending||!topupPlans.some(plan=>plan.points===points))return;
    selectedTopup=points;
    topupPage.querySelectorAll('[data-topup-plan]').forEach(button=>{const selected=Number(button.dataset.topupPlan)===points;button.setAttribute('aria-checked',selected);button.tabIndex=selected?0:-1});
  }
  function prepareTopup(){
    clearTimeout(topupResultTimer);topupStatus.hidden=true;
    document.querySelector('#topup-balance').textContent=`${state.balance}點`;
    selectTopup(130);
  }
  function preparePage(name){
    if(name==='main')renderAccount();
    if(name==='profile'){document.querySelector('#profile-nickname').value=state.nickname;draftAvatar=state.avatar;document.querySelector('#profile-avatar-change img').src=draftAvatar;document.querySelector('#profile-avatar-file').value='';document.querySelector('#profile-login-method').textContent=`透過${state.provider||'Facebook'}登入`}
    if(name==='devices')renderDevices();
    if(name==='topup')prepareTopup();
  }
  topupPage.querySelector('.topup-plans').addEventListener('click',event=>{const button=event.target.closest('[data-topup-plan]');if(button)selectTopup(Number(button.dataset.topupPlan))});
  topupPage.querySelector('.topup-plans').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    const buttons=[...topupPage.querySelectorAll('[data-topup-plan]')],index=buttons.indexOf(event.target);if(index<0)return;
    event.preventDefault();const offset=event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:event.key==='ArrowUp'?-2:2;
    const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+offset+buttons.length)%buttons.length;
    selectTopup(Number(buttons[next].dataset.topupPlan));buttons[next].focus();
  });
  document.querySelector('#topup-confirm').onclick=()=>{
    if(topupPending)return;
    const plan=topupPlans.find(item=>item.points===selectedTopup);if(!plan)return;
    clearTimeout(topupResultTimer);topupPending=true;topupPage.setAttribute('aria-busy','true');
    topupPage.querySelector('.topup-plans').inert=true;topupPage.querySelector('[data-settings-back]').disabled=true;document.querySelector('#topup-confirm').disabled=true;
    topupStatus.hidden=false;topupStatus.querySelector('.topup-spinner').hidden=false;topupStatus.querySelector('img').hidden=true;document.querySelector('#topup-status-text').textContent='';
    setTimeout(()=>{
      const failed=new URLSearchParams(location.search).get('topupDemo')==='fail';
      if(!failed){
        state.balance+=plan.points;persist();renderAccount();
        document.querySelector('#topup-balance').textContent=`${state.balance}點`;
        if(plan.bonus)window.dispatchEvent(new CustomEvent('demo-topup-bonus',{detail:{amount:plan.bonus}}));
      }
      topupPending=false;topupPage.setAttribute('aria-busy','false');
      topupPage.querySelector('.topup-plans').inert=false;topupPage.querySelector('[data-settings-back]').disabled=false;document.querySelector('#topup-confirm').disabled=false;
      topupStatus.querySelector('.topup-spinner').hidden=true;topupStatus.querySelector('img').hidden=false;
      document.querySelector('#topup-status-text').textContent=failed?'購買失敗':'購買成功';
      topupResultTimer=setTimeout(()=>{topupStatus.hidden=true},2200);
    },1200);
  };
  panel.addEventListener('click',event=>{
    const row=event.target.closest('[data-transaction]');if(!row)return;
    const t=transactions[Number(row.dataset.transaction)];
    const fields=[['項目',t.title],[t.order?'交易點數':'銷售點數',`${t.points}點`],...(!t.order?[['點數使用狀況',`錢包${t.points}點`]]:[]),['狀態',t.order?'交易成功':t.status],['時間',t.time],...(t.gift?[['禮品券序號',t.gift]]:[]),...(t.order?[['訂單編號',t.order],['付款編號',t.payment]]:[])];
    document.querySelector('#transaction-detail-fields').innerHTML=fields.map(([label,value])=>`<div><dt>${label}</dt><dd ${label==='狀態'?'class="transaction-status"':''}>${esc(value)}</dd></div>`).join('');
    window.dispatchEvent(new CustomEvent('settings-demo-navigate',{detail:{page:'transaction-detail',trigger:row}}));
  });
  function saveProfile(){
    const input=document.querySelector('#profile-nickname');input.value=input.value.trim();
    if(!input.reportValidity())return;
    state.nickname=input.value;state.avatar=draftAvatar;persist();renderAccount();navigate('main');toast('個人資料已儲存');
  }
  document.querySelector('#profile-save').onclick=saveProfile;
  document.querySelector('#profile-form').onsubmit=event=>{event.preventDefault();saveProfile()};
  document.querySelector('#profile-avatar-change').onclick=()=>document.querySelector('#profile-avatar-file').click();
  document.querySelector('#profile-avatar-file').onchange=event=>{
    const file=event.target.files[0];if(!file)return;
    if(!file.type.startsWith('image/')){toast('請選擇圖片檔案');return}
    if(file.size>2*1024*1024){toast('請選擇小於 2 MB 的圖片');return}
    const reader=new FileReader();reader.onload=()=>{draftAvatar=reader.result;document.querySelector('#profile-avatar-change img').src=draftAvatar};reader.readAsDataURL(file);
  };
  document.querySelector('#account-logout').onclick=()=>{state.loggedIn=false;persist();renderAccount();navigate('main');toast('已登出')};
  function login(provider='Facebook'){state.loggedIn=true;state.provider=provider;persist();renderAccount();navigate('main')}
  demoLogin.onclick=()=>login();
  document.querySelector('#account-delete').onclick=()=>toast('此為介面示範，未送出帳號刪除申請');
  document.querySelector('#subscription-manage').onclick=()=>toast('此訂閱已到期；示範模式未連接 App Store 訂閱管理');
  document.querySelector('#account-devices').onchange=()=>document.querySelector('#devices-delete').disabled=!document.querySelector('#account-devices input:checked');
  document.querySelector('#devices-delete').onclick=()=>{
    const ids=[...document.querySelectorAll('#account-devices input:checked:not(:disabled)')].map(input=>input.value);
    if(!ids.length)return;
    state.devices=state.devices.filter(id=>!ids.includes(id));persist();renderDevices();toast(`已刪除 ${ids.length} 台裝置`);
  };
  window.accountDemo={preparePage,login,get loggedIn(){return state.loggedIn},get balance(){return state.balance}};
  renderAccount();
})();
