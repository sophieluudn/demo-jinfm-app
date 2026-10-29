window.poetryIntroduction = `
<div class="intro-facts" aria-label="課程資訊">
  <div><i class="ph ph-list-bullets" aria-hidden="true"></i><span>共 61 集</span></div><div><i class="ph ph-calendar-blank" aria-hidden="true"></i><span>2019/09/06 上架</span></div>
  <div><i class="ph ph-clock" aria-hidden="true"></i><span>共 18 時 13 分</span></div><div><i class="ph ph-check-circle" aria-hidden="true"></i><span>全數已上架</span></div>
  <div><i class="ph ph-tag" aria-hidden="true"></i><span>文史哲</span></div><div><i class="ph ph-play" aria-hidden="true"></i><span>音頻類</span></div>
  <div><i class="ph ph-download-simple" aria-hidden="true"></i><span>無輔助資源</span></div><div><i class="ph ph-book-open" aria-hidden="true"></i><span>出版方：道善文化</span></div>
</div>
<section class="intro-section"><h2>內容簡介</h2><div class="intro-expandable intro-description" id="poetry-description">
  <p>古代的詩歌，就是今日的流行歌曲。從婚禮常見的誓詞「執子之手，與子偕老」；到不願輕易妥協於現實的「不為五斗米折腰」的抱負心，歎息「年年歲歲花相似，歲歲年年人不同」的人生感慨——古人透過詩歌，精鍊且帶有美感的訴說和現代人相仿的隱隱約約的那些心聲。</p>
  <p>臺大人氣教授歐麗娟老師，以新穎的詩歌解讀方式，透過《醉美古詩詞》系列課程，介紹跨越7個時代的詩歌特色與作品。</p>
</div><button class="intro-expand-button" aria-expanded="false" aria-controls="poetry-description">展開全部 <i class="ph ph-caret-down" aria-hidden="true"></i></button></section>
<section class="intro-section"><h2>單元介紹</h2><div class="intro-expandable intro-units" id="poetry-units">
  <h3>■ 分集內容</h3><p>・01：發刊詞：《醉美古詩詞》系列介紹</p><h4>【第一單元：神話】</h4>
  <ul><li>02：詩歌為什麼要從神話講起</li><li>03：創世神話：盤古開天、女媧補天</li><li>04：自然神話：牛郎織女</li><li>05：變形神話（上）兩種形體組合</li></ul>
</div><button class="intro-expand-button" aria-expanded="false" aria-controls="poetry-units">展開全部 <i class="ph ph-caret-down" aria-hidden="true"></i></button></section>
<section class="intro-section"><h2>購買須知</h2><div class="intro-expandable intro-purchase" id="poetry-purchase">
  <h4>【購買須知】</h4><p>本《醉美古詩詞》課程共60集內容，內容涵括上古~宋代詩歌作品，您可以全部擁有，或分系列分別購買。購買「系列（全）」將享有特殊優惠價499點，內容涵蓋「系列（一）~（三）」所有集數。</p>
  <p>［一次擁有全系列］</p><p>・系列（全）上古～宋代，共計60集。</p>
</div><button class="intro-expand-button" aria-expanded="false" aria-controls="poetry-purchase">展開全部 <i class="ph ph-caret-down" aria-hidden="true"></i></button></section>
<section class="intro-section intro-speaker"><h2>主講人</h2><div class="speaker-card"><img src="assets/poetry-speaker.jpg" alt="歐麗娟老師"><div><h3>歐麗娟</h3><p>臺灣大學中國文學系教授<br>獲2015年傑出教學者獎<br>臺大公開課人氣教師</p></div></div>
  <div class="intro-expandable intro-biography" id="poetry-biography"><p>臺大中文系歐麗娟教授主講的開放式課程《中國文學史》、《紅樓夢》廣受海內外華人追捧，創造詩歌與紅學品讀的熱潮，並於2015年榮獲全球開放教育聯盟「傑出開放教育獎」的「教學者獎」。</p><p>有別於傳統字句注釋的教學，歐麗娟教授擅長以深入淺出的方式，將詩歌中的情感還原，帶領聽者從現今穿越古代，理解古人書寫的情懷、真實的人性，進而聯結聽者自身，體察對生命的感動與嚮往。</p></div>
  <button class="intro-expand-button" aria-expanded="false" aria-controls="poetry-biography">展開全部 <i class="ph ph-caret-down" aria-hidden="true"></i></button>
</section>`;

window.renderCourseIntroduction = function(course, episodes) {
  if(course.img==='poetry')return window.poetryIntroduction;
  const safe=esc;
  const palace=course.img==='palace';
  const introduction=palace
    ?'以蘇東坡的書法作品為線索，從〈寒食帖〉、〈寶月帖〉到書信尺牘，認識作品的筆墨特色、創作背景，以及其中流露的人生情懷。'
    :`跟隨${course.author}，從「${course.desc||course.title}」出發，透過人物、作品與故事，逐步認識本課程的主題。`;
  const section=(id,title,body,kind)=>`<section class="intro-section"><h2>${title}</h2><div class="intro-expandable ${kind}" id="${id}">${body}</div><button class="intro-expand-button" aria-expanded="false" aria-controls="${id}">展開全部 <i class="ph ph-caret-down" aria-hidden="true"></i></button></section>`;
  return `<div class="intro-facts" aria-label="課程資訊"><div>${icon('list-bullets')}<span>共 ${course.episodes} 集</span></div><div>${icon('tag')}<span>${safe(course.category)}</span></div><div>${icon('play')}<span>${course.video?'影像類':'音頻類'}</span></div><div>${icon('user')}<span>${safe(course.author)}</span></div></div>`
    +section('course-description','內容簡介',`<p>${safe(introduction)}</p><p>每一段內容都可以搭配目錄分集閱讀，從不同角度整理觀點，並把課程中印象深刻的片段與自己的經驗相互對照。</p><p>您可以先透過精華試閱了解課程風格，再依照自己的步調探索各個單元。</p>`,'intro-description')
    +section('course-units','單元介紹',`<h3>■ 分集內容</h3><ul>${episodes.map((e,i)=>`<li>${String(i+1).padStart(2,'0')}：${safe(e[0])}</li>`).join('')}</ul>`,'intro-units')
    +section('course-purchase','購買須知',`<h4>【購買須知】</h4><p>《${safe(course.title)}》共 ${course.episodes} 集，購買價為 ${course.price} 點${course.old?`，原價 ${course.old} 點`:''}。</p><p>購買前可先查看課程簡介、分集目錄與精華試閱，確認內容符合您的學習需求。</p><p>課程提供的內容、集數與價格，請以課程頁面顯示資訊為準。</p>`,'intro-purchase')
    +`<section class="intro-section intro-speaker"><h2>主講人</h2><div class="speaker-card"><i class="ph ph-user-circle speaker-fallback" aria-hidden="true"></i><div><h3>${safe(course.author)}</h3><p>${safe(course.category)}・${course.video?'影像課程':'有聲課程'}</p></div></div><div class="intro-expandable intro-biography" id="course-biography"><p>本課程由${safe(course.author)}主講，從「${safe(course.title)}」的內容出發，帶領聽眾理解主題脈絡，並探索作品與生活之間的連結。</p><p>以循序漸進的方式聆聽、記錄與回顧，讓每次學習都能留下值得再思考的問題。</p><p class="intro-demo-note">此頁延伸文字為示範內容。</p></div><button class="intro-expand-button" aria-expanded="false" aria-controls="course-biography">展開全部 <i class="ph ph-caret-down" aria-hidden="true"></i></button></section>`;
};
