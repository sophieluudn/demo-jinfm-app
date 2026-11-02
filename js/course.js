(() => {
  const panel=document.querySelector('#course-panel');
  const scrollArea=document.querySelector('#course-scroll');
  const courseTitle=document.querySelector('#course-title');
  const headerFavorite=document.querySelector('#course-favorite');
  const catalog=document.querySelector('#course-catalog');
  const range=document.querySelector('#episode-range');
  const sort=document.querySelector('#episode-sort');
  const knownEpisodes=[
    ['【精華試聽】從赤壁到寒食：東坡書法之美與豁達心境','2025/06/27','04:17'],
    ['序論：蘇東坡的異想世界','2025/06/27','17:55'],
    ['天下第三，蘇書第一：〈寒食帖〉（上）','2025/06/27','27:07'],
    ['天下第三，蘇書第一：〈寒食帖〉（下）','2025/07/04','32:29'],
    ['鋒芒畢露，姿媚書風：〈寶月帖〉','2025/07/11','25:48'],
    ['風流瀟灑，豐厚開張：〈致運句太博尺牘〉','2025/07/18','22:58'],
    ['詩僧唱和，蘭亭法度：〈北游帖〉','2025/07/25','15:57']
  ];
  const eastWestEpisodes=[
    ['是騙局？是委屈？傳教士殷弘緒是商業間諜？','2022/04/15','02:25'],
    ['中國古美術走向世界的引水人？文物大盜盧芹齋','2022/04/15','09:49'],
    ['英國攝影師的晚清殘影——湯姆生東方尋奇','2022/04/15','08:36']
  ];
  let courseB2B=false,borrowSchool='';
  const borrowEpisodes=[
    ['皇帝、總統、將軍們的「幕後推手」','2020/01/07','11:30'],
    ['憤怒的臺灣青年在哪裡？','2020/01/07','12:07'],
    ['當代意見領袖：社會影響力的四個象限','2020/01/07','10:24']
  ];
  const borrowedCourses=new Set();
  const borrowKey=()=>borrowSchool+':'+selected?.img;
  function isOwned(){if(courseB2B)return borrowedCourses.has(borrowKey());try{return selected.img==='east-west'||JSON.parse(localStorage.getItem('jinfm-demo-purchases')||'[]').includes(selected.img)}catch{return selected.img==='east-west'}}
  const episodeAvailable=index=>isOwned()||(!courseB2B&&index===1);
  function refreshBorrow(){
    const borrowed=borrowedCourses.has(borrowKey()),available=borrowed?99:100;
    document.querySelector('#course-borrow-count').textContent=`可借 ${available}`;
    document.querySelector('#course-borrow').textContent=borrowed?'已借聽':`立即借聽 (${available})`;
    document.querySelector('#course-borrow').disabled=borrowed;
  }
  function currentEpisodes(course=selected){const known=course.img==='borrow/course-62'?borrowEpisodes:course.img==='palace'?knownEpisodes:course.img==='east-west'?eastWestEpisodes:[['【精華試聽】'+course.title,'2026/05/19','03:34']];return Array.from({length:Math.max(1,course.episodes)},(_,i)=>known[i]||[`單元 ${String(i+1).padStart(2,'0')}：${course.title}（示範）`,'2026/05/19','10:00'])}
  const mini=document.querySelector('#mini-player');
  const seek=document.querySelector('#mini-seek');
  let playback=null,playbackTimer,lastTick=0,currentTranscriptIndex=1,sleepTimeout=null,sleepAtEnd=false,autoplay=true;
  const formatTime=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
  function refreshPlayback(){
    mini.hidden=!playback;
    document.querySelector('.phone').classList.toggle('has-mini-player',!!playback);
    catalog.querySelectorAll('.episode').forEach(row=>{
      const button=row.querySelector('[data-episode]');
      const index=Number(button.dataset.episode);
      const active=!!playback&&playback.course===selected?.img&&playback.index===index;
      row.classList.toggle('episode-active',active);
      button.classList.toggle('is-playing',active&&playback.playing);
      const available=episodeAvailable(index);
      button.innerHTML=icon(active&&playback.playing?'pause':available?'play-circle':'lock-simple',active&&playback.playing||!available);
      button.setAttribute('aria-label',`${active&&playback.playing?'暫停':available?'播放本集':courseB2B?'尚未借聽':'尚未購買'}：${currentEpisodes()[index-1]?.[0]||''}`);
      const time=row.querySelector('.episode-meta>span');
      if(time)time.textContent=active?`${formatTime(playback.elapsed)}/${formatTime(playback.duration)}`:currentEpisodes()[index-1]?.[2]||'';
    });
    const transcriptPlaying=!!playback&&playback.course===selected?.img&&playback.index===currentTranscriptIndex&&playback.playing;
    document.querySelector('#transcript-play').innerHTML=icon(transcriptPlaying?'pause-circle':'play-circle');
    document.querySelector('#transcript-play').setAttribute('aria-label',transcriptPlaying?'暫停本集':'播放本集');
    if(!playback)return;
    document.querySelector('#mini-title').textContent=playback.title;
    document.querySelector('#mini-author').textContent=playback.author;
    document.querySelector('#mini-elapsed').textContent=formatTime(playback.elapsed);
    document.querySelector('#mini-duration').textContent=formatTime(playback.duration);
    seek.max=playback.duration;seek.value=Math.floor(playback.elapsed);
    seek.style.setProperty('--progress',`${playback.elapsed/playback.duration*100}%`);
    mini.classList.toggle('paused',!playback.playing);
    document.querySelector('#mini-toggle').setAttribute('aria-label',playback.playing?'暫停':'播放');
    document.querySelector('#mini-toggle').innerHTML=icon(playback.playing?'pause':'play',true);
    document.querySelector('#full-player-title').textContent=playback.title;
    document.querySelector('#full-player-author').textContent=playback.author;
    document.querySelector('#full-player-image').src=`assets/${playback.course}.jpg`;
    document.querySelector('#full-player-elapsed').textContent=formatTime(playback.elapsed);
    document.querySelector('#full-player-duration').textContent=formatTime(playback.duration);
    const fullSeek=document.querySelector('#full-player-seek');fullSeek.max=playback.duration;fullSeek.value=Math.floor(playback.elapsed);fullSeek.style.setProperty('--progress',`${playback.elapsed/playback.duration*100}%`);
    const fullToggle=document.querySelector('#full-player-toggle');fullToggle.setAttribute('aria-label',playback.playing?'暫停':'播放');fullToggle.innerHTML=icon(playback.playing?'pause':'play',true);
  }
  function runPlayback(){
    clearInterval(playbackTimer);lastTick=performance.now();
    if(!playback?.playing)return;
    playbackTimer=setInterval(()=>{
      const now=performance.now();
      playback.elapsed=Math.min(playback.duration,playback.elapsed+(now-lastTick)/1000*speeds[speedIndex]);lastTick=now;
      if(playback.elapsed>=playback.duration){playback.playing=false;clearInterval(playbackTimer);if(autoplay&&!sleepAtEnd){const course=playback.courseData;if(playback.index<course.episodes&&(playback.index+1===1||isOwned())){playEpisode(playback.index+1,course);return}}sleepAtEnd=false}
      refreshPlayback();
    },500);
  }
  function recordPlayback(){if(playback){const c=all.find(c=>c.img===playback.course)||window.searchCourses.find(c=>c.img===playback.course)||selected;window.dispatchEvent(new CustomEvent('demo-playback-start',{detail:{...c,episodeTitle:playback.title,duration:formatTime(playback.duration),elapsed:formatTime(playback.elapsed)}}))}}
  function togglePlayback(){if(!playback)return;if(playback.elapsed>=playback.duration)playback.elapsed=0;playback.playing=!playback.playing;runPlayback();refreshPlayback();recordPlayback()}
  function playEpisode(index,course=selected,preview=false){
    if(courseB2B&&course===selected&&!preview&&!isOwned()){toast('立即借聽後即可聆聽此集');return}
    if(index!==1&&!isOwned()){toast('購買課程後即可聆聽此集');return}
    if(playback?.course===course.img&&playback.index===index){togglePlayback();return}
    recordPlayback();const episode=currentEpisodes(course)[index-1];if(!episode)return;
    const [minutes,seconds]=episode[2].split(':').map(Number);
    playback={course:course.img,courseData:course,index,title:episode[0],author:course.author,duration:minutes*60+seconds,elapsed:0,playing:true};
    runPlayback();refreshPlayback();
    window.dispatchEvent(new CustomEvent('demo-playback-start',{detail:{...course,episodeTitle:episode[0],duration:episode[2],elapsed:'00:00'}}));
  }
  document.querySelector('#mini-toggle').onclick=togglePlayback;
  document.querySelector('#mini-close').onclick=()=>{recordPlayback();clearInterval(playbackTimer);playback=null;document.querySelector('#mini-extra-controls').hidden=true;document.querySelector('#mini-expand').setAttribute('aria-expanded','false');refreshPlayback()};
  seek.oninput=()=>{if(playback){playback.elapsed=Number(seek.value);lastTick=performance.now();refreshPlayback()}};
  const fullPlayer=document.querySelector('#full-player');
  document.querySelector('#mini-expand').onclick=()=>{fullPlayer.hidden=false;document.querySelector('#mini-expand').setAttribute('aria-expanded','true')};
  document.querySelector('#full-player-close').onclick=()=>{fullPlayer.hidden=true;document.querySelector('#mini-expand').setAttribute('aria-expanded','false')};
  document.querySelector('#full-player-toggle').onclick=togglePlayback;
  document.querySelector('#full-player-seek').oninput=e=>{if(playback){playback.elapsed=Number(e.target.value);lastTick=performance.now();refreshPlayback()}};
  document.querySelector('#full-player-share').onclick=()=>toast('分享課程');
  const speeds=[0.5,0.75,1,1.25,1.5,1.75,2];let speedIndex=2;
  function changeEpisode(offset){if(!playback)return;const course=all.find(c=>c.img===playback.course)||window.searchCourses.find(c=>c.img===playback.course)||selected;const next=playback.index+offset;if(next<1||next>course.episodes){toast('沒有其他集數');return}playEpisode(next,course)}
  document.querySelector('#full-player-prev').onclick=()=>changeEpisode(-1);
  document.querySelector('#full-player-next').onclick=()=>changeEpisode(1);
  function skip(seconds){if(playback){playback.elapsed=Math.max(0,Math.min(playback.duration,playback.elapsed+seconds));lastTick=performance.now();refreshPlayback()}}
  document.querySelector('#mini-rewind').onclick=()=>skip(-15);
  document.querySelector('#mini-forward').onclick=()=>skip(15);
  document.querySelector('#full-player-rewind').onclick=()=>skip(-15);
  document.querySelector('#full-player-forward').onclick=()=>skip(15);
  const completed=new Set(JSON.parse(localStorage.getItem('jinfm-demo-downloads')||'[]'));
  const progress=document.querySelector('#course-download-progress');
  let downloadTimer,finishTimer,job=null,favoriteTimer;
  function downloadKey(index){return selected.img+':'+index}
  function saveDownloads(){localStorage.setItem('jinfm-demo-downloads',JSON.stringify([...completed]));window.dispatchEvent(new Event('demo-downloads-changed'))}
  window.addEventListener('demo-downloads-changed',()=>{try{const values=JSON.parse(localStorage.getItem('jinfm-demo-downloads')||'[]');completed.clear();values.forEach(v=>completed.add(v));if(selected)renderCatalog()}catch{}});
  function updateProgress(){
    progress.hidden=!job||job.course!==selected.img;
    if(!job)return;
    document.querySelector('#download-progress-text').textContent=`下載中 ${job.done} / ${job.queue.length}`;
    document.querySelector('#download-progress-fill').style.transform='scaleX('+((job.done+job.percent/100)/job.queue.length)+')';
    document.querySelector('#course-delete-downloads').disabled=![...completed].some(key=>key.startsWith(selected.img+':'));
    refreshPlayback();
  }
  function cancelDownload(){clearInterval(downloadTimer);job=null;progress.hidden=true;renderCatalog()}
  function startDownload(indices){
    if(job){toast('已有下載進行中，請先取消或等待完成');return}
    const queue=indices.filter(index=>!completed.has(downloadKey(index)));
    if(!queue.length){toast(indices.length?'本頁音頻已下載':'購買課程後即可下載此頁音頻');return}
    clearTimeout(finishTimer);job={course:selected.img,queue,done:0,percent:0};renderCatalog();updateProgress();
    downloadTimer=setInterval(()=>{
      if(!job)return;
      job.percent+=4;
      if(job.percent>=100){
        completed.add(job.course+':'+job.queue[job.done]);saveDownloads();job.done++;job.percent=0;
        if(job.done===job.queue.length){clearInterval(downloadTimer);const course=job.course;job=null;progress.hidden=true;if(selected.img===course){renderCatalog();toast('下載完成')}return}
        if(job.course===selected.img)renderCatalog();
      }
      updateProgress();
    },240);
  }
  let selected,opener,descending=false,backgroundState=[];
  const background=()=>[...document.querySelectorAll('.phone>header,#home-scroll,.bottom-nav,#search-panel,#library-panel,#settings-panel,#borrow-panel,#borrow-school-panel,#category-list-panel,#category-directory-panel,#topic-panel,#subscription-area')];
  function syncFavorite(){headerFavorite.setAttribute('aria-pressed',saved.has(selected.img));headerFavorite.innerHTML=icon('heart',saved.has(selected.img))}
  function renderCatalog(){
    const episodes=currentEpisodes();
    let indexed=episodes.map((e,i)=>({title:e[0],date:e[1],duration:e[2],index:i+1}));
    indexed=indexed.slice(Number(range.value)||0,(Number(range.value)||0)+20);
    if(descending)indexed.reverse();
    catalog.innerHTML=indexed.length?indexed.map(e=>{
      const available=episodeAvailable(e.index);
      const downloading=job?.course===selected.img&&job.queue[job.done]===e.index;
      const downloaded=completed.has(downloadKey(e.index));
      return `<article class="episode"><button class="episode-status ${available?'preview':''}" data-episode="${e.index}" aria-label="${available?'播放本集':courseB2B?'尚未借聽':'尚未購買'}：${esc(e.title)}">${icon(available?'play-circle':'lock-simple',!available)}</button><div class="episode-main"><h2>${String(e.index).padStart(2,'0')} ${esc(e.title)}</h2><div class="episode-meta"><time>${e.date}</time>${icon('play')}<span>${e.duration}</span>${available?`<div class="episode-actions"><button class="${downloading?'downloading':downloaded?'downloaded':''}" data-course-audio="${e.index}" aria-label="${downloading?'取消下載':downloaded?'已下載':'下載音頻'}：${esc(e.title)}">${icon(downloading?'stop-circle':downloaded?'check-circle':'download-simple')}</button><button data-course-transcript="${e.index}" aria-label="開啟文稿：${esc(e.title)}">${icon('article')}</button></div>`:''}</div></div></article>`;
    }).join(''):'<p class="catalog-empty">此範圍沒有課程單元</p>';
    document.querySelector('#course-delete-downloads').disabled=![...completed].some(key=>key.startsWith(selected.img+':'));
    refreshPlayback();
  }
  function switchTab(name){
    const isCatalog=name==='catalog';
    panel.classList.toggle('course-show-intro',!isCatalog);
    document.querySelector('#course-catalog-tab').setAttribute('aria-selected',isCatalog);
    document.querySelector('#course-intro-tab').setAttribute('aria-selected',!isCatalog);
    catalog.hidden=!isCatalog;document.querySelector('#course-catalog-tools').hidden=!isCatalog;
    document.querySelector('#course-intro').hidden=isCatalog;
  }
  function openCourse(id,button){
    selected=all.find(c=>c.img===id)||window.searchCourses.find(c=>c.img===id);if(!selected)return;
    courseB2B=!!button?.closest('#borrow-school-panel');
    borrowSchool=courseB2B?document.querySelector('#borrow-school-panel').dataset.school:'';
    panel.classList.toggle('course-2b',courseB2B);
    document.querySelector('#course-borrow').hidden=!courseB2B;
    document.querySelector('#course-borrow-availability').hidden=!courseB2B;
    if(courseB2B)refreshBorrow();
    opener=button;panel.hidden=false;backgroundState=background().map(el=>[el,el.inert]);background().forEach(el=>el.inert=true);
    document.querySelector('.phone').classList.add('course-open');
    panel.classList.toggle('course-owned',isOwned());
    document.querySelector('#course-buy').disabled=isOwned();
    range.closest('label').hidden=selected.episodes<=20;
    courseTitle.textContent=selected.title;document.querySelector('#course-nav-title').textContent=selected.title;
    document.querySelector('#course-cover').src=`assets/${id==='palace'?'course-palace':id==='poetry'?'course-poetry':id==='east-west'?'course-east-west':id}.jpg`;
    document.querySelector('#course-cover').alt=selected.title+'課程封面';
    document.querySelector('#course-subtitle').textContent=id==='palace'?'故宮開講 x 國寶發聲(一)書法篇':id==='east-west'?'歷史上東西方文化碰撞的時刻':selected.desc||'';
    document.querySelector('#course-type').textContent=selected.video?'影像':'聲音';
    document.querySelector('#course-price').textContent=selected.price+'點';
    document.querySelector('#course-old-price').textContent=selected.old?selected.old+'點':'';
    document.querySelector('#course-intro').classList.add('poetry-intro');
    document.querySelector('#course-intro').innerHTML=window.renderCourseIntroduction(selected,currentEpisodes());
    range.innerHTML=Array.from({length:Math.ceil(Math.max(1,selected.episodes)/20)},(_,i)=>`<option value="${i*20}">${i*20+1}–${Math.min((i+1)*20,Math.max(1,selected.episodes))}</option>`).join('');range.value='0';descending=false;sort.setAttribute('aria-pressed','false');

    document.querySelector('#course-download-size').hidden=id!=='palace';
    if(id==='east-west'){document.querySelector('#course-download-size').hidden=false;document.querySelector('#course-download-size').textContent='47 MB'}
    else document.querySelector('#course-download-size').textContent='237 MB';
    if(courseB2B){document.querySelector('#course-download-size').hidden=false;document.querySelector('#course-download-size').textContent='38 MB'}
    syncFavorite();renderCatalog();switchTab(id==='poetry'?'intro':'catalog');scrollArea.scrollTop=0;
    panel.classList.remove('course-is-scrolled');document.querySelector('#course-back').focus({preventScroll:true});
    updateProgress();
  }
  function closeCourse(){panel.hidden=true;document.querySelector('.phone').classList.remove('course-open');backgroundState.forEach(([el,wasInert])=>el.inert=wasInert);opener?.focus({preventScroll:true})}
  document.addEventListener('click',e=>{
    const play=e.target.closest('[data-library-play]');
    if(play){const course=all.find(c=>c.img===play.dataset.libraryPlay)||window.searchCourses.find(c=>c.img===play.dataset.libraryPlay);if(course)playEpisode(1,course);return}
    const button=e.target.closest('[data-course]');if(button)openCourse(button.dataset.course,button);
  });
  document.querySelector('#course-back').onclick=closeCourse;
  headerFavorite.onclick=()=>{
    saved.has(selected.img)?saved.delete(selected.img):saved.add(selected.img);
    localStorage.setItem('jinfm-favorites',JSON.stringify([...saved]));syncFavorite();
    const popup=document.querySelector('#course-favorite-toast');
    popup.querySelector('span').textContent=saved.has(selected.img)?'已加入收藏':'已取消收藏';
    popup.hidden=false;clearTimeout(favoriteTimer);favoriteTimer=setTimeout(()=>popup.hidden=true,1800);
    document.querySelectorAll(`[data-favorite="${selected.img}"]`).forEach(b=>{b.setAttribute('aria-pressed',saved.has(selected.img));b.innerHTML=b.closest('#search-results')?`<img src="assets/btn_collect_${saved.has(selected.img)?'on':'off'}.png" alt="">`:icon('heart',saved.has(selected.img))});
  };
  document.querySelector('#course-share').onclick=async()=>{try{await navigator.clipboard.writeText(selected.title);toast('已複製課程名稱')}catch{toast('請稍後再試')}};
  function selectCourseTab(name){
    const wasScrolled=scrollArea.scrollTop>0;
    switchTab(name);
    if(wasScrolled){
      const contentTop=document.querySelector('#course-cover').offsetHeight+document.querySelector('.course-overview').offsetHeight;
      scrollArea.scrollTo({top:contentTop,behavior:'instant'});
    }
  }
  document.querySelector('#course-intro-tab').onclick=()=>selectCourseTab('intro');document.querySelector('#course-catalog-tab').onclick=()=>selectCourseTab('catalog');
  range.onchange=renderCatalog;
  sort.onclick=()=>{descending=!descending;sort.setAttribute('aria-pressed',descending);sort.setAttribute('aria-label',descending?'正序排列目錄':'倒序排列目錄');renderCatalog()};
  scrollArea.addEventListener('scroll',()=>panel.classList.toggle('course-is-scrolled',scrollArea.scrollTop>300),{passive:true});
  panel.addEventListener('click',e=>{
    const expand=e.target.closest('.intro-expand-button');
    if(expand){
      const content=document.getElementById(expand.getAttribute('aria-controls'));
      const expanded=expand.getAttribute('aria-expanded')!=='true';
      expand.setAttribute('aria-expanded',expanded);content.classList.toggle('expanded',expanded);
      expand.innerHTML=(expanded?'收合':'展開全部')+' '+icon('caret-down');
      if(!expanded){const top=content.getBoundingClientRect().top-scrollArea.getBoundingClientRect().top+scrollArea.scrollTop;scrollArea.scrollTo({top:Math.max(0,top-48),behavior:'smooth'})}
      return;
    }
    const episode=e.target.closest('[data-episode]');
    if(episode)playEpisode(Number(episode.dataset.episode));
    const audio=e.target.closest('[data-course-audio]');
    if(audio){const index=Number(audio.dataset.courseAudio);if(job?.course===selected.img&&job.queue[job.done]===index)cancelDownload();else if(completed.has(downloadKey(index)))toast('此音頻已下載');else startDownload([index])}
    if(e.target.closest('#course-download-all')){
      const downloadable=currentEpisodes().map((_,i)=>i+1).slice(Number(range.value)||0,(Number(range.value)||0)+20).filter(episodeAvailable);
      if(!downloadable.length){toast('立即借聽後即可下載音頻');return}
      startDownload(downloadable);
    }
    const transcript=e.target.closest('[data-course-transcript]');
    if(transcript)openTranscript(Number(transcript.dataset.courseTranscript),transcript);
  });
  document.querySelector('#download-cancel').onclick=cancelDownload;
  document.querySelector('#course-delete-downloads').onclick=()=>{for(const key of [...completed])if(key.startsWith(selected.img+':'))completed.delete(key);saveDownloads();renderCatalog();toast('已刪除本課程的下載音頻')};
  const transcriptPanel=document.querySelector('#transcript-panel');
  let transcriptOpener;
  function openTranscript(index,button){
    currentTranscriptIndex=index;
    transcriptOpener=button;const episode=currentEpisodes()[index-1];
    document.querySelector('#transcript-title').textContent=episode[0];
    document.querySelector('#transcript-author').textContent=selected.author;
    document.querySelector('#transcript-body').innerHTML=selected.img==='east-west'&&index===1?`<p>「景德鎮有一萬八千戶人家，有些富商巨賈佔據著寬敞的宅院，內有大批工人。因此，人們都說全鎮有一百多萬人口，每天消耗一萬多擔大米和一千多頭豬。景德鎮坐落在一條美麗的河邊，延伸長度足有一法里。它並不是人們想像中的房屋群落，街道如一根根墨線似的筆直延伸，隔一段距離便縱橫交錯。城中沒有空地，房屋顯得太擠，街道也太窄，穿行其間猶如置身鬧市，四周盡是找夫佣要人讓道的吆喝聲，那裡還有許多耗資巨大的崇拜偶像的廟宇。」</p><p>這是一位法國神父眼中的景德鎮，時間則是清康熙時代，這位神父的中文名字是殷弘緒，是一位耶穌會的教士，關於他的出身有兩種說法，一說在里昂，另一說則是法國的瓷器之都利摩日，他在青年時進入亞維農的修道院，後來成為耶穌會的會士。</p><h2>想進耶穌會，智慧是裝備！</h2><p>從瓷器製作的觀察到文化交流的記錄，我們可以換個角度，理解東西方相遇時的好奇與誤解。</p><p class="transcript-demo">後續段落為示範文稿。</p>`:`<p>歡迎收聽「${esc(selected.title)}」。本集由${esc(selected.author)}帶領我們一起探索「${esc(episode[0])}」。</p><p>透過作品、人物與時代背景的交互對照，我們將從不同角度理解課程主題，並思考它與日常生活的連結。</p><h2>從觀察開始，建立自己的理解</h2><p>請隨著課程的節奏，記下印象深刻的觀點。再次閱讀時，可以比較自己的想法，整理出新的問題。</p><p class="transcript-demo">此頁為示範文稿，供模擬閱讀操作。</p>`;
    transcriptPanel.hidden=false;panel.inert=true;document.querySelector('.phone').classList.add('transcript-open');
    document.querySelector('#transcript-content').scrollTop=0;document.querySelector('#transcript-back').focus({preventScroll:true});
    refreshPlayback();
  }
  function closeTranscript(){transcriptPanel.hidden=true;panel.inert=false;document.querySelector('.phone').classList.remove('transcript-open');transcriptOpener?.focus({preventScroll:true})}
  document.querySelector('#transcript-back').onclick=closeTranscript;
  document.querySelector('#transcript-play').onclick=()=>playEpisode(currentTranscriptIndex);
  const phone=document.querySelector('.phone');
  const playerSheet=document.createElement('div');playerSheet.id='player-sheet';playerSheet.hidden=true;playerSheet.innerHTML='<div class="player-sheet-backdrop"></div><div class="player-sheet-wrap"><div class="player-sheet-card"><div class="player-sheet-title"></div><div class="player-sheet-options"></div></div><button class="player-sheet-close">關閉</button></div>';phone.append(playerSheet);
  const sheetTitle=playerSheet.querySelector('.player-sheet-title'),sheetOptions=playerSheet.querySelector('.player-sheet-options');
  let sleepChoice='關閉定時';
  function hidePlayerSheet(){playerSheet.hidden=true}
  playerSheet.querySelector('.player-sheet-close').onclick=hidePlayerSheet;playerSheet.querySelector('.player-sheet-backdrop').onclick=hidePlayerSheet;
  function showPlayerSheet(kind){
    sheetTitle.textContent=kind;sheetOptions.innerHTML='';
    if(kind==='播放設定'){
      const row=document.createElement('button');row.className='player-sheet-row';row.innerHTML=`<span>自動播放</span><span class="player-switch ${autoplay?'on':''}" aria-hidden="true"></span>`;row.setAttribute('role','switch');row.setAttribute('aria-checked',String(autoplay));row.onclick=()=>{autoplay=!autoplay;row.setAttribute('aria-checked',String(autoplay));row.querySelector('.player-switch').classList.toggle('on',autoplay)};sheetOptions.append(row);
    }else{
      const options=kind==='倍速播放'?speeds.map(s=>({label:s===1?'1x（正常倍速）':`${s===2?'2.0':s}x`,value:s})):['10分鐘','20分鐘','30分鐘','播完當集音頻','自定義','關閉定時'].map(label=>({label,value:label}));
      options.forEach(({label,value})=>{const row=document.createElement('button');row.className='player-sheet-row';const checked=kind==='倍速播放'?speeds[speedIndex]===value:sleepChoice===value;row.innerHTML=`<span>${label}</span>${checked?'<span class="player-check">✓</span>':''}`;row.onclick=()=>{
        if(kind==='倍速播放'){speedIndex=speeds.indexOf(value);lastTick=performance.now();document.querySelector('#full-player-speed span').textContent=`${value}x`;hidePlayerSheet();return}
        let minutes=parseInt(value,10);if(value==='自定義'){const input=window.prompt('請輸入定時分鐘數','45');if(input===null)return;minutes=Number(input);if(!Number.isFinite(minutes)||minutes<=0){toast('請輸入有效的分鐘數');return}}
        clearTimeout(sleepTimeout);sleepAtEnd=value==='播完當集音頻';sleepChoice=value;if(Number.isFinite(minutes))sleepTimeout=setTimeout(()=>{if(playback?.playing)togglePlayback();sleepChoice='關閉定時';sleepAtEnd=false},minutes*60000);hidePlayerSheet();
      };sheetOptions.append(row)});
    }
    playerSheet.hidden=false;
  }
  document.querySelector('[data-player-tool="睡眠定時"]').onclick=()=>showPlayerSheet('睡眠定時');
  document.querySelector('#full-player-speed').onclick=()=>showPlayerSheet('倍速播放');
  document.querySelector('[data-player-tool="播放設定"]').onclick=()=>showPlayerSheet('播放設定');
  document.querySelector('[data-player-tool="文稿"]').onclick=()=>{
    if(!playback)return;
    if(panel.hidden||selected?.img!==playback.course)openCourse(playback.course,document.querySelector('#mini-expand'));
    fullPlayer.hidden=true;document.querySelector('#mini-expand').setAttribute('aria-expanded','false');openTranscript(playback.index,document.querySelector('#course-back'));
  };
  const playlist=document.createElement('section');playlist.id='player-playlist';playlist.hidden=true;playlist.setAttribute('aria-label','目錄');playlist.innerHTML='<div class="player-list-header"><button class="player-list-back" aria-label="返回播放器"><i class="ph ph-caret-left"></i></button><h2>目錄</h2><button class="player-list-sort" aria-label="切換排序"><i class="ph ph-sort-ascending"></i></button></div><div class="player-list-content"></div>';phone.append(playlist);
  let playlistDescending=false;
  function renderPlaylist(){const course=playback.courseData;const rows=currentEpisodes(course).map((episode,i)=>({episode,index:i+1}));if(playlistDescending)rows.reverse();playlist.querySelector('.player-list-content').innerHTML=rows.map(({episode,index})=>{const active=index===playback.index,available=index===1||(selected?.img===course.img&&isOwned());return `<button class="player-list-row ${active?'active':''}" data-player-episode="${index}"><span class="player-list-icon">${icon(active&&playback.playing?'speaker-high':available?'play-circle':'lock-simple',active||!available)}</span><span><span class="player-list-name">${String(index).padStart(2,'0')}　${esc(episode[0])}</span><span class="player-list-meta">${esc(episode[1])}　▷ ${esc(episode[2])}</span></span></button>`}).join('')}
  document.querySelector('[data-player-tool="播放列表"]').onclick=()=>{if(playback){renderPlaylist();playlist.hidden=false}};
  playlist.querySelector('.player-list-back').onclick=()=>{playlist.hidden=true};
  playlist.querySelector('.player-list-sort').onclick=()=>{playlistDescending=!playlistDescending;renderPlaylist()};
  playlist.querySelector('.player-list-content').onclick=e=>{const row=e.target.closest('[data-player-episode]');if(!row||!playback)return;const index=Number(row.dataset.playerEpisode);if(index!==1&&!(selected?.img===playback.course&&isOwned())){toast('購買課程後即可聆聽此集');return}playEpisode(index,playback.courseData);renderPlaylist()};
  document.querySelector('#course-trial').onclick=()=>playEpisode(1,selected,true);
  document.querySelector('#course-borrow').onclick=()=>{
    if(!courseB2B||borrowedCourses.has(borrowKey()))return;
    borrowedCourses.add(borrowKey());refreshBorrow();renderCatalog();
    toast('已借聽，可在目錄播放課程');
  };
  window.addEventListener('demo-purchased',e=>{if(selected?.img===e.detail.id){panel.classList.add('course-owned');document.querySelector('#course-buy').disabled=true;renderCatalog()}});
  document.querySelector('#course-buy').onclick=()=>window.dispatchEvent(new CustomEvent('course-purchase',{detail:{course:selected}}));
  document.querySelector('#course-gift').onclick=()=>window.dispatchEvent(new CustomEvent('course-gift',{detail:{course:selected}}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!transcriptPanel.hidden)closeTranscript();else if(e.key==='Escape'&&!panel.hidden)closeCourse()});
})();
