import axios from "axios";
import fs from "fs";
import colors from "colors";

const env = JSON.parse(fs.readFileSync(".env.json"));
const logfile = env["logfile"] ?? "./journal.log";

const tokens = env["tokens"];

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

	const currentColor = p.hexColor;
	if (currentColor === wantedColor) {
		console.info(`good color ${currentColor}!`.green);
		continue;
	}

	if (wantedColor == await getColorPixel(p)) {
		console.info(`good color ${currentColor}! (but think to npm run update-data sometimes)`.green);
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
	const request = {
		hexColor: newColor,
		pixelId: mapEntityIds[pixel.indexInFlag],
	};

	let remainingTokens = tokens;

	while (true) {
		const config = { headers: { Authorization: remainingTokens[0] } };

		try {
			const answer = await axios.put(
				"https://api-flag.fouloscopie.com/pixel",
				request,
				config
			);

			return answer.status;
		} catch (err) {
			if (err.response?.data?.message === "Please retry later.") {
				const cooldown = err.response.data.retryAfter + 200;

				if (remainingTokens.length > 1) {
					process.stdout.write(`Cooldown of ${cooldown}, trying with another token...`.cyan);
					remainingTokens = remainingTokens.slice(1)
					continue;
				}

				// Waiting and retrying
				process.stdout.write(`No other token, waiting ${cooldown} for cooldown...`.cyan);
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
