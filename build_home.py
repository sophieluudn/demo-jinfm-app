from pathlib import Path
from PIL import Image
import json

root=Path('C:/Users/user/Desktop/一刻鯨選 APP 頁面')
def crop(name,n,box):
    im=Image.open(root/f'01_首頁{n}.jpg'); im.crop(box).save(f'assets/{name}.jpg',quality=95)
crop('banner',1,(22,254,568,474))
# Only artwork is extracted; all interface text and controls remain HTML.
specs=[('poetry',1,22,780,311,973),('palace',1,334,780,590,973),('insurance',2,22,572,202,692),('insurance-video',2,223,572,403,692),('retirement',2,425,572,590,692),('history',3,22,455,311,647),('east-west',3,334,455,590,647),('bamboo',4,223,350,403,470),('love',4,425,350,590,470),('writing',5,22,319,311,512),('writing-video',5,334,319,590,512),('meditate',6,22,307,311,501),('forest',6,334,307,590,501),('asia9',7,22,318,311,510),('asia8',7,334,318,590,510),('food',8,22,422,311,614),('siddhartha',8,334,422,590,614),('leader',9,22,395,311,588),('dogs',9,334,395,590,588),('rome',10,22,377,311,569),('sea',10,334,377,590,569),('taiwan',12,22,305,311,499),('latin',12,334,305,590,499)]
for name,n,x,y,r,b in specs: crop(name,n,(x,y,r,b))
crop('whale',12,(384,1040,565,1165))
def c(img,title,author,episodes,price,old='',desc='',category='文史哲',video=False):
 return dict(img=img,title=title,author=author,episodes=episodes,price=price,old=old,desc=desc,category=category,video=video)
poetry=c('poetry','醉美古詩詞（全系列）：60集','歐麗娟',61,499,1500,'聲入心坎的古代流行歌')
sections=[
 ['熱銷排行榜','不可錯過的暢銷課程全明星',False,[poetry,c('palace','從赤壁到寒食：東坡書法之美與豁達心境','何炎泉（主講）｜趙孝萱',24,1280,1680,'故宮開講 × 國寶發聲(一)','休閒生活')]],
 ['中年無畏優老計畫','懂保險懂照護，從容面對老後',True,[c('insurance','阿噗教你買保險','何品旋',0,425,500,category='商業管理'),c('insurance-video','【影像課】快速看懂「保險」你需要知道的事','曹毓庭',0,1680,3000,video=True,category='商業管理'),c('retirement','【影像課】給退休族的30堂課','萬子綾、黃淑君',0,499,video=True,category='休閒生活')]],
 ['趣味歷史','聽有趣故事，輕鬆掌握文明脈絡',False,[c('history','最有趣的歐美近代史','吳宜蓉',11,259,330,'一聽就上癮！比小說更離奇'),c('east-west','金魚滿堂——當東方遇上西方','謝金魚',11,399,desc='歷史上東西方文化碰撞的故事')]],
 ['兩千萬人聽的文學課','全網熱議！歐麗娟陪你讀懂深層孤獨',True,[poetry,c('bamboo','醉美古詩詞（三）隋唐～宋代','歐麗娟',0,249,600),c('love','醉美古詩詞（二）漢代～六朝','歐麗娟',0,199,500)]],
 ['筆墨人生學','練字也練心，用筆墨刻畫你的人生新格局',False,[c('writing','張大春讀書寫字【三冊合購有聲書】','張大春',50,1199,1279),c('writing-video','【影像課】無痛開練！小黑院長的寫字線上課','小黑院長',23,2280,desc='一生的日常技藝，只要有心',category='休閒生活',video=True)]],
 ['療癒頌缽','感受心靈寧靜',False,[c('meditate','頌缽音療 1 靜心冥想','林明儀',1,100,category='心理成長'),c('forest','頌缽音療 2 舒緩壓力','林明儀',1,100,category='心理成長')]],
 ['楊照談史｜東亞','探索東亞的權力格局與地緣政治',False,[c('asia9','【影像課】楊照談戲劇與故事背景中的東亞史（九）','楊照',6,2400,2800,'十七世紀東亞新局勢——滿清、俄羅斯、日本',video=True),c('asia8','【影像課】楊照談戲劇與故事背景中的東亞史（八）','楊照',6,2400,2800,'十七世紀意義非凡的台灣之戰',video=True)]],
 ['熱門有聲書','好書用聽的，閱讀無界限',False,[c('food','救命飲食','T・柯林・坎貝爾、湯瑪斯',33,650,desc='愈營養，愈危險！？',category='樂活運動'),c('siddhartha','悉達多：一首印度的詩','赫曼・赫塞｜蕭定睿',19,210,desc='流浪者之歌')]],
 ['聽聽管理','破解職場難題，從自我到團隊管理一次聽懂',False,[c('leader','領導者的形象管理學','陳麗卿',10,199,300,'打造職場領袖的Perfect image','商業管理'),c('dogs','向韓非子學管理','南雷',22,349,440,'探究法家思想的管理邏輯','商業管理')]],
 ['免費內容專區','不知道要聽什麼？先從裡面挑喜歡的吧！',False,[c('rome','海獅說趣味羅馬史','神奇海獅',5,0,150,'共和走向帝國，竟是炒房'),c('sea','《海上傭兵》17世紀東亞海域上的血與淚','鄭維中',9,0,desc='貿易與戰爭，時勢英雄的故事')]],
 ['危機邊緣的世界版圖','從地緣歷史洞悉全球衝突真相',False,[c('taiwan','臺海戰爭風險下，臺灣的勝算［前參謀總長］','李喜明',7,299,379,'2023年，你應了解的臺灣安全解方'),c('latin','1917列寧在火車上','梅里杜爾｜任家慧（譯）',17,580,desc='世界陷入紅色風暴的前八天')]]]
Path('js/home-data.js').write_text('window.homeSections = '+json.dumps(sections,ensure_ascii=False)+';',encoding='utf-8')
