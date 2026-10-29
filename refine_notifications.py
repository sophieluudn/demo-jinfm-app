from pathlib import Path
p=Path('js/notifications.js');s=p.read_text(encoding='utf-8').replace('.focus();','.focus({preventScroll:true});');p.write_text(s,encoding='utf-8')
