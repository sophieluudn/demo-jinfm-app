from bs4 import BeautifulSoup
s=BeautifulSoup(open('rebellion-source.html',encoding='utf-8').read(),'html.parser')
for im in s.find_all('img'):
 if '叛逆' in im.get('alt',''):print(im.get('src'),im.get('data-src'))
