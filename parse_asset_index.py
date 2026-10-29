import re,json
s=open('drive-asset-index.html',encoding='utf-8').read()
items={}
for m in re.finditer(r'aria-label="([^"]+\.(?:png|svg)[^"]*)"',s):
 chunk=s[max(0,m.start()-1000):m.end()+1000]
 ids=re.findall(r'data-id="([A-Za-z0-9_-]+)"',chunk)
 if ids:items[ids[-1]]=m[1]
print(json.dumps(items,ensure_ascii=True)[:16000]);open('drive-asset-index.json','w',encoding='utf-8').write(json.dumps(items,ensure_ascii=False))
