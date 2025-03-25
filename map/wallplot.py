import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import json

# Load wall rectangles from json
# (X1, Y1, X2, Y2)
# X1, Y1: Top left corner
# X2, Y2: Bottom right corner

with open('./not_walkables.json', 'r') as f:
    rectgls = json.load(f)

# Load image
im = Image.open(r'./xgen_studio-map.png')
pixels = np.array(im)

fig, ax = plt.subplots()
ax.imshow(pixels)

for rect in rectgls:
    ax.add_patch(patches.Rectangle((rect[0], rect[1]), rect[2]-rect[0], rect[3]-rect[1], linewidth=1, edgecolor='white', facecolor='none'))

plt.show()
plt.savefig('./output_wallplot.png')
input("")

