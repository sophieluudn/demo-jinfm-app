from pathlib import Path
url='https://www.udngroup.com/members/service'
for name in ['index.html','settings-panel.html']:
 p=Path(name);s=p.read_text(encoding='utf-8')
 s=s.replace('<button data-settings-to="terms">服務條款</button>',f'<a href="{url}" target="_blank" rel="noopener noreferrer">服務條款</a>')
 s=s.replace('<button class="other-row" data-settings-to="terms"><span>服務條款</span><i class="ph ph-caret-right" aria-hidden="true"></i></button>',f'<a class="other-row" href="{url}" target="_blank" rel="noopener noreferrer"><span>服務條款</span><i class="ph ph-caret-right" aria-hidden="true"></i></a>')
 s=s.replace('https://learning.udn.com/jinfm" target="_blank" rel="noopener noreferrer">前往一刻鯨選官方網站','https://www.udngroup.com/members/service" target="_blank" rel="noopener noreferrer">閱讀 udn 會員服務條款')
 p.write_text(s,encoding='utf-8')
