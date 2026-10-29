from pathlib import Path
for name in ['index.html','settings-panel.html']:
 p=Path(name);s=p.read_text(encoding='utf-8').replace('assets/login-udn.svg','assets/login-udn.png');p.write_text(s,encoding='utf-8')
