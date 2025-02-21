import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_ID, CLIENT_SECRET } = process.env;

export const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000/redirect"
);
