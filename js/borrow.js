(() => {
  const phone=document.querySelector('.phone');
  const nav=document.querySelector('.bottom-nav');
  const panel=document.querySelector('#borrow-panel');
  const welcome=document.querySelector('#borrow-welcome');
  const close=document.querySelector('#borrow-welcome-close');
  const start=document.querySelector('#borrow-welcome-start');
  const seenKey='jinfm-borrow-welcome-seen';
  const {schools,courses,catalogues}=window.borrowData;
  // Reuse the demo catalogue for schools whose public snapshot has no courses.
  schools.forEach(s=>{if(!catalogues[s.id]?.length)catalogues[s.id]=[...catalogues.dyu]});
  const schoolPanel=document.querySelector('#borrow-school-panel');
  const infoPanel=document.querySelector('#borrow-info-panel');
  const infoContent=document.querySelector('#borrow-info-content');
  let infoOpener=null,infoBackground=[];
  function openInfo(id,opener){
    const institution=schools.find(s=>s.id===id);if(!institution)return;
    infoOpener=opener;
    const intro=id==='dyu'?'提供校內教職員、學生，聆聽〈一刻鯨選〉服務。戴上耳機吸收新知，名人講演、知性課程、藝文賞析，盡收耳裡。':`提供${institution.name}教職員、學生，聆聽〈一刻鯨選〉的各式主題內容。戴上耳機，隨時探索知識與生活新觀點。`;
    infoContent.innerHTML=`<h2>${esc(institution.name)}</h2><p>${esc(intro)}</p><h3>使用說明：</h3><p>-以校園資訊系統帳號(學號，教職員證號) / 密碼登入，即可租借並完整聆聽各主題內容。</p><p>-於首次登入後七日內未再次使用本專區，需重新登入。</p><h3>借閱政策：</h3><p>-主題課程單次借聽持有時間為72小時，借聽期間可手動歸還亦可於時限到期自動歸還。</p><p>-同時借聽的主題課程上限為三門，若欲借聽其他主題課程，需先手動歸還。</p><h3>帳號問題：</h3>${id==='dyu'?'<p>-忘記密碼請至<a href="http://pwd.dyu.edu.tw/" target="_blank" rel="noopener noreferrer">http://pwd.dyu.edu.tw/</a> 查詢。若有登入問題，請洽大葉大學圖書館，聯絡方式：<a href="tel:048511888,1539">(04)851-1888，分機1539</a>。</p>':'<p>-若忘記密碼，請使用校園資訊系統的密碼重設功能。若有登入或借閱問題，請洽學校圖書館服務櫃台。</p>'}`;
    infoBackground=[...phone.children].filter(el=>el!==infoPanel).map(el=>[el,el.inert]);
    infoBackground.forEach(([el])=>el.inert=true);
    infoPanel.hidden=false;phone.classList.add('borrow-info-open');infoContent.scrollTop=0;
    document.querySelector('#borrow-info-close').focus({preventScroll:true});
  }
  function closeInfo(){
    infoPanel.hidden=true;phone.classList.remove('borrow-info-open');
    infoBackground.forEach(([el,inert])=>el.inert=inert);
    infoOpener?.focus({preventScroll:true});
  }
  document.querySelector('#borrow-info-close').onclick=closeInfo;
  infoPanel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeInfo()}});
  const recentKey='jinfm-borrow-recent';
  let recent=[],school=null,category='全部',listPosition=0,schoolOpener=null;
  try{recent=JSON.parse(localStorage.getItem(recentKey)||'[]');if(!Array.isArray(recent))recent=[]}catch{}
  courses.forEach(course=>{if(!all.some(c=>c.img===course.img))all.push(course)});
  function renderRecent(){
    const query=document.querySelector('#borrow-search').value.trim();
    const rows=recent.map(id=>schools.find(s=>s.id===id)).filter(s=>s&&s.name.includes(query));
    document.querySelector('#borrow-recent').hidden=!rows.length;
    document.querySelector('#borrow-recent-list').innerHTML=rows.map(s=>`<button data-borrow-enter="${s.id}"><img src="${s.image}" alt=""><span>${esc(s.name)}</span></button>`).join('');
  }
  function renderSchools(){
    document.querySelector('#borrow-partners').innerHTML=schools.map(s=>`<article class="borrow-partner" data-borrow-partner><button class="borrow-partner-cover" data-borrow-enter="${s.id}" aria-label="進入${esc(s.name)}"><img src="${s.image}" alt=""></button><div><h3><button data-borrow-enter="${s.id}">${esc(s.name)}</button></h3>${s.description?`<p>${esc(s.description)}</p>`:''}<button data-borrow-info="${s.id}" aria-label="${esc(s.name)}資訊"><i class="ph ph-info" aria-hidden="true"></i></button><button class="borrow-enter" data-borrow-enter="${s.id}">進入<i class="ph ph-caret-right" aria-hidden="true"></i></button></div></article>`).join('');
    renderRecent();
  }
  function renderCourses(){
    const query=document.querySelector('#borrow-course-search').value.trim();
    const rows=(catalogues[school.id]||[]).map(id=>courses.find(c=>c.id===id)).filter(c=>c&&(category==='全部'||c.category===category)&&`${c.title}${c.author}`.includes(query));
    document.querySelectorAll('[data-borrow-category]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.borrowCategory===category));
    document.querySelector('#borrow-school-courses').innerHTML=rows.length?rows.map(c=>`<article class="borrow-course"><button class="borrow-course-cover" data-course="${c.img}" aria-label="查看${esc(c.title)}"><img src="${c.cover}" alt="${esc(c.title)}"></button><div><h2><span class="tag">聲音</span>${esc(c.title)}</h2><p>${esc(c.author)}</p><p>${c.episodes}集</p></div><button class="borrow-course-play" data-course="${c.img}" aria-label="播放${esc(c.title)}"><i class="ph ph-play-circle" aria-hidden="true"></i></button></article>`).join(''):'<p class="borrow-course-empty">找不到符合的課程</p>';
  }
  function openSchool(id,opener){
    school=schools.find(s=>s.id===id);if(!school)return;
    schoolOpener=opener;listPosition=document.querySelector('.borrow-scroll').scrollTop;
    schoolPanel.dataset.school=id;
    recent=[id,...recent.filter(item=>item!==id)].slice(0,5);
    try{localStorage.setItem(recentKey,JSON.stringify(recent))}catch{}
    renderRecent();panel.hidden=true;schoolPanel.hidden=false;
    document.querySelector('#borrow-school-name').textContent=school.name;
    category='全部';document.querySelector('#borrow-course-search').value='';
    document.querySelector('.borrow-course-search').hidden=true;
    document.querySelector('#borrow-school-search-toggle').setAttribute('aria-expanded','false');
    const categories=['全部',...new Set((catalogues[id]||[]).map(id=>courses.find(c=>c.id===id)?.category).filter(Boolean))];
    const preferred=['全部','文史哲','商業管理','休閒生活'];categories.sort((a,b)=>(preferred.includes(a)?preferred.indexOf(a):99)-(preferred.includes(b)?preferred.indexOf(b):99));
    document.querySelector('#borrow-categories').innerHTML=categories.map(name=>`<button data-borrow-category="${esc(name)}" aria-pressed="${name===category}">${name==='全部'?'<i class="ph-fill ph-circles-four" aria-hidden="true"></i>':''}${esc(name)}</button>`).join('');
    renderCourses();document.querySelector('#borrow-school-courses').scrollTop=0;
    document.querySelector('#borrow-school-back').focus({preventScroll:true});
  }
  function backToSchools(){schoolPanel.hidden=true;panel.hidden=false;document.querySelector('.borrow-scroll').scrollTop=listPosition;schoolOpener?.focus({preventScroll:true})}
  renderSchools();
  let seen=false,background=[];
  try{seen=localStorage.getItem(seenKey)==='true'}catch{}
  function dismiss(){
    welcome.hidden=true;
    background.forEach(([el,inert])=>el.inert=inert);
    seen=true;
    try{localStorage.setItem(seenKey,'true')}catch{}
    panel.querySelector('h1').focus({preventScroll:true});
  }
  function open(){
    schoolPanel.hidden=true;renderRecent();
    document.querySelector('#library-panel').hidden=true;
    document.querySelector('#settings-panel').hidden=true;
    phone.classList.remove('library-open','settings-open','settings-subpage');
    phone.classList.add('borrow-open');
    phone.dataset.appearance='light';
    panel.hidden=false;
    document.querySelector('#home-scroll').inert=true;
    document.querySelector('.phone>header').inert=true;
    nav.querySelectorAll('[data-nav]').forEach(button=>{
      const active=button.dataset.nav==='借聽';
      button.classList.toggle('selected',active);
      if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
      const names={'首頁':'house','我聽':'headphones','借聽':'armchair','設定':'user'};
      if(names[button.dataset.nav])button.querySelector('i').className=`${active?'ph-fill':'ph'} ph-${names[button.dataset.nav]}`;
    });
    if(!seen){
      background=[...phone.children].filter(el=>el!==welcome).map(el=>[el,el.inert]);
      background.forEach(([el])=>el.inert=true);
      welcome.hidden=false;
      start.focus({preventScroll:true});
    }else panel.querySelector('h1').focus({preventScroll:true});
  }
  nav.addEventListener('click',event=>{
    const button=event.target.closest('[data-nav]');
    if(!button)return;
    if(button.dataset.nav==='借聽'){open();return}
    if(!panel.hidden||!schoolPanel.hidden){
      schoolPanel.hidden=true;
      panel.hidden=true;phone.classList.remove('borrow-open');
      if(button.dataset.nav==='首頁'){
        document.querySelector('#home-scroll').inert=false;
        document.querySelector('.phone>header').inert=false;
      }
    }
  });
  close.onclick=dismiss;start.onclick=dismiss;
  welcome.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dismiss()}
    if(event.key==='Tab'){
      if(event.shiftKey&&document.activeElement===close){event.preventDefault();start.focus()}
      else if(!event.shiftKey&&document.activeElement===start){event.preventDefault();close.focus()}
    }
  });
  document.querySelector('#borrow-search').addEventListener('input',event=>{
    const query=event.target.value.trim();
    let matches=0;
    panel.querySelectorAll('[data-borrow-partner]').forEach(row=>{row.hidden=!row.textContent.includes(query);if(!row.hidden)matches++});
    document.querySelector('#borrow-no-results').hidden=matches>0;
    renderRecent();
  });
  panel.addEventListener('click',event=>{
    const info=event.target.closest('[data-borrow-info]');
    const enter=event.target.closest('[data-borrow-enter]');
    if(info)openInfo(info.dataset.borrowInfo,info);
    if(enter)openSchool(enter.dataset.borrowEnter,enter);
  });
  document.querySelector('#borrow-school-back').onclick=backToSchools;
  document.querySelector('#borrow-course-search').addEventListener('input',renderCourses);
  document.querySelector('#borrow-school-search-toggle').onclick=()=>{
    const label=document.querySelector('.borrow-course-search');label.hidden=!label.hidden;
    document.querySelector('#borrow-school-search-toggle').setAttribute('aria-expanded',!label.hidden);
    if(!label.hidden)document.querySelector('#borrow-course-search').focus();
    else{document.querySelector('#borrow-course-search').value='';renderCourses()}
  };
  document.querySelector('#borrow-school-account').onclick=()=>toast('此為借聽介面示範，尚未連接學校帳號服務');
  document.querySelector('#borrow-categories').addEventListener('click',event=>{const b=event.target.closest('[data-borrow-category]');if(b){category=b.dataset.borrowCategory;renderCourses();document.querySelector('#borrow-school-courses').scrollTop=0}});
  schoolPanel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();backToSchools()}});
})();
