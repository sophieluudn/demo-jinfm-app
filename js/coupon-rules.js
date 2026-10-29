(() => {
  const overlay=document.querySelector('#coupon-rules-overlay');
  const list=document.querySelector('#coupon-panel');
  const openButton=document.querySelector('#coupon-info');
  const closeButton=document.querySelector('#coupon-rules-close');
  openButton.onclick=()=>{overlay.hidden=false;list.inert=true;document.querySelector('.phone').classList.add('coupon-rules-open');closeButton.focus({preventScroll:true})};
  function close(){overlay.hidden=true;list.inert=false;document.querySelector('.phone').classList.remove('coupon-rules-open');openButton.focus({preventScroll:true})}
  closeButton.onclick=close;
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{
    if(overlay.hidden)return;
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close()}
    if(e.key==='Tab'){e.preventDefault();closeButton.focus({preventScroll:true})}
  },true);
})();
