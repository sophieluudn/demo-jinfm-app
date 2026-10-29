from pathlib import Path
p=Path('js/remaining-flows.js');s=p.read_text(encoding='utf-8').replace("document.querySelector('#checkout-confirm').textContent=fromGift?'兌換贈送連結':'立即兌換';","document.querySelector('#checkout-confirm').textContent='立即兌換';")
s=s.replace("function closeCheckout(){checkout.hidden=true;coupons.hidden=true;setFlow(false);originFocus?.focus({preventScroll:true})}","function closeCheckout(){checkout.hidden=true;coupons.hidden=true;checkout.inert=false;setFlow(false);originFocus?.focus({preventScroll:true})}")
p.write_text(s,encoding='utf-8')
for name in ['index.html','remaining-flows.html']:
 p=Path(name);s=p.read_text(encoding='utf-8').replace('此為模擬兌換，不會扣除實際點數。','按下「立即兌換」即同意服務條款與紅包折抵規則');p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('js/remaining-flows.js?v=remaining-20261029','js/remaining-flows.js?v=checkout-shared-20261029');p.write_text(s,encoding='utf-8')
