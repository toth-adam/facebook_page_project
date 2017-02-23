from PIL import ImageFont, ImageDraw, Image

HEIGHTS = (250, 500)

german_word = "der Jäger"
hungarian_word = "vadász"

base = Image.open("images/bg.jpg").convert("RGBA")

txt = Image.new("RGBA", base.size, (255, 255, 255, 0))

german_font = ImageFont.truetype("fonts/Oswald-Bold.ttf", 92)
hungarian_font = ImageFont.truetype("fonts/Montserrat-Regular.otf", 76)

drawing_context = ImageDraw.Draw(txt)

# Get size of text
german_w, german_h = drawing_context.textsize(german_word, german_font)
hungarian_w, hungarian_h = drawing_context.textsize(hungarian_word, hungarian_font)

drawing_context.text((base.size[0]/2 - german_w/2, HEIGHTS[0]), german_word, (0, 0, 0, 255), german_font)
drawing_context.text((base.size[0]/2 - hungarian_w/2, HEIGHTS[1]), hungarian_word, (0, 0, 0, 255), hungarian_font)

output = Image.alpha_composite(base, txt)

output.save("outputs/test1.png")
