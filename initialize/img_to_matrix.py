# Script réalisé avec amour par Nath' ~

from PIL import Image, ImageColor
import json

# Le décalage correspond à la position où l'image sera réalisée sur le drapeau
decalageX = 200
decalageY = 150
width = 41
height = 60
input_file = 'data/source.png'
output_file = 'data/matrix.json'


img = Image.open(input_file)
pix = img.load()

if (img.width != width):
    print("Taille de l'image incorrecte : {} pixels de large au lieu de {} attendus".format(img.width, width))

if (img.height != height):
    print("Taille de l'image incorrecte : {} pixels de haut au lieu de {} attendus".format(img.height, height))

json_matrix = dict()
for iX in range(img.width):
    x = iX + decalageX
    
    json_matrix[x] = dict()
    for iY in range(img.height):
        y = iY + decalageY
        
        color_hex = '#{:02x}{:02x}{:02x}'.format(*pix[iX, iY])    
        json_matrix[x][y] = color_hex

with open(output_file, 'w') as convert_file:
    convert_file.write(json.dumps(json_matrix, indent=2))
    print("Stockée dans {}".format(output_file))
