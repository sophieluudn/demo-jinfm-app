from pathlib import Path
from PIL import Image
root=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
Image.open(next(root.glob('04_*下載按鈕*'))).crop((0,166,590,500)).save('assets/course-east-west.jpg',quality=96)
# The original mascot artwork, recolored white for the source-style favorite toast.
im=Image.open('assets/whale.jpg').convert('RGBA')
pixels=[]
for r,g,b,a in im.getdata():
 alpha=255 if b>r+12 and g>r+8 and r<130 else 0
 pixels.append((255,255,255,alpha))
im.putdata(pixels);im.save('assets/favorite-whale.png')
p=Path('index.html');s=p.read_text(encoding='utf-8')
extras=Path('course-extras.html').read_text(encoding='utf-8')
progress=extras[:extras.index('<section id="transcript-panel"')]
transcript=extras[extras.index('<section id="transcript-panel"'):]
s=s.replace('  <div class="course-bottom">',progress+'\n  <div class="course-bottom">')
s=s.replace('<div class="toast"',transcript+'<div class="toast"')
s=s.replace('<link rel="stylesheet" href="css/course-intro.css">','<link rel="stylesheet" href="css/course-intro.css"><link rel="stylesheet" href="css/course-extras.css">')
p.write_text(s,encoding='utf-8')
