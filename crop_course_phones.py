from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).parent / "assets"
CROP = (680, 24, 1088, 888)

for source_name, target_name in (
    ("course-home.png", "course-home-phone.png"),
    ("course-change.png", "course-change-phone.png"),
):
    with Image.open(ASSETS / source_name) as image:
        image.crop(CROP).save(ASSETS / target_name, optimize=True)
