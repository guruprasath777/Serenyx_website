# Web-sized logo copies

Generated from the full-resolution originals one level up. The site imports
**these**, not the originals — `Serenyx Eagle.png` alone is 1.4 MB, larger than
the entire JS bundle, and it renders at 40–48 px tall.

| file                    | source              | size    | was     |
| ----------------------- | ------------------- | ------- | ------- |
| `serenyx-eagle.png`     | `Serenyx Eagle.png` | 151×160 | 1207×1280 |
| `serenyx-wordmark.png`  | `Serenyx text.png`  | 470×112 | 1280×305  |

Heights are ~3.3× the largest CSS size they are drawn at (`h-12` = 48 px for the
eagle, `h-8` = 32 px for the wordmark), which covers 3× DPR screens. Alpha is
preserved — the footer inverts the wordmark with `brightness-0 invert`.

To regenerate after a logo redraw, keep the originals as the source of truth:

    ffmpeg -i "../Serenyx Eagle.png" -vf "scale=-1:160:flags=lanczos" \
           -pix_fmt rgba -compression_level 100 -y serenyx-eagle.png
