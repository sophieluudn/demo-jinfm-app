const panel=document.querySelector('#search-panel');
const input=panel.querySelector('input');
const searchEmpty=document.querySelector('#search-empty');
const searchContent=document.querySelector('#search-content');
const keyboard=document.querySelector('#search-keyboard');
const clearButton=document.querySelector('#search-clear');
const defaultSort=document.querySelector('#sort-default');
const priceSort=document.querySelector('#sort-price');
const searchCatalog=[...window.searchCourses,...all];
let resultItems=[],resultQuery='',resultTotal=0,sortOrder='default';
function resultRow(c){
  return `<article class="search-result"><button class="result-cover" data-course="${esc(c.img)}" aria-label="查看${esc(c.title)}"><img src="assets/${c.img}.jpg" alt="${esc(c.title)}課程封面"></button><div class="result-info"><h2><span class="tag ${c.video?'video':''}">${c.video?'影像':'聲音'}</span>${esc(c.title)}</h2><p class="result-author">${esc(c.author)}</p><p class="result-episodes">${c.episodes}集</p><div class="result-bottom"><p class="price">${c.price}點${c.old?`<del>${c.old}點</del>`:''}</p><button class="favorite" data-favorite="${esc(c.img)}" aria-label="收藏${esc(c.title)}" aria-pressed="${saved.has(c.img)}"><img src="assets/btn_collect_${saved.has(c.img)?'on':'off'}.png" alt=""></button><button class="result-play" data-course="${esc(c.img)}" aria-label="試聽${esc(c.title)}"><img src="assets/btn_list_play.png" alt=""></button></div></div></article>`;
}
function updateInput(){
  clearButton.hidden=!input.value;
  keyboard.querySelector('[data-key="search"]').disabled=!input.value.trim();
}
function renderResults(){
  const rows=[...resultItems];
  if(sortOrder!=='default')rows.sort((a,b)=>sortOrder==='ascending'?a.price-b.price:b.price-a.price);
  document.querySelector('#search-results').innerHTML=rows.length?rows.map(resultRow).join(''):'<p class="no-results">找不到符合的內容<br><span>試試其他關鍵字或主講老師名稱</span></p>';
  document.querySelector('#search-summary').innerHTML=`搜尋<strong>${esc(resultQuery)}</strong>結果 <span>共 ${resultTotal} 筆</span>`;
  defaultSort.classList.toggle('active',sortOrder==='default');
  defaultSort.setAttribute('aria-pressed',sortOrder==='default');
  priceSort.classList.toggle('active',sortOrder!=='default');
  priceSort.setAttribute('aria-pressed',sortOrder!=='default');
  priceSort.setAttribute('aria-label',sortOrder==='ascending'?'依價格由高到低排序':'依價格由低到高排序');
  priceSort.querySelector('img').hidden=sortOrder!=='default';
  priceSort.querySelector('.sort-direction')?.remove();
  if(sortOrder!=='default')priceSort.insertAdjacentHTML('beforeend',`<i class="ph ph-${sortOrder==='ascending'?'caret-up':'caret-down'} sort-direction" aria-hidden="true"></i>`);
}
function showResults(list,query='',total=list.length){
  resultItems=list;resultQuery=query;resultTotal=total;sortOrder='default';
  searchEmpty.hidden=true;keyboard.hidden=true;searchContent.hidden=false;
  panel.classList.add('has-results');renderResults();panel.scrollTop=0;
}
function emptySearch(){
  searchEmpty.hidden=false;searchContent.hidden=true;keyboard.hidden=false;
  panel.classList.remove('has-results');updateInput();
}
function openSearch(){
  panel.hidden=false;document.querySelector('.phone').classList.add('searching');
  input.value='';emptySearch();input.focus();
}
function closeSearch(){
  panel.hidden=true;document.querySelector('.phone').classList.remove('searching');
  input.value='';document.querySelector('#search-open').focus();
}
function search(){
  const q=input.value.trim();if(!q){emptySearch();return;}
  const normalized=q.toLocaleLowerCase();
  const list=searchCatalog.filter(c=>(c.title+c.author+c.category+(c.keywords||'')).toLocaleLowerCase().includes(normalized));
  // The provided screenshot states 151 matches; these five rows reproduce its visible demo data.
  showResults(list,q,q==='快樂'?151:list.length);input.blur();
}
document.querySelector('#search-open').onclick=openSearch;
document.querySelector('#more-button').onclick=()=>{openSearch();showResults(all)};
document.querySelector('#search-close').onclick=closeSearch;
clearButton.onclick=()=>{input.value='';emptySearch();input.focus()};
input.addEventListener('input',()=>{updateInput();if(!input.value.trim())emptySearch()});
document.querySelector('#search-form').onsubmit=e=>{e.preventDefault();search()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closeSearch()});
defaultSort.onclick=()=>{sortOrder='default';renderResults()};
priceSort.onclick=()=>{sortOrder=sortOrder==='ascending'?'descending':'ascending';renderResults()};
let uppercase=true,numeric=false;
function keyboardLetters(){keyboard.querySelectorAll('[data-letters]').forEach(row=>{
  const letters=numeric?({'QWERTYUIOP':'1234567890','ASDFGHJKL':'-/:;()$&@','ZXCVBNM':'.?!,\'"+'}[row.dataset.letters]):row.dataset.letters;
  row.innerHTML=[...letters].map(letter=>`<button type="button" data-letter="${esc(letter)}">${esc(uppercase?letter:letter.toLowerCase())}</button>`).join('');
})}
keyboardLetters();
keyboard.addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.preventDefault()});
keyboard.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const key=b.dataset.key;
  if(b.dataset.letter)input.value+=uppercase?b.dataset.letter:b.dataset.letter.toLowerCase();
  else if(key==='search'){search();return}
  else if(key==='backspace')input.value=[...input.value].slice(0,-1).join('');
  else if(key==='space')input.value+=' ';
  else if(key==='shift'){uppercase=!uppercase;keyboardLetters()}
  else if(key==='numbers'){numeric=!numeric;b.textContent=numeric?'ABC':'123';keyboardLetters()}
  else if(key==='language'){input.value='快樂'}
  else if(key==='microphone'){toast('請使用裝置鍵盤的語音輸入');return}
  updateInput();input.focus();
});
