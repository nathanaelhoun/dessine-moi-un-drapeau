import axios from "axios";
import fs from "fs";
import { exit } from "process";
import "colors";

console.info("Récupérations des données".cyan);

const pixelsDepartement = await axios.get("https://api.codati.ovh/pixels/zone/", {
  params: { departement: "Désert de l'Est" },
});

fs.writeFileSync(
  "./data/desert-de-lest-pixels.json",
  JSON.stringify(pixelsDepartement.data, null, 2)
);

console.info("Terminé !".green);

exit(0);
