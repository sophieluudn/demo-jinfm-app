from pathlib import Path
from PIL import Image
for file in ['index.html','settings-panel.html']:
 p=Path(file);s=p.read_text(encoding='utf-8');s=s.replace('<img src="assets/profile-default.jpg" alt="預設會員頭像">','<span class="account-avatar" role="img" aria-label="預設會員頭像"><i class="ph-fill ph-user" aria-hidden="true"></i></span>');p.write_text(s,encoding='utf-8')
p=Path('assets/settings-icon.png');im=Image.open(p).convert('RGBA');out=Image.new('RGBA',im.size,(25,110,128,255));out.putalpha(im.getchannel('A'));out.save(p)
