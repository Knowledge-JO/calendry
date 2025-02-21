import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

import { getAuthTokens } from "../utils/utils";
import { oAuth2Client } from "../oAuth/oAuthClient";

export interface IReq extends Request {
  auth: OAuth2Client;
}

async function authMiddleware(req: IReq, res: Response, next: NextFunction) {
  getAuthTokens((result) => {
    if (result !== null) {
      req.auth = oAuth2Client;
      oAuth2Client.setCredentials(result);
      next();
    } else {
      res.status(500).json({ message: "auth failed" });
    }
  });
}

export default authMiddleware;
