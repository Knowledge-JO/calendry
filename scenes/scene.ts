import { timeNowInSec } from "../utils/utils";

export const events = {
  create: "Calendry - Create Event",
  update: "Calendry - Update Event",
  get: "Calendry - Get Event",
  delete: "Calendry - Delete Event",
};

export const eventScene = new Map<string, SceneDataType>();

export type EventSceneType = "create" | "update" | "get" | "delete";
export const commandList = [
  "/help",
  "/create",
  "/update",
  "/get",
  "/delete",
  "/end",
];

export type SceneDataType = {
  scene: EventSceneType;
  time: number;
};

export type StateDataType = {
  scene: EventSceneType;
};

export function clearScene() {
  const stateEntries = eventScene.entries();

  for (const [username, stateData] of stateEntries) {
    if (stateData.time - timeNowInSec() >= 300) {
      eventScene.delete(username);
    }
  }
}
