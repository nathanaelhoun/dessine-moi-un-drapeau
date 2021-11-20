import { argv } from "process";
import fs from "fs";

const env = JSON.parse(fs.readFileSync(".env.json"));

const pixelsDepartement = JSON.parse(fs.readFileSync("./data/desert-de-lest-pixels.json"));
const mapColors = JSON.parse(fs.readFileSync("./data/image-matrix.json"));

const countTotalToChange = pixelsDepartement.reduce((acc, p) => {
  if (!mapColors[p.x]?.[p.y]) {
    console.warn(`Pixel [${p.x},${p.y}] (${p.pseudo}) non présent dans l'image`.yellow);
    return acc;
  }

  return acc + (mapColors[p.x][p.y].toLowerCase() === p.hexColor.toLowerCase() ? 0 : 1);
}, 0);

if (argv.includes("--only-count")) {
  console.info(countTotalToChange);
} else {
  console.info(
    `Apparemment, il faudra changer ${countTotalToChange}/${
      pixelsDepartement.length
    } pixels de couleur, ce qui prendra ${(countTotalToChange / env["tokens"]?.length) * 2} minutes`
  );
}
