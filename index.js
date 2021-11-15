import axios from "axios";
import fs from "fs";
import colors from "colors";

const env = JSON.parse(fs.readFileSync(".env.json"));
const logfile = env["logfile"] ?? "./journal.log";

const myToken = env["tokens"][0];

const pixelsDepartement = JSON.parse(
	fs.readFileSync("./data/desert-de-lest-pixels.json")
);
const mapEntityIds = JSON.parse(
	fs.readFileSync("./data/indexInFlagToEntityId.json")
);

for (const p of pixelsDepartement) {
	await timer(0.01); // Just for fun
	process.stdout.write(`Checking pixel [${p.x},${p.y}] of ${p.pseudo}: `);

	const wantedColor = "#D09E3C";

	const currentColor = p.hexColor; // await getColorPixel(p);
	if (currentColor === wantedColor) {
		console.info(`good color ${currentColor}!`.green);
		continue;
	}

	console.info(`bad color (${currentColor} instead of ${wantedColor}).`.yellow);
	process.stdout.write(" → Updating... ".cyan);
	const answerStatus = await updatePixel(p, wantedColor);
	if (answerStatus != 201) {
		console.info("Done!".green);
	} else {
		console.info(`Error (status ${answerStatus}), check journal.log file`.red);
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
	const { data: updatedPixel } = await axios.get(
		"https://api.codati.ovh/pixels/",
		{
			params: { x: pixel.x, y: pixel.y },
		}
	);

	return updatedPixel.hexColor;
}

async function updatePixel(pixel, newColor) {
	const entityId = mapEntityIds[pixel.indexInFlag];

	const request = { hexColor: newColor, pixelId: entityId };
	const config = { headers: { Authorization: myToken } };

	try {
		const answer = await axios.put(
			"https://api-flag.fouloscopie.com/pixel",
			request,
			config
		);

		return answer.status;
	} catch (err) {
		if (err.response.data.message === "Please retry later.") {
			const cooldown = err.response.data.retryAfter + 200;
			process.stdout.write(`Waiting ${cooldown} for cooldown...`.cyan);
			await timer(cooldown);

			try {
				const newAnswer = await updatePixel(pixel, newColor);
				return newAnswer.status;
			} catch (newErr) {
				err = newErr;
			}
		}

		fs.writeFile(
			logfile,
			`Error when updating [${pixel.x}, ${pixel.y}] (${err.response.status
			}): ${JSON.stringify(err.response.data)}\n`,
			{ flag: "a+" },
			(err) => { }
		);
	}
}
