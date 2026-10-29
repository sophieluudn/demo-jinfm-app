from pathlib import Path
for name in ['index.html','settings-panel.html']:
 p=Path(name);s=p.read_text(encoding='utf-8');s='\n'.join(line for line in s.split('\n') if not ('data-settings-page="terms"' in line));p.write_text(s,encoding='utf-8')
p=Path('js/settings.js');s=p.read_text(encoding='utf-8').replace("let active='main',previous='main',entry;","let active='main',entry;").replace('previous=active;active=name;','active=name;').replace("const destination=active==='terms'&&previous==='login'?'login':active==='terms'?'other':'main';","const destination='main';");p.write_text(s,encoding='utf-8')
