from pathlib import Path
old='<div class="wallet"><div class="wallet-top"><span>錢包餘額 <b>0點</b></span><button data-settings-to="login">加值</button></div><p>加值沒入帳？請嘗試<button id="wallet-refresh">重新整理</button></p></div>'
new='<div class="wallet"><div class="wallet-copy"><div class="wallet-top"><span>錢包餘額 <b>0點</b></span></div><p>加值沒入帳？請嘗試<button id="wallet-refresh">重新整理</button></p></div><button class="wallet-topup" data-settings-to="login">加值</button></div>'
for name in ['index.html','settings-panel.html']:
 p=Path(name);s=p.read_text(encoding='utf-8');assert old in s,name;s=s.replace(old,new);p.write_text(s,encoding='utf-8')
p=Path('css/settings.css');s=p.read_text(encoding='utf-8').replace('.wallet-top>button{','.wallet-topup{');s+='\n.wallet{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 18px}.wallet-copy{min-width:0}.wallet-topup{flex-shrink:0}\n';p.write_text(s,encoding='utf-8')
