from bs4 import BeautifulSoup
for file,word in [('aesthetics-source.html','感知'),('rashomon-author-source.html','羅生門')]:
 s=BeautifulSoup(open(file,encoding='utf-8').read(),'html.parser')
 for img in s.find_all('img'):
  if word in img.get('alt',''):print(file,img.get('src'),img.find_parent('a').get('href') if img.find_parent('a') else '')
