import urllib.request,re,json
url='https://drive.google.com/drive/folders/1t6la4dpUrWAuADVN6U1pCo8e4hxjdawZ'
s=urllib.request.urlopen(url).read().decode('utf-8')
open('drive-asset-index.html','w',encoding='utf-8').write(s)
names=sorted(set(re.findall(r'[A-Za-z0-9_@.-]+\.(?:png|svg)',s)))
print('\n'.join(n for n in names if any(x in n.lower() for x in ['empty','download','user','member','img_','login','setting'])))
