(() => {
  const phone = document.querySelector('.phone');
  const sheet = document.createElement('div');
  sheet.id = 'share-sheet';
  sheet.hidden = true;
  sheet.innerHTML = `<div class="share-backdrop"></div><section class="share-panel" role="dialog" aria-modal="true" aria-label="分享"><div class="share-handle"></div><div class="share-title"><span class="share-document"><i class="ph ph-text-aa"></i></span><span id="share-title-text"></span><button class="share-close" aria-label="關閉分享"><i class="ph ph-x"></i></button></div><div class="share-contacts" aria-label="建議聯絡人"></div><div class="share-apps" aria-label="分享方式"></div><div class="share-actions" aria-label="其他操作"></div></section>`;
  phone.append(sheet);
  const contacts = [['怡君','怡','#e59780'],['家豪','家','#728dc8'],['雅婷','雅','#50b9aa'],['志明','志','#a08bcb'],['小玲','玲','#db8eae']];
  const contactsEl = sheet.querySelector('.share-contacts');
  contacts.forEach(([name, initial, color]) => {
    const button = document.createElement('button');
    button.className = 'share-contact';
    button.innerHTML = `<span class="share-avatar" style="background:${color}">${initial}<i class="ph-fill ph-paper-plane-tilt"></i></span><span>${name}</span>`;
    button.onclick = () => { close(); notify(`已選擇 ${name}（示範）`); };
    contactsEl.append(button);
  });
  const apps = [['AirDrop','broadcast','airdrop'],['訊息','chat-circle-fill','messages'],['郵件','envelope-fill','mail'],['雲端硬碟','google-drive-logo','drive']];
  apps.forEach(([name, icon, style]) => {
    const button = document.createElement('button');button.className='share-option';
    button.innerHTML=`<span class="share-app-icon ${style}"><i class="ph ${icon.endsWith('-fill')?'ph-fill ph-'+icon.slice(0,-5):'ph-'+icon}"></i></span><span>${name}</span>`;
    button.onclick=()=>{close();notify(`${name}分享為示範功能`)};
    sheet.querySelector('.share-apps').append(button);
  });
  const actions=[['拷貝','copy'],['新增快速備忘錄','note-pencil'],['儲存到檔案','folder'],['檢視較多','caret-down']];
  let shareText='', opener;
  function notify(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('visible');setTimeout(()=>el.classList.remove('visible'),2600)}
  function close(){sheet.classList.remove('open');sheet.hidden=true;opener?.focus({preventScroll:true})}
  actions.forEach(([name,icon])=>{const button=document.createElement('button');button.className='share-option';button.innerHTML=`<span class="share-action-icon"><i class="ph ph-${icon}"></i></span><span>${name}</span>`;button.onclick=async()=>{if(name==='拷貝'){try{await navigator.clipboard.writeText(shareText);close();notify('已複製分享內容')}catch{close();notify('無法複製，請稍後再試')}}else{close();notify(`${name}為示範功能`)}};sheet.querySelector('.share-actions').append(button)});
  function open(button, title){opener=button;shareText=`【一刻鯨選】${title}`;sheet.querySelector('#share-title-text').textContent=shareText;sheet.hidden=false;requestAnimationFrame(()=>sheet.classList.add('open'));sheet.querySelector('.share-close').focus({preventScroll:true})}
  sheet.querySelector('.share-close').onclick=close;sheet.querySelector('.share-backdrop').onclick=close;
  document.querySelector('#course-share').onclick=e=>open(e.currentTarget,document.querySelector('#course-title').textContent);
  document.querySelector('#full-player-share').onclick=e=>open(e.currentTarget,document.querySelector('#full-player-title').textContent);
  document.querySelector('#share-app').onclick=e=>open(e.currentTarget,'一刻鯨選 App');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden){e.stopImmediatePropagation();close()}},true);
})();
