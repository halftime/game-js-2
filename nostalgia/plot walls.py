

import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches

rectgls = [
    ## (x1, y1, x2, y2)
    ## start with top left

    (0, 0 , 30, 760), ## wall 1

    (30, 296, 130, 362), ## wall 2 a
    (164, 362, 426, 296), ## wall 2 b
    (460, 362, 622, 296), ## wall 2 c

    (30, 756, 1150, 786), ## wall 3
    (558, 690, 622, 756), # wall 4
    (886, 362, 950, 754), # wall 5
    (886, 98, 950, 294), # wall 8 mid/ living

    (1116, 26, 1150, 756), # wall 6
    

    (754, 0, 818, 262), # wall 9 kitchen right
    (526, 196, 688, 262), # wall 10 kitchen bottom
    (394, 30, 458, 262), # kitchen wall left

    ## small extras kitchen mid
    (458, 196, 490, 262),
    (720, 196, 756, 262),

    # small wall bathroom left
    (886, 32, 950, 66),

    (32, 0, 1116, 32), # top wall

    (560, 356, 622, 622), # offices mid wall
    (622, 428, 720, 492), # offices left mid wall
    (754, 428, 888, 492), # offices right mid wall

    (262, 30, 326, 96),
    (262, 132, 326, 228),
    (262, 264, 326, 298)

]

# Load image
im = Image.open(r'E:\Downloads\game js 2\nostalgia\xgen_studio-map.png')
pixels = np.array(im)

fig, ax = plt.subplots()
ax.imshow(pixels)

for rect in rectgls:
    ax.add_patch(patches.Rectangle((rect[0], rect[1]), rect[2]-rect[0], rect[3]-rect[1], linewidth=1, edgecolor='r', facecolor='none'))

plt.show()

input("")

