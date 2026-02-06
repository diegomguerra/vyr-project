import re
from pathlib import Path

pbx = Path("ios/App/App.xcodeproj/project.pbxproj")
txt = pbx.read_text(encoding="utf-8", errors="replace")

# 1) remove merge conflict markers if any are present (fail hard)
if any(m in txt for m in ["<<<<<<<", "=======", ">>>>>>>"]):
    raise SystemExit("ERROR: Merge conflict markers found in project.pbxproj. Resolve manually first.")

# 2) Quote any keys that contain bracket selectors like KEY[sdk=iphoneos*]
# Pattern: start-of-line spaces + KEY[something] =   ->  "KEY[something]" =
pattern = re.compile(r'^(\s*)([A-Za-z0-9_]+(?:\[[^\]]+\])+)\s*=', re.MULTILINE)

def repl(m):
    indent, key = m.group(1), m.group(2)
    return f'{indent}"{key}" ='

new_txt = pattern.sub(repl, txt)

# If nothing changed, still ok.
if new_txt != txt:
    pbx.write_text(new_txt, encoding="utf-8")
    print("Updated bracketed keys in project.pbxproj")
else:
    print("No bracketed keys needed quoting")
