(() => {
  const notificationId='announcement-382';
  const storageKey='jinfm-notifications-read';
  let readIds;
  try{readIds=new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'))}catch{readIds=new Set()}
  const phone=document.querySelector('.phone');
  const openButton=document.querySelector('#notifications-open');
  const badge=document.querySelector('#notification-badge');
  const panel=document.querySelector('#notifications-panel');
  const list=document.querySelector('#notification-list');
  const detail=document.querySelector('#notification-detail');
  const heading=document.querySelector('#notifications-heading');
  const markAll=document.querySelector('#notifications-mark-all');
  const item=document.querySelector('#notification-item');
  const unreadDot=document.querySelector('#notification-unread');
  function updateUnread(){
    const unread=!readIds.has(notificationId);
    badge.hidden=!unread;badge.textContent=unread?'1':'';
    openButton.setAttribute('aria-label',unread?'通知，1 則未讀':'通知');
    unreadDot.hidden=!unread;
    item.setAttribute('aria-label',`${unread?'未讀，':''}優惠活動：【限時】10/1~10/18 消費滿千，抽《埃及之王》特展門票！`);
  }
  function markRead(){
    readIds.add(notificationId);
    try{localStorage.setItem(storageKey,JSON.stringify([...readIds]))}catch{}
    updateUnread();
  }
  function showList(){
    list.hidden=false;detail.hidden=true;markAll.hidden=false;
    heading.textContent='通知';
  }
  function openNotifications(){
    panel.hidden=false;phone.classList.add('notifying');showList();
    document.querySelectorAll('#home-scroll,.phone>header,.bottom-nav').forEach(el=>el.inert=true);
    document.querySelector('#notifications-back').focus({preventScroll:true});
  }
  function closeNotifications(){
    panel.hidden=true;phone.classList.remove('notifying');
    document.querySelectorAll('#home-scroll,.phone>header,.bottom-nav').forEach(el=>el.inert=false);
    openButton.focus({preventScroll:true});
  }
  openButton.addEventListener('click',openNotifications);
  markAll.addEventListener('click',()=>{markRead();toast('通知已全部設為已讀')});
  item.addEventListener('click',()=>{
    markRead();list.hidden=true;detail.hidden=false;markAll.hidden=true;
    heading.textContent='通知內容';detail.scrollTop=0;detail.focus({preventScroll:true});
  });
  document.querySelector('#notifications-back').addEventListener('click',()=>{
    if(!detail.hidden){showList();item.focus()}else closeNotifications();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!panel.hidden){
      if(!detail.hidden){showList();item.focus()}else closeNotifications();
    }
  });
  window.addEventListener('storage',e=>{
    if(e.key===storageKey){try{readIds=new Set(JSON.parse(e.newValue||'[]'));updateUnread()}catch{}}
  });
  updateUnread();
})();
