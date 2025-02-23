import axios from "axios";
import { Request, Response } from "express";

type SettingType = {
  label: string;
  type: string;
  description: string;
  default: string;
};

type TelexBodyType = {
  body: string;
  settings: SettingType[];
};

const events = {
  create: "Calendry - Create Event",
  update: "Calendry - Update Event",
  get: "Calendry - Get Event",
  delete: "Calendry - Delete Event",
};

const telexWebhookURL = `https://ping.telex.im/v1/webhooks/01950f5b-efdf-7cd2-b53d-80745f4e3c69?username=Calendry`;

//event_name=Calendry&message=This is a sample webhook&status=success&username=Calendry
// 01950f5b-efdf-7cd2-b53d-80745f4e3c69
// https://ping.telex.im/v1/webhooks/01950f5b-efdf-7cd2-b53d-80745f4e3c69?event_name=Sample Event&message=This is a sample webhook&status=success&username=Collins

// Events
/**
 * 1. create
 * 2. Update
 * 3. Delete
 * 4. Get
 */

type EventStateType = "create" | "update" | "get" | "delete";

const eventState = new Map<string, EventStateType>(); // username and the curr state

const stripHTMLTags = (str: string) => str.replace(/<[^>]*>/g, "");

export async function webhook(req: Request, res: Response) {
  const body: TelexBodyType = req.body;

  const text = body.body;

  const [user] = body.settings;

  const cleanedText = stripHTMLTags(text);

  const username = user.default;

  const [possibleEvent] = cleanedText.split(" ");

  const eventType = selectEventType(possibleEvent, username);

  if (eventType) sendEventResponse(eventType);

  console.log({ cleanedText, text, settings: body.settings, username });

  res.status(202).json({ message: "success" });
}

async function sendEventResponse(eventType: string) {
  await axios.get(
    `${telexWebhookURL}&event_name=${eventType}&message=${"Enter your username to continue..."}&status=success`
  );
}

function selectEventType(text: string, username: string) {
  switch (text) {
    case "/create":
      if (eventState.get(username) == "create") {
        return `${events.create} Triggered, please continue process...`;
      }
      eventState.set(username, "create");
      return events.create;
    case "/update":
      if (eventState.get(username) == "update") {
        return `${events.create} Triggered, please continue process...`;
      }
      eventState.set(username, "update");
      return events.update;
    case "/get":
      eventState.set(username, "get");
      return events.get;
    case "/delete":
      eventState.set(username, "delete");
      return events.delete;
    default:
      break;
  }
}
