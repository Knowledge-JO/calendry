import * as google from "@googleapis/calendar";

type OAuth2Client = google.Auth.OAuth2Client;
type Credentials = google.Auth.Credentials;
type Event = google.calendar_v3.Schema$Event;

export { OAuth2Client, Credentials, Event };
