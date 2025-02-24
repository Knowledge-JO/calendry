import { sendEventResponse } from "../controllers/telex";
import { eventEmitter } from "../utils/eventEmitter";
import { timeNowInSec } from "../utils/utils";
import { eventScene } from "./scene";

export function getEventListener() {
  eventEmitter.on("get", (username, eventName) => {
    eventScene.set(username, { scene: "get", time: timeNowInSec() });
    sendEventResponse(eventName, "List of events").then(() => {
      eventScene.delete(username);
    });
  });
}
