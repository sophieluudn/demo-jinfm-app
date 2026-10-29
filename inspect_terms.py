from bs4 import BeautifulSoup
s=BeautifulSoup(open('terms-source.html',encoding='utf-8').read(),'html.parser')
h=s.find(['h1','h2'],string=lambda x:x and 'udn' in x and '服務條款' in x)
for p in [h,h.parent,h.parent.parent,h.parent.parent.parent]:print(p.name,p.get('class'),len(str(p)))
print([(x.name,x.get('class'),len(str(x))) for x in s.find_all(['article','main'])])
print([(x.get('src'),x.get('alt')) for x in s.find_all('img')][:8])
