import path from "path";

import fs from "fs";
import https from "https";
import { Credentials, OAuth2Client } from "../google";

const TOKEN_PATH = path.join(process.cwd(), "token.json");

const BASE_URL = "https://www.googleapis.com/auth";
const SCOPES = [
  `${BASE_URL}/calendar.readonly`,
  `${BASE_URL}/calendar.app.created`,
];

function generateAuthUrl(oAuth2Client: OAuth2Client) {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

function getAuthTokens(callback: (result: Credentials | null) => void) {
  fs.readFile(TOKEN_PATH, async (err, resp) => {
    if (err) {
      return callback(null);
    }
    const tokens: Credentials = JSON.parse(resp.toString());
    callback(tokens);
  });
}

function keepAlive(url: string) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
}

export { TOKEN_PATH, SCOPES, generateAuthUrl, getAuthTokens, keepAlive };
