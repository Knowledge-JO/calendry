import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { eventEmitter } from "../utils/eventEmitter";
import {
  commandList,
  events,
  eventScene,
  EventSceneType,
} from "../scenes/scene";
import { createEventListener, createEventStep } from "../scenes/createScene";
import { getEventListener } from "../scenes/getScene";
import { timeNowInSec } from "../utils/utils";

type SettingType = {
  label: string;
  type: string;
  description: string;
  default: string;
};

type TelexBodyType = {
  message: string;
  settings: SettingType[];
};

const telexWebhookURL = `https://ping.telex.im/v1/return/01950f5b-efdf-7cd2-b53d-80745f4e3c69?username=Calendry`;

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

// username and the curr state

const stripHTMLTags = (str: string) => str.replace(/<[^>]*>/g, "");

export async function webhook(req: Request, res: Response) {
  const body: TelexBodyType = req.body;

  const text = body.message;

  const [user] = body.settings;

  const cleanedText = stripHTMLTags(text);

  const username = user.default;
  console.log(body);
  if (username == "random-id" || username == "") {
    sendEventResponse("No username", "Update username in app settings");
    res.status(StatusCodes.ACCEPTED);
    return;
  }

  const [possibleEvent] = cleanedText.split(" ");

  if (commandList.includes(cleanedText)) {
    selectEventType(possibleEvent, username);
  } else {
    stateSteps(cleanedText, username);
  }

  res.status(StatusCodes.ACCEPTED).json({ message: "success" });
}

// 🚧👷‍♂️ Event under construction...
export async function sendEventResponse(eventName: string, message: string) {
  const link = `${telexWebhookURL}&event_name=${encodeURIComponent(
    eventName
  )}&message=${encodeURIComponent(message)}&status=success`;
  await axios.get(link);
}

const help = `
Calendry -- Usage

Pre-requisite: 
  - Set a username in the app settings
  - Set announcement channel ID in app settings

/create - Create a new event
/update - Update an existing event
/get - Get all events or an existing event
/delete - Delete an existing event
/end - End event prematurely

`;

async function selectEventType(text: string, username: string) {
  const scene = eventScene.get(username)?.scene;
  if (text == "/end") {
    if (!scene) {
      sendEventResponse("No event", "No event triggered to end.");
      return;
    }
    closeScene(scene, username);
    return;
  }
  if (scene) {
    if (commandList.includes(text))
      eventEmitter.emit(scene, username, events[scene]);
    return;
  }
  switch (text) {
    case "/help":
      await sendEventResponse(events.update, help);
      break;
    case "/create":
      // Enter create scene
      eventEmitter.emit("create", username, events.create);
      break;

    case "/update":
      eventScene.set(username, { scene: "update", time: timeNowInSec() });
      await sendEventResponse(
        events.update,
        "🚧👷‍♂️ Event under construction..."
      );
      eventScene.delete(username);
      break;

    // Enter get scene
    case "/get":
      eventEmitter.emit("get", username, events.get);
      break;

    case "/delete":
      eventScene.set(username, { scene: "delete", time: timeNowInSec() });
      await sendEventResponse(
        events.update,
        "🚧👷‍♂️ Event under construction..."
      );
      eventScene.delete(username);
      break;

    default:
      break;
  }
}

async function stateSteps(text: string, username: string) {
  const scene = eventScene.get(username)?.scene;
  switch (scene) {
    case "create":
      await createEventStep(username, text);
      break;

    // case "/update":
    // break

    // case "/get":
    //   break;

    // case "/delete":
    //  break
    default:
      break;
  }
}

async function closeScene(scene: EventSceneType, username: string) {
  eventScene.delete(username);
  await sendEventResponse(events[scene], "Event closed");
}

createEventListener();
getEventListener();

// steps
/**
 * Event steps
 * /create
 * 1. check username - if not availn
 */
