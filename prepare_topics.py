"""Snapshot homepage marketing sections. Credentials come only from environment."""
import base64,json,os,re,ssl,urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

BASE='https://lab8-learning.udn.com'
TOKEN=base64.b64encode((os.environ['JINFM_PREVIEW_USER']+':'+os.environ['JINFM_PREVIEW_PASSWORD']).encode()).decode()
CTX=ssl._create_unverified_context()
def get(url):
    headers={'Authorization':'Basic '+TOKEN} if url.startswith(BASE+'/') else {}
    return urllib.request.urlopen(urllib.request.Request(url,headers=headers),context=CTX,timeout=30).read()
def decoded(path):
    s=get(BASE+path).decode('utf-8')
    return ''.join(json.loads(c) for c in re.findall(r'self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)',s))
text=decoded('/jinfm')
sections=[]
for m in re.finditer(r'"channels":\[',text):
    try:
        value=json.JSONDecoder().raw_decode(text[text.rfind('{',0,m.start()):])[0]
        if 'title' in value and isinstance(value.get('channels'),list):sections.append(value)
    except ValueError:pass
home=Path('js/home-data.js').read_text(encoding='utf-8')
old=json.JSONDecoder().raw_decode(home[home.index('=')+1:].lstrip())[0]
normalize=lambda s:re.sub(r'[\s｜|]','',s)
old_courses={normalize(c['title']):c for section in old for c in section[3]}
items={c['id']:c for section in sections for c in section['channels']}
dest=Path('assets/topics');dest.mkdir(exist_ok=True)
def course(channel):
    id=channel['id'];body=decoded('/jinfm/courses/'+str(id));detail=None
    for m in re.finditer(r'"course":\{',body):
        obj=json.JSONDecoder().raw_decode(body[m.end()-1:])[0]
        if obj.get('id')==id:detail=obj;break
    previous=old_courses.get(normalize(channel['title']))
    cover_url=channel.get('imgCover') or (detail or {}).get('imgCover')
    if not cover_url or not cover_url.startswith('https://'):
        return None
    img=previous['img'] if previous else f'topics/{id}'
    cover=Path('assets')/(img+'.jpg')
    if not cover.exists():cover.write_bytes(get(cover_url))
    authors=channel.get('authors') or []
    avatar=Path('assets')/(img+'-avatar.jpg')
    if not avatar.exists() and authors and authors[0].get('imgAvatar'):avatar.write_bytes(get(authors[0]['imgAvatar']))
    summary=(detail or {}).get('summary') or {}
    return {'id':id,'img':img,'title':channel['title'],'author':'｜'.join(a['title'] for a in authors),'episodes':summary.get('total') or (previous or {}).get('episodes') or 1,'price':channel.get('sales_price') or 0,'old':channel.get('original_price') or 0,'desc':channel.get('subtitle') or '', 'category':(previous or {}).get('category','休閒生活'),'video':'影像' in channel['title']}
with ThreadPoolExecutor(max_workers=6) as pool:
    courses={c['id']:c for c in pool.map(course,items.values()) if c}
result=[{'title':s['title'],'subtitle':s['subtitle'],'hasMore':bool(s['more_links']) or any(normalize(o[0])==normalize(s['title']) and o[2] for o in old),'courses':[courses[c['id']] for c in s['channels'] if c['id'] in courses]} for s in sections]
Path('js/topics-data.js').write_text('window.topicData='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(dest/'SOURCES.md').write_text('Homepage marketing sections and courses: https://lab8-learning.udn.com/jinfm and /jinfm/courses/{id}. Snapshot 2026-10-30. Compact homepage sections and sections with an explicit more link show a final See more card. Credentials are read from environment variables and not saved.\n',encoding='utf-8')
print(f'Saved {len(result)} topics and {len(courses)} courses')
