from pathlib import Path
from PIL import Image
source=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
image=Image.open(next(source.glob('04_*Tab目錄1*')))
image.crop((0,166,590,500)).save('assets/course-palace.jpg',quality=96)
p=Path('index.html');s=p.read_text(encoding='utf-8');s=s.replace('<div class="toast"',Path('course-panel.html').read_text(encoding='utf-8')+'<div class="toast"');s=s.replace('<link rel="stylesheet" href="css/login-sheet.css">','<link rel="stylesheet" href="css/login-sheet.css"><link rel="stylesheet" href="css/course.css">');s=s.replace('<script src="js/login-sheet.js"></script>','<script src="js/login-sheet.js"></script><script src="js/course.js"></script>');p.write_text(s,encoding='utf-8')
p=Path('js/home.js');s=p.read_text(encoding='utf-8').replace("if(e.target.closest('[data-course]')){toast('課程詳情與播放頁將依下一批截圖製作');return}","if(e.target.closest('[data-course]'))return;");p.write_text(s,encoding='utf-8')
