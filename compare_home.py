from PIL import Image
from build_home import root
im=Image.open('home-preview.png')
w,h=im.size
app=im.crop(((w-393)//2,5,(w-393)//2+393,858))
ref=Image.open(sorted(root.glob('01_*'),key=lambda f:len(f.name))[0]).resize((393,853))
out=Image.new('RGB',(786,853),'white');out.paste(ref,(0,0));out.paste(app,(393,0));out.save('home-comparison.png')
