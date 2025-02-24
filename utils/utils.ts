import path from "path";
import https from "https";

const TOKEN_PATH = path.join(process.cwd(), "token.json");

function keepAlive(url: string) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
}

function timeNowInSec() {
  return Math.floor(Date.now() / 1000);
}

export { TOKEN_PATH, keepAlive, timeNowInSec };
