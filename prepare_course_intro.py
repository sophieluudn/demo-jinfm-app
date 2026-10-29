from pathlib import Path
from PIL import Image
root=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
Image.open(next(root.glob('04_*Tab簡介1*'))).crop((0,166,590,500)).save('assets/course-poetry.jpg',quality=96)
Image.open(next(root.glob('04_*Tab簡介5*'))).crop((22,333,160,471)).save('assets/poetry-speaker.jpg',quality=96)
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('<link rel="stylesheet" href="css/course.css">','<link rel="stylesheet" href="css/course.css"><link rel="stylesheet" href="css/course-intro.css">').replace('<script src="js/course.js"></script>','<script src="js/course-intro.js"></script><script src="js/course.js"></script>');p.write_text(s,encoding='utf-8')
p=Path('js/course.js');s=p.read_text(encoding='utf-8')
s=s.replace("const isCatalog=name==='catalog';","const isCatalog=name==='catalog';\n    panel.classList.toggle('course-show-intro',!isCatalog);")
s=s.replace("id==='palace'?'course-palace':id", "id==='palace'?'course-palace':id==='poetry'?'course-poetry':id")
old="document.querySelector('#course-intro').innerHTML=`<h2>${esc(selected.title)}</h2><p>${esc(selected.desc||'')}</p><p>主講老師：${esc(selected.author)}</p><p>共 ${selected.episodes} 集</p>`;"
new="document.querySelector('#course-intro').classList.toggle('poetry-intro',id==='poetry');\n    document.querySelector('#course-intro').innerHTML=id==='poetry'?window.poetryIntroduction:`<h2>${esc(selected.title)}</h2><p>${esc(selected.desc||'')}</p><p>主講老師：${esc(selected.author)}</p><p>共 ${selected.episodes} 集</p>`;"
assert old in s;s=s.replace(old,new).replace("syncFavorite();renderCatalog();switchTab('catalog');", "syncFavorite();renderCatalog();switchTab(id==='poetry'?'intro':'catalog');")
needle="const episode=e.target.closest('[data-episode]');"
insert="""const expand=e.target.closest('.intro-expand-button');
    if(expand){
      const content=document.getElementById(expand.getAttribute('aria-controls'));
      const expanded=expand.getAttribute('aria-expanded')!=='true';
      expand.setAttribute('aria-expanded',expanded);content.classList.toggle('expanded',expanded);
      expand.innerHTML=(expanded?'收合':'展開全部')+' '+icon('caret-down');
      if(!expanded){const top=content.getBoundingClientRect().top-scrollArea.getBoundingClientRect().top+scrollArea.scrollTop;scrollArea.scrollTo({top:Math.max(0,top-48),behavior:'smooth'})}
      return;
    }
    """+needle
s=s.replace(needle,insert);p.write_text(s,encoding='utf-8')
