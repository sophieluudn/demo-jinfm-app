from PIL import Image
from pathlib import Path
root=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
for name,n in [('empty','02'),('results','03')]:
 ref=Image.open(next(root.glob(n+'_*'))).resize((393,853))
 app=Image.open('search-'+name+'-preview.png')
 out=Image.new('RGB',(786,853),'white');out.paste(ref,(0,0));out.paste(app,(393,0));out.save('search-'+name+'-comparison.png')
