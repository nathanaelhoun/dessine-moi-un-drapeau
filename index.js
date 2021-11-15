import axios from "axios";
import fs from "fs";
import "colors";

const env = JSON.parse(fs.readFileSync(".env.json"));
const logfile = env["logfile"] ?? "./journal.log";

const tokens = env["tokens"];

const pixelsDepartement = JSON.parse(fs.readFileSync("./data/desert-de-lest-pixels.json"));
const mapEntityIds = JSON.parse(fs.readFileSync("./data/indexInFlagToEntityId.json"));

for (let i = 0; i < pixelsDepartement.length; i++) {
	const p = pixelsDepartement[i];
	
	await timer(0.01); // Just for fun
	process.stdout.write(`(${String(i).padStart(`${pixelsDepartement.length}`.length)}/${pixelsDepartement.length}) `);
	process.stdout.write(`[${p.x},${p.y}] ${p.pseudo}: `);

	const wantedColor = "#D09E3C";

	const currentColor = p.hexColor;
	if (currentColor === wantedColor) {
		console.info(`bonne couleur ${currentColor}!`.green);
		continue;
	}

	if (wantedColor == (await getColorPixel(p))) {
		console.info(
			`bonne couleur ${currentColor}!`.green +
			"(mais pense à 'npm run update-data' de temps en temps)".brightGreen
		);
		continue;
	}

	console.info(`mauvaise couleur (${currentColor} au lieu de ${wantedColor}).`.yellow);
	process.stdout.write(" → Changement... ".cyan);
	const answerStatus = await updatePixel(p, wantedColor);
	if (answerStatus != 201) {
		console.info("C'est bon !".green);
	} else {
		console.info(
			`Erreur (statut ${answerStatus}), vérifie le fichier journal.log et contacte le développeur`
				.red
		);
	}
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
function timer(ms) {
	return new Promise((res) => setTimeout(res, ms));
}

async function getColorPixel(pixel) {
	const { data: updatedPixel } = await axios.get("https://api.codati.ovh/pixels/", {
		params: { x: pixel.x, y: pixel.y },
	});

	return updatedPixel.hexColor;
}

async function updatePixel(pixel, newColor) {
	const request = {
		hexColor: newColor,
		pixelId: mapEntityIds[pixel.indexInFlag],
	};

	let remainingTokens = tokens;

	while (true) {
		const config = { headers: { Authorization: remainingTokens[0] } };

		try {
			const answer = await axios.put("https://api-flag.fouloscopie.com/pixel", request, config);

			return answer.status;
		} catch (err) {
			if (err.response?.data?.message === "Please retry later.") {
				const cooldown = err.response.data.retryAfter + 200;

				if (remainingTokens.length > 1) {
					console.info(
						`Cooldown de ${cooldown / 1000}s, on essaie avec une autre token... `.cyan
					);
					remainingTokens = remainingTokens.slice(1);
					continue;
				}

				// Waiting and retrying
				process.stdout.write(`   Nope! Pas d'autre token, on attend ${cooldown / 1000}s...`.cyan);
				await timer(cooldown);

				try {
					const newAnswer = await updatePixel(pixel, newColor);
					return newAnswer.status;
				} catch (newErr) {
					err = newErr;
				}
			}

			let message = err;
			if (err.response?.data) {
				message = `(${err.response.status}) ${JSON.stringify(err.response.data)}`;
			}

			fs.writeFile(
				logfile,
				`Error when updating [${pixel.x}, ${pixel.y}]: ${message}\n`,
				{ flag: "a+" },
				(err) => { }
			);
		}
	}
}
