from pathlib import Path
import re
p=Path('js/remaining-flows.js');s=p.read_text(encoding='utf-8').replace("origin=document.querySelector('#course-panel');originFocus=document.activeElement;checkout.hidden=false", "origin=document.querySelector('#course-panel');if(!isGift)originFocus=document.activeElement;checkout.hidden=false");p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8');s=re.sub(r'((?:src|href)="(?:js/|css/)[^"?]+)(?:\?[^\"]*)?"',r'\1?v=remaining-20261029"',s);p.write_text(s,encoding='utf-8')
