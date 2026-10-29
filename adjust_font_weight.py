from pathlib import Path
p=Path('css/home.css');s=p.read_text(encoding='utf-8-sig');s=s.replace('font-weight:750','font-weight:600').replace('font-weight:700','font-weight:500');s=s.replace('.title{font-size:14px;line-height:1.5;font-weight:600','.title{font-size:14px;line-height:1.5;font-weight:500').replace('.filters button.active{font-weight:600}', '.filters button.active{font-weight:500}');s+='\n/* Lighter typography requested by user. */\n.more h2{font-weight:500}\n';p.write_text(s,encoding='utf-8')
for name in ['search','notifications']:
 p=Path('css/'+name+'.css');s=p.read_text(encoding='utf-8-sig').replace('font-weight:600','font-weight:500').replace('font-weight:650','font-weight:500');
 if name=='notifications':s+='\n.notification-detail h2{font-weight:500}\n'
 p.write_text(s,encoding='utf-8')
