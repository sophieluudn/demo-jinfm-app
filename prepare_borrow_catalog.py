"""Snapshot public Jinfm catalogue metadata and assets for the static demo."""
import json
import ssl
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

BASE = 'https://prod.jinfm.net/ear/public/api/web/v1/'
# The public site's certificate chain is rejected by this machine's Python store.
CONTEXT = ssl._create_unverified_context()
DEST = Path('assets/borrow')
DEST.mkdir(exist_ok=True)

def get(url):
    return urllib.request.urlopen(url, context=CONTEXT, timeout=25).read()

def data(path):
    return json.loads(get(BASE + path))

def asset(url, name):
    path = DEST / name
    if not path.exists():
        path.write_bytes(get(url))
    return str(path).replace('\\', '/')

clients = data('clients')['clients']
schools = []
catalogues = {}
for cid in ['tajen', 'ttu', 'dyu', 'nsysu', 'csmu']:
    row = next(c for c in clients if c['cid'] == cid)
    image = asset(row['logo'], cid + '.png') if row['logo'] else asset('https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&q=85&fit=crop', 'ocean.jpg')
    schools.append({'id': cid, 'name': row['display_name'], 'description': row['introduction'] or '', 'image': image})
    catalogues[cid] = data(f'queryClientAssets?cid={cid}&type=1&page=1&per_page=100')['data']

channels = {r['channel']['id']: r['channel'] for rows in catalogues.values() for r in rows}

def course(channel):
    try:
        row = data('channels/' + str(channel['id']))
    except urllib.error.HTTPError as error:
        if error.code == 404:
            if channel['id'] != 41:
                return None
            # Still listed by the public partner catalogue; category is visible in the reference.
            row = {**channel, 'category': {'title': '商業管理'}}
        else:
            raise
    cover = asset(row['imgCover'], 'course-' + str(row['id']) + '.jpg')
    return {'id': row['id'], 'img': 'borrow/course-' + str(row['id']), 'title': row['title'], 'author': row['author']['title'], 'episodes': row['total'], 'category': row['category']['title'], 'price': 0, 'video': False, 'desc': row.get('subtitle') or '', 'cover': cover}

with ThreadPoolExecutor(max_workers=6) as pool:
    courses = [c for c in pool.map(course, channels.values()) if c]

# Match the reference's course ordering for Da-Yeh University.
order = [62, 24, 25, 33, 41, 43]
available = {c['id'] for c in courses}
catalogues = {cid: [r['channel']['id'] for r in rows if r['channel']['id'] in available] for cid, rows in catalogues.items()}
catalogues['dyu'].sort(key=lambda id: order.index(id) if id in order else len(order))
result = {'schools': schools, 'courses': courses, 'catalogues': catalogues}
Path('js/borrow-data.js').write_text('window.borrowData=' + json.dumps(result, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
Path('assets/borrow/SOURCES.md').write_text('Public catalogue snapshot: 2026-10-30.\n\nSchool names, descriptions, logos, course titles, authors, categories, episode counts and covers: https://prod.jinfm.net/ear/public/api/web/v1/clients and /queryClientAssets?cid=… and /channels/{id}.\n\nOcean placeholder for institutions without a logo: https://images.unsplash.com/photo-1546026423-cc4642628d2b . This is a substitute for the reference ocean image.\n\nCourse ordering for Da-Yeh matches the user-provided reference. Channel 41 metadata comes from queryClientAssets because its details endpoint returns 404. No authentication or lending API is connected.\n', encoding='utf-8')
print(f'Saved {len(schools)} schools and {len(courses)} courses')
