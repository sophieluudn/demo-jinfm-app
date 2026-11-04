(() => {
  const phone=document.querySelector('.phone');
  const page=document.createElement('section');page.id='gift-message-page';page.hidden=true;page.setAttribute('aria-label','贈送訊息');
  page.innerHTML=`<button id="gift-message-close" aria-label="關閉贈送訊息"><i class="ph ph-x"></i></button><div class="gift-message-scroll"><div class="gift-message-heading"><img src="assets/favorite-whale.png" alt="" class="gift-message-whale"><span class="gift-ticket-label">禮品券</span><h2 id="gift-message-title"></h2><p>購買日期 <span id="gift-purchased-date"></span></p><div class="gift-validity"><i class="ph-fill ph-clock"></i> 有效期限一年（至 <span id="gift-expiry-date"></span>）</div></div><div class="gift-message-card"><div class="gift-message-editor"><label for="gift-message-input">給收贈人的留言(可編輯)</label><span id="gift-message-count"></span><textarea id="gift-message-input" maxlength="50" rows="2"></textarea></div><button id="gift-send-now">立即贈送</button><div class="gift-message-links"><button id="gift-preview-open">畫面預覽</button><button id="gift-send-later">稍後再送</button></div><div class="gift-other-methods"><h3>您也可以選擇以下方式贈送</h3><p>提供朋友條碼進行掃描兌換</p><div id="gift-qr" aria-label="禮品券兌換 QR Code"></div><div class="gift-method-divider">or</div><p>複製序號給朋友在 App 或官網兌換</p><div class="gift-code-row"><span id="gift-redemption-code"></span><button id="gift-code-copy"><i class="ph ph-copy"></i>複製</button></div></div></div></div>`;
  phone.append(page);
  const leave=document.createElement('div');leave.id='gift-leave-dialog';leave.hidden=true;leave.innerHTML='<section role="alertdialog" aria-modal="true" aria-labelledby="gift-leave-title" aria-describedby="gift-leave-description"><h2 id="gift-leave-title">確認離開？</h2><p id="gift-leave-description">您可以稍後至「設定 / 紅包 / 可贈送」查閱尚未使用的禮品券</p><div><button id="gift-leave-cancel">取消</button><button id="gift-leave-confirm">離開</button></div></section>';phone.append(leave);
  const preview=document.createElement('div');preview.id='gift-message-preview';preview.hidden=true;preview.innerHTML='<section role="dialog" aria-modal="true" aria-label="贈送畫面預覽"><span class="gift-ticket-label">禮品券</span><h2></h2><p></p><button>返回編輯</button></section>';phone.append(preview);
  let ticket,returnFocus,leaveFocus;
  const input=page.querySelector('#gift-message-input');
  const dateString=date=>new Date(date).toLocaleDateString('sv-SE',{timeZone:'Asia/Taipei'}).replaceAll('-','/');
  function saveMessage(){ticket.message=input.value;window.dispatchEvent(new Event('gift-message-save'));page.querySelector('#gift-message-count').textContent=`${input.value.length}/50`}
  input.addEventListener('input',saveMessage);
  function requestLeave(){leaveFocus=document.activeElement;page.inert=true;leave.hidden=false;leave.querySelector('#gift-leave-cancel').focus()}
  function cancelLeave(){leave.hidden=true;page.inert=false;leaveFocus?.focus({preventScroll:true})}
  page.querySelector('#gift-message-close').onclick=requestLeave;page.querySelector('#gift-send-later').onclick=requestLeave;
  leave.querySelector('#gift-leave-cancel').onclick=cancelLeave;
  leave.querySelector('#gift-leave-confirm').onclick=()=>{leave.hidden=true;page.hidden=true;page.inert=false;phone.classList.remove('gift-message-open');document.querySelector('#course-panel').inert=false;phone.classList.remove('flow-open','coupon-wallet-open');returnFocus?.focus({preventScroll:true})};
  page.querySelector('#gift-send-now').onclick=event=>window.dispatchEvent(new CustomEvent('open-gift-share',{detail:{trigger:event.currentTarget,title:`送你一刻鯨選 App 有聲音頻「${ticket.title}」`,text:`${input.value}\n${ticket.title}\n禮品券序號：${ticket.code}`}}));
  page.querySelector('#gift-code-copy').onclick=async()=>{try{await navigator.clipboard.writeText(ticket.code);toast('已複製序號')}catch{toast('請選取序號後複製')}};
  page.querySelector('#gift-preview-open').onclick=()=>{preview.querySelector('h2').textContent=ticket.title;preview.querySelector('p').textContent=input.value;preview.hidden=false;page.inert=true;preview.querySelector('button').focus()};
  function closePreview(){preview.hidden=true;page.inert=false;page.querySelector('#gift-preview-open').focus()}
  preview.querySelector('button').onclick=closePreview;
  window.addEventListener('open-gift-message',event=>{
    ticket=event.detail.ticket;returnFocus=event.detail.trigger||document.querySelector('#course-gift');page.hidden=false;page.inert=false;phone.classList.add('gift-message-open','flow-open');document.querySelector('#course-panel').inert=true;
    page.querySelector('#gift-message-title').textContent=ticket.title;page.querySelector('#gift-purchased-date').textContent=dateString(ticket.purchasedAt||Date.now());page.querySelector('#gift-expiry-date').textContent=ticket.expires.slice(0,10);
    let account={};try{account=JSON.parse(localStorage.getItem('jinfm-account-demo')||'{}')}catch{}
    input.value=(ticket.message||`希望您會喜歡！ – from ${account.nickname||'程仕碼'}`).slice(0,50);saveMessage();page.querySelector('#gift-redemption-code').textContent=ticket.code;
    const qr=qrcode(0,'M');qr.addData(ticket.code);qr.make();page.querySelector('#gift-qr').innerHTML=qr.createSvgTag({cellSize:4,margin:2,scalable:true});
    page.querySelector('.gift-message-scroll').scrollTop=0;page.querySelector('#gift-message-close').focus();
  });
  document.addEventListener('keydown',event=>{
    if(page.hidden||!document.querySelector('#share-sheet')?.hidden)return;
    if(event.key==='Escape'){event.stopImmediatePropagation();event.preventDefault();if(!leave.hidden)cancelLeave();else if(!preview.hidden)closePreview();else requestLeave()}
    if(event.key==='Tab'){
      const root=!leave.hidden?leave:!preview.hidden?preview:page;const controls=[...root.querySelectorAll('button,textarea')].filter(el=>!el.disabled);const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  },true);
})();
