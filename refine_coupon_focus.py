from pathlib import Path
p=Path('js/remaining-flows.js');s=p.read_text(encoding='utf-8').replace("renderCoupons();document.querySelector('#coupon-back').focus({preventScroll:true})}","renderCoupons();if(!standalone)document.querySelector('#coupon-back').focus({preventScroll:true})}");p.write_text(s,encoding='utf-8')
