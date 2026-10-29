from pathlib import Path
p=Path('js/course.js');s=p.read_text(encoding='utf-8').replace('此課程目錄待補充','此範圍沒有課程單元');p.write_text(s,encoding='utf-8')
