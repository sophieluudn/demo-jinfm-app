"""Refresh the static category demo from the authorized preview site.

Supply JINFM_PREVIEW_USER and JINFM_PREVIEW_PASSWORD in the environment.
Credentials are never written to the generated artifacts.
"""
import base64
import json
import os
import re
import ssl
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

BASE='https://lab8-learning.udn.com'
TOKEN=base64.b64encode((os.environ['JINFM_PREVIEW_USER']+':'+os.environ['JINFM_PREVIEW_PASSWORD']).encode()).decode()
CONTEXT=ssl._create_unverified_context()
DEST=Path('assets/categories')
DEST.mkdir(exist_ok=True)

def get(url):
    headers={'Authorization':'Basic '+TOKEN} if url.startswith(BASE+'/') else {}
    return urllib.request.urlopen(urllib.request.Request(url,headers=headers),context=CONTEXT,timeout=30).read()

def decoded(path):
    html=get(BASE+path).decode('utf-8')
    return ''.join(json.loads(s) for s in re.findall(r'self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)',html))

home=decoded('/jinfm')
taxonomies=[]
for m in re.finditer('"categories":',home):
    try:
        value=json.JSONDecoder().raw_decode(home[m.end():])[0]
        if isinstance(value,list) and value and isinstance(value[0],dict) and 'subcategory' in value[0]:
            taxonomies.append(value)
    except ValueError:
        pass
# The last tree belongs to the Jinfm brand, rather than the U-learning umbrella.
categories=taxonomies[-1]
requests=[(0,0)]+[(c['id'],c['id']) for c in categories]+[(s['id'],c['id']) for c in categories for s in c['subcategory']]

def catalogue(pair):
    category,parent=pair
    text=decoded(f'/jinfm/categories/{category}?page=1')
    count=re.search(r'"children":\["共",(\d+),"堂課"\]',text)
    ids=list(dict.fromkeys(int(x) for x in re.findall(r'"href":"/jinfm/courses/(\d+)"',text)))
    limit=6 if category==parent else 3
    return category,{'parent':parent,'count':int(count.group(1)) if count else len(ids),'ids':ids[:limit]}

with ThreadPoolExecutor(max_workers=6) as pool:
    catalogues=dict(pool.map(catalogue,requests))

ids=list(dict.fromkeys(i for c in catalogues.values() for i in c['ids']))

def course(id):
    text=decoded('/jinfm/courses/'+str(id))
    row=None
    for m in re.finditer(r'"course":\{',text):
        value=json.JSONDecoder().raw_decode(text[m.end()-1:])[0]
        if value.get('id')==id:
            row=value
            break
    if not row:
        raise ValueError(f'No course metadata for {id}')
    path=DEST/f'{id}.jpg'
    if not path.exists():
        path.write_bytes(get(row['imgCover']))
    authors='｜'.join(a['title'] for a in row.get('authors',[]))
    summary=row.get('summary') or {}
    style=row.get('style') or row.get('course_type') or {}
    # The reference screenshots supply prices where the preview marks them unavailable.
    price={360:90,2438:2400}.get(id,row.get('sales_price') or 0)
    old=2800 if id==2438 else row.get('original_price') or 0
    return {'id':id,'img':f'categories/{id}','title':row['title'],'author':authors,'episodes':summary.get('total') or 1,'price':price,'old':old,'desc':row.get('subtitle') or '', 'video':'影像' in row['title'],'type':style.get('text','聲音課程')}

with ThreadPoolExecutor(max_workers=6) as pool:
    courses=list(pool.map(course,ids))

result={'categories':categories,'catalogues':catalogues,'courses':courses}
Path('js/categories-data.js').write_text('window.categoryData='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(DEST/'SOURCES.md').write_text('Snapshot: 2026-10-30\n\nMain/subcategory names, counts and example course lists: https://lab8-learning.udn.com/jinfm and /jinfm/categories/{id}?page=1 . Course metadata and images: /jinfm/courses/{id}.\n\nThis static demo includes the first six examples for each main category and the first three for each subcategory. Counts reflect the full reference catalogue, not the number of locally included examples. Preview credentials are supplied only at refresh time and are not stored in this project.\n',encoding='utf-8')
print(f'Saved {len(categories)} main categories, {len(catalogues)} catalogue views and {len(courses)} courses')
