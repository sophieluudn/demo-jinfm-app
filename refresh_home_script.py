from pathlib import Path
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('src="js/home.js"','src="js/home.js?v=20261029-course"');p.write_text(s,encoding='utf-8')
