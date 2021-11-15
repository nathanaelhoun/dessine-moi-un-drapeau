import axios from "axios";
import fs from "fs";

let flag;

try {
	flag = await axios.get(
		"https://api-flag.fouloscopie.com/flag",
	);
} catch (err) {
	console.error(err.response.data);
}

const map = {};

flag.data.forEach(pixel => {
	map[pixel.indexInFlag] = pixel.entityId;
});

fs.writeFileSync(
	"./data/indexInFlagToEntityId.json",
	JSON.stringify(map, null, 2)
);

