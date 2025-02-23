import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

import * as calendar from "@googleapis/calendar";
import { Credentials, OAuth2Client } from "../google";
import { TOKEN_PATH } from "../utils/utils";
// import User from "../models/user";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const oAuth2Client = new calendar.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000/redirect"
);

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

// async function getAuthTokens(userId: string) {
//   const user = await User.findOne({ userId });
//   if (!user) {
//     return null;
//   }

//   return user.tokens;
// }

function getAuthTokens(callback: (result: Credentials | null) => void) {
  fs.readFile(TOKEN_PATH, async (err, resp) => {
    if (err) {
      return callback(null);
    }
    const tokens: Credentials = JSON.parse(resp.toString());
    callback(tokens);
  });
}

export { oAuth2Client, getAuthTokens, generateAuthUrl };
