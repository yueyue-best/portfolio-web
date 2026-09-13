from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


import argparse

parser = argparse.ArgumentParser(description="Remove the neutral background from a source portrait.")
parser.add_argument("source", type=Path, help="Path to the source portrait image")
SOURCE = parser.parse_args().source
TARGET = Path(__file__).parent / "assets" / "hero-cutout-final.png"

rgb = np.asarray(Image.open(SOURCE).convert("RGB"))
height, width, _ = rgb.shape
channel_spread = rgb.max(axis=2).astype(np.int16) - rgb.min(axis=2).astype(np.int16)
brightness = rgb.mean(axis=2)

# Flood only the bright neutral pixels connected to the canvas boundary. This
# preserves similarly coloured interior details such as the shirt and lettering.
candidate = (channel_spread < 24) & (brightness > 145)
background = np.zeros((height, width), dtype=bool)
queue: deque[tuple[int, int]] = deque()

for x in range(width):
    if candidate[0, x]:
        queue.append((0, x))
    if candidate[height - 1, x]:
        queue.append((height - 1, x))
for y in range(height):
    if candidate[y, 0]:
        queue.append((y, 0))
    if candidate[y, width - 1]:
        queue.append((y, width - 1))

while queue:
    y, x = queue.popleft()
    if background[y, x] or not candidate[y, x]:
        continue
    background[y, x] = True
    if y:
        queue.append((y - 1, x))
    if y + 1 < height:
        queue.append((y + 1, x))
    if x:
        queue.append((y, x - 1))
    if x + 1 < width:
        queue.append((y, x + 1))

mask = Image.fromarray((background * 255).astype(np.uint8), "L")
mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.55))
alpha = Image.eval(mask, lambda value: 255 - value)

result = Image.fromarray(rgb, "RGB").convert("RGBA")
result.putalpha(alpha)
result.save(TARGET, optimize=True)
print(TARGET)
