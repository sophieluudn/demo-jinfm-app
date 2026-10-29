from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urljoin
import base64

source=BeautifulSoup(Path('terms-source.html').read_text(encoding='utf-8'),'html.parser')
article=source.select_one('.article-style')
assert article and article.select_one('.content_title'), 'Official terms article not found'
for tag in article.find_all(['script','style','iframe']): tag.decompose()
for tag in [article,*article.find_all(True)]:
    for attr in list(tag.attrs):
        if attr.startswith('data-') or attr.startswith('on') or attr in ['style','id']:
            del tag[attr]
for a in article.find_all('a',href=True):
    a['href']=urljoin('https://www.udngroup.com/members/service',a['href'])
    a['target']='_blank';a['rel']='noopener noreferrer'
article.select_one('.content_title').name='h1'
logo=next(img['src'] for img in source.find_all('img',src=True) if img['src'].startswith('data:image/png;base64,'))
Path('assets/udn-group-logo.png').write_bytes(base64.b64decode(logo.split(',',1)[1]))
panel='''
<section id="terms-browser" aria-label="App 內瀏覽器：udn 會員服務條款" hidden>
  <div class="inapp-browser-header">
    <button id="terms-browser-close" aria-label="關閉服務條款"><i class="ph ph-caret-down" aria-hidden="true"></i></button>
    <span title="udn 會員服務條款 | 聯合報系 United Daily News Group">udn 會員服務條款 | 聯合報系 United Daily News Group</span>
    <a href="https://www.udngroup.com/members/service" target="_blank" rel="noopener noreferrer" aria-label="在外部瀏覽器開啟服務條款"><i class="ph ph-compass" aria-hidden="true"></i></a>
  </div>
  <div class="terms-web-content" tabindex="-1">
    <div class="terms-site-nav"><img src="assets/udn-group-logo.png" alt="聯合報系 United Daily News Group"><button id="terms-site-menu" aria-label="開啟網站選單" aria-expanded="false" aria-controls="terms-site-links"><i class="ph ph-list" aria-hidden="true"></i></button></div>
    <nav id="terms-site-links" aria-label="聯合報系網站選單" hidden><a href="https://www.udngroup.com/" target="_blank" rel="noopener noreferrer">聯合報系首頁</a><a href="https://www.udngroup.com/members/service" target="_blank" rel="noopener noreferrer">udn 會員服務條款</a></nav>
    <div class="terms-article">'''+str(article)+'''</div>
  </div>
</section>
'''
Path('terms-browser.html').write_text(panel,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8')
s=s.replace('<div class="toast"',panel+'<div class="toast"')
s=s.replace('<link rel="stylesheet" href="css/settings.css">','<link rel="stylesheet" href="css/settings.css"><link rel="stylesheet" href="css/terms-browser.css">')
s=s.replace('<script src="js/settings.js"></script>','<script src="js/settings.js"></script><script src="js/terms-browser.js"></script>')
p.write_text(s,encoding='utf-8')
