from pathlib import Path
p=Path('js/home.js');s=p.read_text(encoding='utf-8');s=s[:s.index("const panel=document.querySelector")]+ '\nrender();\n';p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8');s=s.replace('<script src="js/home.js"></script>','<script src="js/home.js"></script><script src="js/search.js"></script>');p.write_text(s,encoding='utf-8')
