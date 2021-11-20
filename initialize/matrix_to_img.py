# Script réalisé avec amour par Nath' ~

from PIL import Image, ImageColor
import json

# Le décalage correspond à la position où l'image sera réalisée sur le drapeau
decalageX = 200
decalageY = 150
width = 41
height = 60

# Variable d'initialisation
file = open('data/matrix.json')
json = json.load(file)

img = Image.new('RGB', [width,height])
array = img.load()
for iX,column in json.items():
    for iY,color in column.items():
        x = int(iX) - decalageX
        y = int(iY) - decalageY
        array[x,y] = (ImageColor.getcolor(color, "RGB"))

img.save("data/check.png")
print("Image reconstituée dans check.png")
