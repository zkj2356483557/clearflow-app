"""Trim the Material Symbols Rounded variable font down to the icons this app uses.

The font maps icon names to glyphs through `rlig` ligatures, so a plain
`pyftsubset --text="add,search,..."` still drags in every icon glyph through
layout closure. This script first deletes the ligature rules we do not need,
then hands the font to pyftsubset.
"""

import sys

from fontTools.ttLib import TTFont

FONT_IN = sys.argv[1]
FONT_OUT = sys.argv[2]
ICON_NAMES = sys.argv[3]
CODEPOINTS = sys.argv[4]

font = TTFont(FONT_IN)
cmap = font.getBestCmap()
reverse_cmap = {v: k for k, v in cmap.items()}

names = [line.strip() for line in open(ICON_NAMES, encoding="utf-8") if line.strip()]
codepoints = {}
for line in open(CODEPOINTS, encoding="utf-8"):
    parts = line.split()
    if len(parts) == 2:
        codepoints[parts[0]] = int(parts[1], 16)

missing = [n for n in names if n not in codepoints]
target_glyphs = {cmap[codepoints[n]] for n in names if codepoints.get(n) in cmap}
print(f"icons requested: {len(names)}  glyphs resolved: {len(target_glyphs)}  missing: {missing}")


def trim_lookup(lookup):
    subtables = []
    if lookup.LookupType == 4:
        subtables = list(lookup.SubTable)
    elif lookup.LookupType == 7:
        subtables = [st.ExtSubTable for st in lookup.SubTable if getattr(st, "ExtSubTable", None)]

    kept = dropped = 0
    for st in subtables:
        if not hasattr(st, "ligatures"):
            continue
        trimmed = {}
        for first, ligatures in st.ligatures.items():
            keep = [lig for lig in ligatures if lig.LigGlyph in target_glyphs]
            kept += len(keep)
            dropped += len(ligatures) - len(keep)
            if keep:
                trimmed[first] = keep
        st.ligatures = trimmed
    return kept, dropped


total_kept = total_dropped = 0
for lookup in font["GSUB"].table.LookupList.Lookup:
    kept, dropped = trim_lookup(lookup)
    total_kept += kept
    total_dropped += dropped

print(f"ligature rules kept: {total_kept}  dropped: {total_dropped}")
font.save(FONT_OUT)
print("wrote", FONT_OUT)
