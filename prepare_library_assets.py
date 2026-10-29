from pathlib import Path
from PIL import Image
root=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
for keyword,name in [('租借','library-borrowed-empty'),('訂閱','library-subscribed-empty')]:
 p=next(root.glob('07_*'+keyword+'*'));Image.open(p).crop((145,499,445,775)).save('assets/'+name+'.png')
p=next(root.glob('04_*加入收藏*'));Image.open(p).crop((46,166,544,500)).save('assets/aesthetics.jpg',quality=95)
p=next(root.glob('07_*收藏*'));Image.open(p).crop((22,878,178,984)).save('assets/rashomon.jpg',quality=95)
