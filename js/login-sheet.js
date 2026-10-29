(() => {
  const overlay=document.querySelector('#login-method-overlay');
  const settings=document.querySelector('#settings-panel');
  const close=document.querySelector('#login-method-close');
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
  overlay.addEventListener('click',e=>{
    if(e.target===overlay)dismiss();
    const provider=e.target.closest('[data-auth-provider]');
    if(provider)toast(`已選擇${provider.dataset.authProvider}，會員驗證尚未串接`);
  });
  document.querySelectorAll('.legacy-auth [data-auth-provider]').forEach(button=>button.onclick=()=>toast(`已選擇${button.dataset.authProvider}，帳號綁定尚未串接`));
  document.addEventListener('keydown',e=>{
    if(overlay.hidden)return;
    if(e.key==='Escape'){e.stopImmediatePropagation();dismiss()}
    if(e.key==='Tab'){
      const buttons=[...overlay.querySelectorAll('button')];
      if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus()}
      else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus()}
    }
  },true);
})();
