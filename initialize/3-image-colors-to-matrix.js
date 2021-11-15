import fs from "fs";
import { exit } from "process";
import "colors";

console.info("Transformation de l'image".cyan);

let colors
try {
	colors = JSON.parse(fs.readFileSync("./data/image-colors.json"))[0];
} catch (err) {
	console.warn("Le fichier ./data/image-colors.json doit être créé au bon format (voir README.md)")
}



const map = {};

Object.keys(colors).forEach((color) => {
	const pixels = colors[color];

	pixels.forEach((p) => {
		const [x, y] = p.split(":");

		if (!map[x]) {
			map[x] = {};
		}

		map[x][y] = color.toUpperCase();
	});
});

fs.writeFileSync(
	"./data/image-matrix.json",
	JSON.stringify(map, null, 2)
);

console.info("Terminé !".green);

exit(0);
