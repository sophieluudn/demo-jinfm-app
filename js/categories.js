(() => {
  const {categories,catalogues,courses}=window.categoryData;
  const phone=document.querySelector('.phone');
  const list=document.querySelector('#category-list-panel');
  const directory=document.querySelector('#category-directory-panel');
  const rows=document.querySelector('#category-course-list');
  const tabs=document.querySelector('#category-subtabs');
  const typeFilters=document.querySelector('#category-type-filters');
  const literary=new Set(catalogues[14]?.ids||[]);
  const types=['說書','小說劇','有聲書','講座','聲音課程','影像課程'];
  courses.forEach(c=>{
    c.category=categories.find(main=>[main.id,...main.subcategory.map(sub=>sub.id)].some(id=>catalogues[id]?.ids.includes(c.id)))?.label||'文史哲';
    c.type=c.video?'影像課程':literary.has(c.id)||[360,1931].includes(c.id)?'有聲書':/小說劇/.test(c.title)?'小說劇':/講座/.test(c.desc)?'講座':/導讀|說書/.test(c.title)?'說書':'聲音課程';
    if(!all.some(existing=>existing.img===c.img))all.push(c);
  });
  let mainId=0,selectedId=0,selectedTypes=new Set(),opener=null,background=[];
  const main=()=>categories.find(c=>c.id===mainId);
  const count=id=>catalogues[id]?.count||0;
  function renderRows(){
    const ids=catalogues[selectedId]?.ids||[];
    const visible=ids.map(id=>courses.find(c=>c.id===id)).filter(c=>c&&(!selectedTypes.size||selectedTypes.has(c.type)));
    rows.innerHTML=visible.length?visible.map(c=>`<article class="category-course"><button class="category-cover" data-course="${c.img}" aria-label="查看${esc(c.title)}"><img src="assets/${c.img}.jpg" alt="${esc(c.title)}" loading="lazy"></button><div class="category-course-info"><h2><span class="tag ${c.video?'video':''}">${c.video?'影像':'聲音'}</span>${esc(c.title)}</h2><p class="category-author">${esc(c.author)}</p><p>${c.episodes}集</p><div class="category-course-actions"><span class="category-price">${c.price}點${c.old>c.price?`<del>${c.old}點</del>`:''}</span><button class="favorite" data-favorite="${c.img}" aria-label="收藏${esc(c.title)}" aria-pressed="${saved.has(c.img)}">${icon('heart',saved.has(c.img))}</button>${c.video?'':`<button class="category-play" data-course="${c.img}" aria-label="試聽${esc(c.title)}">${icon('play-circle')}</button>`}</div></div></article>`).join(''):'<div class="category-empty"><p>目前沒有符合的課程</p><button id="category-clear-types">清除類型篩選</button></div>';
    tabs.querySelectorAll('[data-category-tab]').forEach(b=>{const selected=Number(b.dataset.categoryTab)===selectedId;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1});
    typeFilters.querySelectorAll('[data-course-type]').forEach(b=>b.setAttribute('aria-pressed',selectedTypes.has(b.dataset.courseType)));
  }
  function renderList(){
    document.querySelector('#category-list-title').textContent=main()?.label||'全部內容';
    const items=[{id:mainId,label:'所有'},...(main()?.subcategory||[])];
    tabs.innerHTML=items.map(c=>`<button role="tab" data-category-tab="${c.id}" aria-selected="${c.id===selectedId}" aria-controls="category-course-list">${esc(c.label)}(${count(c.id)})</button>`).join('');
    typeFilters.innerHTML=types.map(type=>`<button data-course-type="${type}" aria-pressed="false"><span aria-hidden="true"></span>${type}</button>`).join('');
    renderRows();
    tabs.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});
    rows.scrollTop=0;
  }
  function open(mainCategory=0,subcategory=mainCategory,trigger){
    if(list.hidden){
      opener=trigger;
      background=[...document.querySelectorAll('.phone>header,#home-scroll,.bottom-nav')].map(el=>[el,el.inert]);
      background.forEach(([el])=>el.inert=true);
    }
    mainId=Number(mainCategory);selectedId=Number(subcategory);selectedTypes.clear();
    list.hidden=false;directory.hidden=true;phone.classList.add('category-open');phone.classList.remove('category-directory-open');
    list.inert=false;renderList();document.querySelector('#category-list-back').focus({preventScroll:true});
  }
  function close(){
    directory.hidden=true;list.hidden=true;list.inert=false;
    phone.classList.remove('category-open','category-directory-open');
    background.forEach(([el,inert])=>el.inert=inert);opener?.focus({preventScroll:true});
  }
  function openDirectory(){
    const blocks=[{id:0,label:'全部內容',subcategory:[]},...categories];
    document.querySelector('#category-directory-content').innerHTML=blocks.map(c=>`<details class="category-group" ${c.id===0||c.id===mainId?'open':''}><summary>${esc(c.label)}<i class="ph ph-caret-down" aria-hidden="true"></i></summary><div class="category-choices"><button data-category-main="${c.id}" data-category-choice="${c.id}" class="${selectedId===c.id?'current':''}">所有(${count(c.id)})</button>${c.subcategory.map(sub=>`<button data-category-main="${c.id}" data-category-choice="${sub.id}" class="${selectedId===sub.id?'current':''}">${esc(sub.label)}(${count(sub.id)})</button>`).join('')}</div></details>`).join('');
    directory.hidden=false;list.inert=true;phone.classList.add('category-directory-open');document.querySelector('#category-directory-close').focus({preventScroll:true});
  }
  function closeDirectory(){directory.hidden=true;list.inert=false;phone.classList.remove('category-directory-open');document.querySelector('#category-directory-open').focus({preventScroll:true})}
  document.querySelector('#category-list-back').onclick=close;
  document.querySelector('#category-directory-open').onclick=openDirectory;
  document.querySelector('#category-directory-close').onclick=closeDirectory;
  tabs.addEventListener('click',event=>{const button=event.target.closest('[data-category-tab]');if(button){selectedId=Number(button.dataset.categoryTab);renderRows();rows.scrollTop=0}});
  tabs.addEventListener('keydown',event=>{
    const buttons=[...tabs.querySelectorAll('button')],index=buttons.indexOf(event.target);
    if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    buttons[next].click();buttons[next].focus();
  });
  typeFilters.addEventListener('click',event=>{const button=event.target.closest('[data-course-type]');if(!button)return;const value=button.dataset.courseType;selectedTypes.has(value)?selectedTypes.delete(value):selectedTypes.add(value);renderRows();rows.scrollTop=0});
  rows.addEventListener('click',event=>{if(event.target.closest('#category-clear-types')){selectedTypes.clear();renderRows()}});
  directory.addEventListener('click',event=>{const button=event.target.closest('[data-category-choice]');if(button)open(Number(button.dataset.categoryMain),Number(button.dataset.categoryChoice))});
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!document.querySelector('#course-panel').hidden)return;
    if(!directory.hidden){event.preventDefault();event.stopImmediatePropagation();closeDirectory()}else if(!list.hidden){event.preventDefault();event.stopImmediatePropagation();close()}
  },true);
  for(const rail of [tabs,typeFilters]){
    let drag=null,moved=false;
    rail.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button===0){moved=false;drag={id:event.pointerId,x:event.clientX,left:rail.scrollLeft}}});
    rail.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;const delta=event.clientX-drag.x;if(!moved&&Math.abs(delta)<6)return;moved=true;rail.setPointerCapture(event.pointerId);rail.scrollLeft=drag.left-delta;event.preventDefault()});
    rail.addEventListener('pointerup',()=>drag=null);rail.addEventListener('pointercancel',()=>{drag=null;moved=false});rail.addEventListener('lostpointercapture',()=>drag=null);
    rail.addEventListener('click',event=>{if(moved){event.preventDefault();event.stopImmediatePropagation();moved=false}},true);
  }
  window.openCategoryList=label=>{
    const category=categories.find(c=>c.label===label);open(category?.id||0,category?.id||0,[...document.querySelectorAll('.filters button')].find(b=>b.textContent===label));
  };
})();
