from PIL import ImageFont, ImageDraw, Image
from openpyxl import load_workbook
import os
from datetime import timezone
import json

# TODO: We can use 3 times bigger fonts and resize to have nicer (anti-aliased) texts
# TODO: Or rewrite in matplotlib

# Image generation specific constants
HEIGHTS = (250, 500)
BASE = Image.open("images/bg.jpg").convert("RGBA")
GERMAN_FONT = ImageFont.truetype("fonts/Oswald-Bold.ttf", 92)
HUNGARIAN_FONT = ImageFont.truetype("fonts/Montserrat-Regular.otf", 76)

# Excel pre-processing
wb = load_workbook(os.path.join(os.path.dirname(__file__), "excel/nemet_szavak_content.xlsx"))
ws = wb.active

ids, german_words, hungarian_words, captions, dates = [[cell.value for cell in ws[col] if cell.value is not None][1:]
                                                       for col in ("A", "B", "C", "D", "E")]

unix_timestamps = [int(d.replace(tzinfo=timezone.utc).timestamp()) for d in dates]


def image_generator(german_word, hungarian_word, output_file_number):

    txt = Image.new("RGBA", BASE.size, (255, 255, 255, 0))

    drawing_context = ImageDraw.Draw(txt)

    # Get size of text
    german_w, german_h = drawing_context.textsize(german_word, GERMAN_FONT)
    hungarian_w, hungarian_h = drawing_context.textsize(hungarian_word, HUNGARIAN_FONT)

    drawing_context.text((BASE.size[0] / 2 - german_w / 2, HEIGHTS[0]), german_word, (0, 0, 0, 255), GERMAN_FONT)
    drawing_context.text((BASE.size[0] / 2 - hungarian_w / 2, HEIGHTS[1]), hungarian_word, (0, 0, 0, 255), HUNGARIAN_FONT)

    output = Image.alpha_composite(BASE, txt)

    output.save("outputs/" + str(output_file_number) + ".png")

# Image generation
for g_w, h_w, o_f_n in zip(german_words, hungarian_words, ids):
    image_generator(g_w, h_w, o_f_n)

# Schedules in JSON
with open("outputs/times.json", "w") as f:
    json.dump({k: [v1, v2] for k, v1, v2 in zip(ids, captions, unix_timestamps)}, f)
