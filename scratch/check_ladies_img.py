from PIL import Image
import os

base = r'public\eyeglassimages\LADIES EYEWARE Colors Purple, Pink, Maroon Golden , rs 19990'
for f in os.listdir(base)[:5]:
    im = Image.open(os.path.join(base, f))
    print(f, im.size)

