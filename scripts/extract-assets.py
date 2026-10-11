#!/usr/bin/env python3
"""Extract site image assets by cropping the 2x reference PNGs.

Figma REST API quota was exhausted, so assets are cropped out of the 2x
reference exports in docs/reference/. Coordinates are in reference-image
pixels (2x), origin top-left, as measured and validated in the task brief.
"""

import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_DIR = os.path.join(ROOT, "docs", "reference")
OUT_DIR = os.path.join(ROOT, "public", "assets")
# Kept outside public/ so it is not served as a static file.
MANIFEST_PATH = os.path.join(ROOT, "lib", "assets-manifest.json")

CELL = 836
# Measured content columns (x0, x1) of the 3-up grids: the 26px white
# gutters fall at 836-861 and 1696-1721, so column 2 is 2px narrower than
# the nominal 836px cell to avoid dragging the gutter into the crop.
GRID_COLS = [(0, 836), (862, 1696), (1722, 2558)]
GRID_ROWS_Y = [624, 1486, 2348, 3210]

HOME = "HOME.png"
DG = "Design Graphique.png"
SIG = "Signalétique.png"
INT = "Interactifs.png"

# Measured content boxes for the 4-up "projets récents" rows. The nominal
# 625px width overshoots into the 22px white gutters, and the 4th column
# images are not full-width, so explicit boxes are used instead.
RECENT_A_BOXES = [
    (0, 1686, 622, 2312),
    (644, 1686, 1269, 2312),
    (1292, 1686, 1917, 2312),
    (1932, 1710, 2533, 2287),
]
RECENT_B_BOXES = [
    (0, 2334, 622, 2960),
    (644, 2334, 1269, 2960),
    (1292, 2334, 1917, 2960),
    (1939, 2334, 2560, 2960),
]

BOTTOM_X = [122, 906, 1690]
BOTTOM_Y = 4730
BOTTOM_H = 1086
BOTTOM_W = 726

MAX_DIM = 1200
HERO_MAX_DIM = 1920
JPEG_QUALITY = 88


def grid_cells(ref, rows):
    for r, y in enumerate(rows):
        for c, (x0, x1) in enumerate(GRID_COLS):
            idx = r * len(GRID_COLS) + c + 1
            yield idx, (x0, y, x1, y + CELL)


def build_plan():
    plan = []

    for idx, box in grid_cells(DG, GRID_ROWS_Y):
        plan.append((f"dg-{idx:02d}", "design-graphique", DG, box, MAX_DIM))
    for idx, box in grid_cells(SIG, GRID_ROWS_Y[:2]):
        plan.append((f"sig-{idx:02d}", "signaletique", SIG, box, MAX_DIM))
    for idx, box in grid_cells(INT, GRID_ROWS_Y[:2]):
        plan.append((f"int-{idx:02d}", "interactifs", INT, box, MAX_DIM))

    plan.append(("hero", "home", HOME, (0, 398, 2560, 1382), HERO_MAX_DIM))
    for i, box in enumerate(RECENT_A_BOXES):
        plan.append((f"recent-{i + 1:02d}", "home", HOME, box, MAX_DIM))
    for i, box in enumerate(RECENT_B_BOXES):
        plan.append((f"recent-{i + 5:02d}", "home", HOME, box, MAX_DIM))
    plan.append(("portrait", "home", HOME, (1545, 3485, 2150, 4085), MAX_DIM))
    for i, x in enumerate(BOTTOM_X):
        plan.append(
            (
                f"bottom-{i + 1:02d}",
                "home",
                HOME,
                (x, BOTTOM_Y, x + BOTTOM_W, BOTTOM_Y + BOTTOM_H),
                MAX_DIM,
            )
        )

    return plan


def crop_and_save(ref_path, box, out_path, max_dim):
    im = Image.open(ref_path).convert("RGB")
    im = im.crop(box)
    w, h = im.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    im.save(out_path, "JPEG", quality=JPEG_QUALITY)


def main():
    plan = build_plan()
    manifest = []

    for name, category, source, box, max_dim in plan:
        ref_path = os.path.join(REF_DIR, source)
        rel_file = f"{category}/{name}.jpg"
        out_path = os.path.join(OUT_DIR, category, f"{name}.jpg")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)

        crop_and_save(ref_path, box, out_path, max_dim)

        with Image.open(out_path) as out_im:
            out_size = out_im.size

        manifest.append(
            {
                "name": name,
                "file": rel_file,
                "source": source,
                "box": list(box),
            }
        )
        print(f"{rel_file:32s} {out_size[0]}x{out_size[1]}")

    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print(f"\n{len(manifest)} assets written to {OUT_DIR}")
    print(f"manifest written to {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
