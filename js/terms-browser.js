(() => {
  const officialUrl='https://www.udngroup.com/members/service';
  const browserPanel=document.querySelector('#terms-browser');
  const settings=document.querySelector('#settings-panel');
  const content=browserPanel.querySelector('.terms-web-content');
  const close=browserPanel.querySelector('#terms-browser-close');
  const menu=browserPanel.querySelector('#terms-site-menu');
  const links=browserPanel.querySelector('#terms-site-links');
  let opener;
  document.addEventListener('click',e=>{
    const link=e.target.closest('#settings-panel a');
    if(!link||link.href!==officialUrl)return;
    e.preventDefault();opener=link;
    browserPanel.hidden=false;settings.inert=true;
    document.querySelector('.phone').classList.add('terms-browser-open');
    content.scrollTop=0;links.hidden=true;menu.setAttribute('aria-expanded','false');
    close.focus({preventScroll:true});
  });
  function closeBrowser(){
    browserPanel.hidden=true;settings.inert=false;
    document.querySelector('.phone').classList.remove('terms-browser-open');
    opener?.focus({preventScroll:true});
  }
  close.addEventListener('click',closeBrowser);
  menu.addEventListener('click',()=>{links.hidden=!links.hidden;menu.setAttribute('aria-expanded',!links.hidden)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!browserPanel.hidden){e.stopImmediatePropagation();closeBrowser()}},true);
})();
