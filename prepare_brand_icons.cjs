const fs=require('fs'); const icons=require('simple-icons');
for(const [n,i] of [['facebook',icons.siFacebook],['apple',icons.siApple],['line',icons.siLine]]) fs.writeFileSync('assets/login-'+n+'.svg',i.svg.replace('<svg ','<svg fill="white" '));
