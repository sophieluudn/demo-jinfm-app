from pathlib import Path
import re
p=Path('index.html');s=p.read_text(encoding='utf-8');s=re.sub(r'(src="js/(?:course-intro|course)\.js)(?:\?[^\"]*)?"',r'\1?v=intro-all-20261029"',s);s=s.replace('href="css/course-intro.css"','href="css/course-intro.css?v=intro-all-20261029"');p.write_text(s,encoding='utf-8')
