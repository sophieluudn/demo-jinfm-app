from pathlib import Path
from PIL import Image
import json

source=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
empty=Image.open(next(source.glob('02_*')))
empty.crop((160,419,435,660)).save('assets/search-empty.png')
result=Image.open(next(source.glob('03_*')))
for name,y in [('thanks',362),('anxiety',551),('belief',741),('feast',930),('little-women',1119)]:
    result.crop((22,y,178,y+105)).save(f'assets/search-{name}.jpg',quality=96)

data=[
 {'img':'search-thanks','title':'謝謝你因為我很幸福','author':'春花媽','episodes':50,'price':580,'old':680},
 {'img':'search-anxiety','title':'第一本認識恐懼的神經科學讓焦慮不見了','author':'凱瑟琳・皮特曼、伊莉莎白・卡爾｜柿子文化','episodes':15,'price':399},
 {'img':'search-belief','title':'翻轉信念40招第3輯','author':'王怡仁醫師','episodes':31,'price':720,'old':800},
 {'img':'search-feast','title':'西洋經典文學導讀系列《流動的饗宴》','author':'海明威｜陳夏民（講者）','episodes':2,'price':169,'old':249},
 {'img':'search-little-women','title':'小婦人','author':'路易莎・梅・艾考特｜黎家秀、陳貞伶等','episodes':39,'price':480},
]
for row in data: row.update(category='文史哲',video=False,keywords='快樂 幸福')
Path('js/search-data.js').write_text('window.searchCourses = '+json.dumps(data,ensure_ascii=False)+';',encoding='utf-8')

index=Path('index.html')
text=index.read_text(encoding='utf-8-sig')
start=text.index('<div id="search-panel"')
end=text.index('<div class="toast"',start)
text=text[:start]+'''<section id="search-panel" aria-label="搜尋" hidden>
  <div class="search-top">
    <form id="search-form" role="search">
      <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
      <input type="search" enterkeyhint="search" autocomplete="off" placeholder="搜尋內容關鍵字、主講老師" aria-label="搜尋內容關鍵字、主講老師">
      <button type="button" id="search-clear" aria-label="清除搜尋內容" hidden><i class="ph-fill ph-x-circle" aria-hidden="true"></i></button>
    </form>
    <button id="search-close">取消</button>
  </div>
  <div id="search-empty">
    <img src="assets/search-empty.png" alt="戴著耳機的鯨魚與搜尋資料夾">
    <p>各種精彩有聲內容等待你來挖掘！<br>想聽什麼，快點輸入關鍵字搜尋吧</p>
  </div>
  <div id="search-content" hidden>
    <nav class="search-sort" aria-label="搜尋結果排序">
      <button id="sort-default" class="active" aria-pressed="true">預設排序</button>
      <button id="sort-price" aria-label="依價格由低到高排序" aria-pressed="false">價格<img src="assets/icon_filter_pricone_off.png" alt=""></button>
    </nav>
    <p id="search-summary" aria-live="polite"></p>
    <div id="search-results"></div>
  </div>
  <div id="search-keyboard" aria-label="模擬鍵盤">
    <div class="keyboard-suggestions" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="key-row" data-letters="QWERTYUIOP"></div>
    <div class="key-row middle" data-letters="ASDFGHJKL"></div>
    <div class="key-row"><button type="button" data-key="shift" aria-label="切換大小寫"><i class="ph-fill ph-arrow-fat-up"></i></button><div class="key-letters" data-letters="ZXCVBNM"></div><button type="button" data-key="backspace" aria-label="刪除字元"><i class="ph ph-backspace"></i></button></div>
    <div class="key-row last"><button type="button" data-key="numbers" aria-label="切換數字鍵盤">123</button><button type="button" data-key="language" aria-label="切換中文示範輸入"><i class="ph ph-smiley"></i></button><button type="button" data-key="space" aria-label="空白鍵"></button><button type="button" data-key="search" aria-label="送出搜尋" disabled><i class="ph ph-magnifying-glass"></i></button></div>
    <div class="keyboard-bottom"><button type="button" data-key="language" aria-label="切換中文示範輸入"><i class="ph ph-globe"></i></button><button type="button" data-key="microphone" aria-label="語音輸入"><i class="ph ph-microphone"></i></button></div>
  </div>
</section>'''+text[end:]
text=text.replace('<script src="js/home.js">','<script src="js/search-data.js"></script><script src="js/home.js">')
text=text.replace('<link rel="stylesheet" href="css/home.css">','<link rel="stylesheet" href="css/home.css"><link rel="stylesheet" href="css/search.css">')
index.write_text(text,encoding='utf-8')

js=Path('js/home.js')
text=js.read_text(encoding='utf-8-sig')
text=text[:text.index('const panel=document.querySelector')]+Path('js/search.js').read_text(encoding='utf-8')+'\nrender();\n'
js.write_text(text,encoding='utf-8')
