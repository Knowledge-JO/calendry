import { NextFunction, Request, Response } from "express";
import { getAuthTokens } from "../utils/utils";
import { oAuth2Client } from "../oAuth/oAuthClient";
import { StatusCodes } from "http-status-codes";
import { OAuth2Client } from "../google";

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
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "auth failed" });
    }
  });
}

export default authMiddleware;
