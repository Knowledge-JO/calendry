import { sendEventResponse } from "../controllers/telex";
import { eventEmitter } from "../utils/eventEmitter";
import { timeNowInSec } from "../utils/utils";
import { events, eventScene, StateDataType } from "./scene";

type CreateEventDataType = {
  summary?: string;
  description?: string;
  start?: {
    dateTime: number;
  };
  end?: {
    dateTime: number;
  };
  reminder?: {
    useDefault: boolean;
    overrides: {
      method: string;
      minutes: number;
    }[];
  };
};

type CreateStateType = keyof CreateEventDataType;

type CreateStateDataType = StateDataType & {
  state: CreateStateType;
};

type CED<T> = {
  [key in keyof T]: T[key];
};

const botText = ["Enter a description", "Enter start time in this format [ MM/DD/YYY, 12:00 AM/PM ]", "Enter end time in this format [ MM/DD/YYY, 12:00 AM/PM ]","Enter number of minutes before event for notification. Enter 0 for no notification", "Creating event...."]

const eventCreateState = new Map<string, CreateStateDataType>();
const buildCreateEventData = new Map<string, CED<CreateEventDataType>>();

export function createEventListener() {
  eventEmitter.on("create", (username, eventName) => {
    const scene = eventScene.get(username)?.scene;
    if (scene == "create") {
      sendEventResponse(
        `${eventName} already triggered`,
        "please continue process..."
      );

      return;
    }
    eventScene.set(username, { scene: "create", time: timeNowInSec() });
    eventCreateState.set(username, { scene: "create", state: "summary" });
    sendEventResponse(eventName, "What is the title of your event?");
    console.log("Event triggered");
  });
}

export async function createEventStep(username: string, text: string) {
  const currCreateState = eventCreateState.get(username)?.state;

  if (!currCreateState) return;

  if (buildCreateEventData.get(username)) {
    const currValues = buildCreateEventData.get(username);
    if (currCreateState == "start" || currCreateState == "end") {
      console.log(currCreateState, Number(text));
      buildCreateEventData.set(username, {
        ...currValues,
        [currCreateState]: {
          dateTime: Number(text),
        },
      });
    } else if (currCreateState == "reminder") {
      buildCreateEventData.set(username, {
        ...currValues,
        [currCreateState]: {
          useDefault: Number(text) > 0 ? false : true,
          overrides: [
            {
              method: "email",
              minutes: Number(text),
            },
          ],
        },
      });
    } else {
      buildCreateEventData.set(username, {
        ...currValues,
        [currCreateState]: text,
      });
    }
  } else {
    buildCreateEventData.set(username, {
      [currCreateState]: text,
    });
  }

  for(const resp of botText){
    if(text == resp) return
  }

  switch (currCreateState) {
    case "summary":
      await sendEventResponse(events.create, "Enter a description");
      eventCreateState.set(username, { scene: "create", state: "description" });
      break;
    case "description":
      await sendEventResponse(
        events.create,
        "Enter start time in this format [ MM/DD/YYY, 12:00 AM/PM ]"
      );
      eventCreateState.set(username, { scene: "create", state: "start" });
      break;
    case "start":
      await sendEventResponse(
        events.create,
        "Enter end time in this format [ MM/DD/YYY, 12:00 AM/PM ]"
      );
      eventCreateState.set(username, { scene: "create", state: "end" });
      break;
    case "end":
      await sendEventResponse(
        events.create,
        "Enter number of minutes before event for notification. Enter 0 for no notification"
      );
      eventCreateState.set(username, { scene: "create", state: "reminder" });
      break;
    case "reminder":
      await sendEventResponse(events.create, "Creating event....");
      console.log(buildCreateEventData.get(username));
      eventCreateState.delete(username);
      break;
    default:
      break;
  }
}
