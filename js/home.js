const sections=window.homeSections;
const topicTitleKey=title=>title.replace(/[\s｜|]/g,'');
sections.forEach(section=>{
  const topic=window.topicData?.find(item=>topicTitleKey(item.title)===topicTitleKey(section[0]));
  if(topic){section[3]=topic.courses;section[4]=topic.hasMore}
});
const saved=new Set(JSON.parse(localStorage.getItem('jinfm-favorites')||'[]'));
const icon=(name,fill=false)=>`<i class="${fill?'ph-fill':'ph'} ph-${name}" aria-hidden="true"></i>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all=[...new Map(sections.flatMap(s=>s[3]).map(c=>[c.img,c])).values()];
all.push(window.bannerCourse);
function card(c){return `<article class="card"><button class="cover-button" data-course="${c.img}" aria-label="查看${esc(c.title)}"><img class="cover" src="assets/${c.img}.jpg" alt="${esc(c.title)}課程封面" loading="lazy"></button><div class="card-body"><h3 class="title"><span class="tag ${c.video?'video':''}">${c.video?'影像':'聲音'}</span>${esc(c.title)}</h3><p class="desc">${esc(c.desc||'')}</p><p class="author"><img class="avatar" src="assets/${c.img}-avatar.jpg" alt="">${esc(c.author)}</p><div class="episodes">${c.episodes}集</div><p class="price">${c.price}點${c.old>c.price?`<del>${c.old}點</del>`:''}</p><div class="card-actions"><span class="category">${c.category}</span><button class="favorite" data-favorite="${c.img}" aria-label="收藏${esc(c.title)}" aria-pressed="${saved.has(c.img)}">${icon('heart',saved.has(c.img))}</button>${!c.video?`<button class="play" data-course="${c.img}" aria-label="試聽${esc(c.title)}">${icon('play-circle')}</button>`:''}</div></div></article>`}
let category='全部';
function render(){document.querySelector('#sections').innerHTML=sections.map(([title,sub,compact,courses,hasMore],index)=>{const list=courses.filter(c=>category==='全部'||c.category===category);return list.length?`<section class="section ${compact?'compact':''}"><div class="section-heading"><button data-section="${index}">${title}${icon('caret-right')}</button><p>${sub}</p></div><div class="rail" aria-label="${esc(title)}課程">${list.map(card).join('')}${hasMore?`<button class="rail-see-more" data-section="${index}" aria-label="看更多${esc(title)}">看更多</button>`:''}</div></section>`:''}).join('')||'<p>這個分類目前沒有課程</p>'}
document.querySelector('.filters').innerHTML=['全部', '文史哲', '商業管理', '休閒生活', '樂活運動', '心理成長', '語言學習', '寵物飼養', '失智專科', '疾病照護'].map((x,i)=>`<button class="${i===0?'active':''}" aria-pressed="${i===0}">${x}</button>`).join('');
document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;category=b.textContent;document.querySelectorAll('.filters button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});window.openCategoryList?.(category)});
let timer;function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('visible'),2600)}
document.addEventListener('click',e=>{const favorite=e.target.closest('[data-favorite]');if(favorite){const id=favorite.dataset.favorite;saved.has(id)?saved.delete(id):saved.add(id);localStorage.setItem('jinfm-favorites',JSON.stringify([...saved]));document.querySelectorAll(`[data-favorite="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',saved.has(id));b.innerHTML=b.closest('#search-results')?`<img src="assets/btn_collect_${saved.has(id)?'on':'off'}.png" alt="">`:icon('heart',saved.has(id))});toast(saved.has(id)?'已加入收藏':'已取消收藏');return}if(e.target.closest('[data-course]'))return;const notice=e.target.closest('[data-notice]');if(notice)toast(notice.dataset.notice);const nav=e.target.closest('[data-nav]');if(nav){if(nav.dataset.nav==='首頁')document.querySelector('#home-scroll').scrollTo({top:0,behavior:'smooth'});}const section=e.target.closest('[data-section]');if(section)window.openTopicList?.(Number(section.dataset.section),section)});
const scroll=document.querySelector('#home-scroll');scroll.addEventListener('scroll',()=>{const phone=document.querySelector('.phone');if(scroll.scrollTop>90&&!phone.classList.contains('scrolled'))phone.classList.add('scrolled');else if(scroll.scrollTop<10)phone.classList.remove('scrolled')},{passive:true});

const filters=document.querySelector('.filters');
let filterDrag=null,filterDragged=false;
filters.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0)return;
  filterDragged=false;
  filterDrag={id:event.pointerId,x:event.clientX,scroll:filters.scrollLeft};
});
filters.addEventListener('pointermove',event=>{
  if(!filterDrag||event.pointerId!==filterDrag.id)return;
  const delta=event.clientX-filterDrag.x;
  if(!filterDragged&&Math.abs(delta)<6)return;
  filterDragged=true;filters.classList.add('dragging');
  if(!filters.hasPointerCapture(event.pointerId))filters.setPointerCapture(event.pointerId);
  filters.scrollLeft=filterDrag.scroll-delta;
  event.preventDefault();
});
function endFilterDrag(){filterDrag=null;filters.classList.remove('dragging')}
filters.addEventListener('pointerup',endFilterDrag);
filters.addEventListener('pointercancel',()=>{endFilterDrag();filterDragged=false});
filters.addEventListener('lostpointercapture',endFilterDrag);
filters.addEventListener('click',event=>{
  if(filterDragged){event.preventDefault();event.stopImmediatePropagation();filterDragged=false}
},true);
render();
