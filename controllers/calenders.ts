import { Response } from "express";
import { google } from "googleapis";
import { IReq } from "../middlewares/auth";

async function getCalendars(req: IReq, res: Response) {
  const oAuth2Client = req.auth;
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const resp = await calendar.calendars.get({
    calendarId:
      "81b4f9e40f460480b693f2be6d126494a970b28efd06d8a6df79e0767eb0c5e1@group.calendar.google.com",
  });

  res.status(201).json(resp.data);
}

async function createCalendar(req: IReq, res: Response) {
  const oAuth2Client = req.auth;
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const resp = await calendar.calendars.insert({
    requestBody: {
      id: "telexcalendar@group.calendar.google.comar",
      summary: "Telex calendar test",
      conferenceProperties: {
        allowedConferenceSolutionTypes: [
          "eventHangout",
          "eventNamedHangout",
          "hangoutsMeet",
        ],
      },
    },
  });

  res.status(200).json(resp.data);
}

async function createEvent(req: IReq, res: Response) {
  const oAuth2Client = req.auth;
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const resp = await calendar.events.insert({
    calendarId:
      "81b4f9e40f460480b693f2be6d126494a970b28efd06d8a6df79e0767eb0c5e1@group.calendar.google.com",
    sendUpdates: "all",
    requestBody: {
      start: {
        dateTime: new Date().toISOString(),
      },
      end: {
        dateTime: new Date(Date.now() + 600000).toISOString(),
      },

      attendees: [
        {
          email: "okhakumheknowledge@gmail.com",
        },
      ],

      reminders: {
        useDefault: false,
        overrides: [
          {
            method: "email",
            minutes: 3,
          },
        ],
      },
    },
  });

  res.status(resp.status).json(resp.data);
}

export { createCalendar, getCalendars, createEvent };
