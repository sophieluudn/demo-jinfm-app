(() => {
  const overlay=document.querySelector('#login-method-overlay');
  const settings=document.querySelector('#settings-panel');
  const close=document.querySelector('#login-method-close');
  const credentials=document.querySelector('#member-credentials-overlay');
  const credentialClose=document.querySelector('#credentials-close');
  const credentialTabs=[...credentials.querySelectorAll('[data-credentials-tab]')];
  let credentialOpener;
  let opener;
  function open(button){
    opener=button;overlay.hidden=false;settings.inert=true;
    document.querySelector('.phone').classList.add('login-method-open');
    close.focus({preventScroll:true});
  }
  function dismiss(){
    overlay.hidden=true;settings.inert=false;
    document.querySelector('.phone').classList.remove('login-method-open');
    opener?.focus({preventScroll:true});
  }
  document.addEventListener('click',e=>{const button=e.target.closest('[data-login-preview]');if(button)open(button)});
  close.onclick=dismiss;
  function switchCredentialTab(name){
    credentialTabs.forEach(button=>{const selected=button.dataset.credentialsTab===name;button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1});
    credentials.querySelector('#credentials-login-panel').hidden=name!=='login';
    credentials.querySelector('#credentials-register-panel').hidden=name!=='register';
    credentials.querySelector('#credentials-title').textContent=name==='login'?'E-mail / 手機登入':'電子信箱或手機註冊';
  }
  function resetCredentials(){
    credentials.querySelectorAll('form').forEach(form=>form.reset());
    credentials.querySelectorAll('.credentials-password-toggle').forEach(button=>{const input=button.parentElement.querySelector('input');input.type='password';button.setAttribute('aria-label','顯示密碼');button.setAttribute('aria-pressed','false');button.innerHTML=icon('eye-slash',true)});
  }
  function openCredentials(button){
    credentialOpener=button;resetCredentials();switchCredentialTab('login');
    overlay.inert=true;credentials.hidden=false;document.querySelector('.phone').classList.add('credentials-open');
    credentials.querySelector('.member-credentials-sheet').scrollTop=0;credentialClose.focus({preventScroll:true});
  }
  function closeCredentials(){
    credentials.hidden=true;overlay.inert=false;document.querySelector('.phone').classList.remove('credentials-open');resetCredentials();
    credentialOpener?.focus({preventScroll:true});
  }
  credentialClose.onclick=closeCredentials;
  credentials.addEventListener('click',event=>{
    if(event.target===credentials){closeCredentials();return}
    const tab=event.target.closest('[data-credentials-tab]');if(tab){switchCredentialTab(tab.dataset.credentialsTab);return}
    const toggle=event.target.closest('.credentials-password-toggle');if(toggle){const input=toggle.parentElement.querySelector('input');const reveal=input.type==='password';input.type=reveal?'text':'password';toggle.setAttribute('aria-pressed',reveal);toggle.setAttribute('aria-label',reveal?'隱藏密碼':'顯示密碼');toggle.innerHTML=icon(reveal?'eye':'eye-slash',true);return}
    const help=event.target.closest('[data-credentials-help]');if(help)toast(`「${help.dataset.credentialsHelp}」服務尚未串接`);
  });
  credentials.querySelector('.credentials-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const current=credentialTabs.indexOf(event.target);if(current<0)return;
    event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?credentialTabs.length-1:(current+(event.key==='ArrowRight'?1:-1)+credentialTabs.length)%credentialTabs.length;
    switchCredentialTab(credentialTabs[index].dataset.credentialsTab);credentialTabs[index].focus();
  });
  credentials.querySelectorAll('form').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();const isRegister=form.id==='credentials-register-panel';
    closeCredentials();dismiss();window.accountDemo.login('E-mail／手機');toast(isRegister?'註冊成功':'登入成功');
  }));
  function login(provider){
    if(!['Facebook','Google','Apple','Line'].includes(provider))return false;
    if(!overlay.hidden)dismiss();
    window.accountDemo.login(provider);toast('登入成功');return true;
  }
  overlay.addEventListener('click',e=>{
    if(e.target===overlay)dismiss();
    const provider=e.target.closest('[data-auth-provider]');
    if(provider?.dataset.authProvider==='E-mail／手機'){openCredentials(provider);return}
    if(provider&&!login(provider.dataset.authProvider))toast(`已選擇${provider.dataset.authProvider}，會員驗證尚未串接`);
  });
  document.querySelectorAll('.legacy-auth [data-auth-provider]').forEach(button=>button.onclick=()=>{if(!login(button.dataset.authProvider))toast(`已選擇${button.dataset.authProvider}，帳號綁定尚未串接`)});
  document.addEventListener('keydown',e=>{
    if(!credentials.hidden){
      if(e.key==='Escape'){e.stopImmediatePropagation();closeCredentials();return}
      if(e.key==='Tab'){
        const controls=[...credentials.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]')].filter(el=>el.getClientRects().length&&!el.closest('[hidden]')&&el.tabIndex!==-1);
        if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1)?.focus()}
        else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0]?.focus()}
      }
      return;
    }
    if(overlay.hidden)return;
    if(e.key==='Escape'){e.stopImmediatePropagation();dismiss()}
    if(e.key==='Tab'){
      const buttons=[...overlay.querySelectorAll('button')];
      if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus()}
      else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus()}
    }
  },true);
})();
