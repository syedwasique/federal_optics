import re
import json
import os

from build_clear_contacts import clear_contacts
from build_all_new_products import accessories, sunglasses, eyeglasses, color_contacts_new

def to_ts_obj(obj, indent=2):
    ind = " " * indent
    lines = ["{\n"]
    for k, v in obj.items():
        if v is None:
            continue
        if isinstance(v, str):
            # Escape newlines and quotes
            escaped = v.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
            lines.append(f'{ind}  {k}: "{escaped}",\n')
        elif isinstance(v, bool):
            lines.append(f'{ind}  {k}: {"true" if v else "false"},\n')
        elif isinstance(v, (int, float)):
            lines.append(f'{ind}  {k}: {v},\n')
        elif isinstance(v, list):
            if not v:
                lines.append(f'{ind}  {k}: [],\n')
            elif isinstance(v[0], str):
                lines.append(f'{ind}  {k}: [\n')
                for item in v:
                    esc = item.replace("\\", "\\\\").replace('"', '\\"')
                    lines.append(f'{ind}    "{esc}",\n')
                lines.append(f'{ind}  ],\n')
            elif isinstance(v[0], dict):
                lines.append(f'{ind}  {k}: [\n')
                for item in v:
                    lines.append(f'{ind}    ' + to_ts_obj(item, indent + 4).strip() + ',\n')
                lines.append(f'{ind}  ],\n')
        elif isinstance(v, dict):
            lines.append(f'{ind}  {k}: ' + to_ts_obj(v, indent + 2).strip() + ',\n')
    lines.append(f"{ind}}}")
    return "".join(lines)

print("Sample TS output for one product:")
print(to_ts_obj(clear_contacts[0])[:400])

