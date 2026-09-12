"""Collect every Material Symbols Rounded icon name referenced by the app.

Icons are used in three shapes:
  * inline JSX:      <span className="material-symbols-rounded">search</span>
  * data driven:     { id: 'cat-1', icon: 'restaurant' }
  * dynamic fields:  {acc.icon} / {tx.categoryIcon} resolved from mockData

Writes one icon name per line to the output path so it can be handed to
`trim-icon-font.py` + `pyftsubset`.
"""

import re
import pathlib
import sys

CODEPOINTS = sys.argv[1]
SRC = pathlib.Path(sys.argv[2])
OUT = sys.argv[3]

valid = set()
for line in open(CODEPOINTS, encoding="utf-8"):
    parts = line.split()
    if len(parts) == 2:
        valid.add(parts[0])

found = set()

for path in SRC.rglob("*"):
    if path.suffix not in {".ts", ".tsx"}:
        continue
    text = path.read_text(encoding="utf-8")

    # inline icon ligatures inside an icon span
    for m in re.finditer(r"material-symbols-rounded[^>]*>\s*\{?\s*([a-z][a-z_0-9]*)", text):
        found.add(m.group(1))

    # quoted strings that happen to be icon names (icon: 'x', fallbacks, arrays)
    for m in re.finditer(r"['\"]([a-z][a-z_0-9]*)['\"]", text):
        found.add(m.group(1))

    # data driven icon fields in mock data
    for m in re.finditer(r"(?:categoryIcon|icon):\s*'([a-z_0-9]+)'", text):
        found.add(m.group(1))

icons = sorted(found & valid)
if not icons:
    raise SystemExit("no icon names resolved - check the codepoints file")

open(OUT, "w", encoding="utf-8").write("\n".join(icons) + "\n")
print(f"{len(icons)} icons -> {OUT}")
print(" ".join(icons))
