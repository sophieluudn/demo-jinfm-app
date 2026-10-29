from build_home import root
from PIL import Image
items=[(1,1110,['poetry','palace']),(3,787,['history','east-west']),(5,650,['writing','writing-video']),(6,639,['meditate','forest']),(7,647,['asia9','asia8']),(8,755,['food','siddhartha']),(9,725,['leader','dogs']),(10,706,['rome','sea']),(12,635,['taiwan','latin'])]
files=sorted(root.glob('01_*'),key=lambda f:int(''.join(c for c in f.stem.split('_')[1] if c.isdigit())))
for n,y,names in items:
 im=Image.open(files[n-1])
 for x,name in zip([44,355],names): im.crop((x,y,x+29,y+29)).save(f'assets/{name}-avatar.jpg')
for name in ['insurance','insurance-video','retirement','bamboo','love']: Image.open('assets/poetry-avatar.jpg').save(f'assets/{name}-avatar.jpg')
