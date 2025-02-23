import fs from "fs";
import { TOKEN_PATH } from "../utils/utils";
import { Request, Response } from "express";
import {
  oAuth2Client,
  generateAuthUrl,
  getAuthTokens,
} from "../oAuth/oAuthClient";

async function login(req: Request, res: Response) {
  getAuthTokens((result) => {
    if (result !== null) {
      oAuth2Client.setCredentials(result);
      res.send("Authenticated succesfully");
      return;
    }
    const authUrl = generateAuthUrl(oAuth2Client);
    res.redirect(authUrl);
  });
}

async function redirect(req: Request, res: Response) {
  const { code } = req.query;
  if (!code) {
    res.send("Error while authenticating");
    return;
  }
  const resp = await oAuth2Client.getToken(code as string);
  oAuth2Client.setCredentials(resp.tokens);
  const payload = JSON.stringify({ ...resp.tokens });
  fs.writeFile(TOKEN_PATH, payload, (err) => {
    if (err) {
      console.log("Error while saving token");
      return;
    }
    res.send("Authenticated succesfully, You can close this tab now");
  });
}

export { login, redirect };
