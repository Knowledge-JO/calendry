import dotenv from "dotenv";
dotenv.config();

import * as calendar from "@googleapis/calendar";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

export const oAuth2Client = new calendar.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000/redirect"
);
