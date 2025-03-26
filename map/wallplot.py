import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import json

# Load wall rectangles from json
# (X1, Y1, X2, Y2)
# X1, Y1: Top left corner
# X2, Y2: Bottom right corner

with open(r'./not_walkables.json', 'r') as f:
    rectgls = json.load(f)

# Load spawn points from json
# (X, Y): Coordinates for spawn points
with open(r'./spawn_points.json', 'r') as f:
    spawn_points = json.load(f)
    
# Load image
im = Image.open(r'./xgen_studio-map.png')
pixels = np.array(im)

fig, ax = plt.subplots()
ax.imshow(pixels)

for rect in rectgls:
    ax.add_patch(patches.Rectangle((rect[0], rect[1]), rect[2]-rect[0], rect[3]-rect[1], linewidth=1, edgecolor='white', facecolor='none'))

for point in spawn_points:
    ax.add_patch(patches.Circle((point[0], point[1]), radius=10, color='white', fill=False, linewidth=2))

plt.savefig('./output_wallplot.png')
plt.show()

