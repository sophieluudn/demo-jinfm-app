from PIL import Image
for name in ['btn_list_play','icon_filter_pricone_off']:
 im=Image.open('assets/'+name+'.png').convert('RGBA')
 color=Image.new('RGBA',im.size,(25,110,128,255));color.putalpha(im.getchannel('A'));color.save('assets/'+name+'.png')
from pathlib import Path
p=Path('js/home.js')
s=p.read_text(encoding='utf-8')
s=s.replace("b.innerHTML=icon('heart',saved.has(id))", "b.innerHTML=b.closest('#search-results')?`<img src=\"assets/btn_collect_${saved.has(id)?'on':'off'}.png\" alt=\"\">`:icon('heart',saved.has(id))")
p.write_text(s,encoding='utf-8')
