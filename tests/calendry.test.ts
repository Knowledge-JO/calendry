import axios from "axios";
import sinon from "sinon";
import { sendEventResponse } from "../controllers/telex";
import integration from "../integration.json";

const chai = async () => {
  const { expect } = await import("chai");
  return expect;
};

const BASE_URL = "http://localhost:3000";

const webhookEndpoint = "http://localhost:3000/webhook";

const telexWebhookURL = `https://ping.telex.im/v1/webhooks/01950f5b-efdf-7cd2-b53d-80745f4e3c69?username=Calendry`;

function encodeUri(eventName: string, message: string) {
  return `${telexWebhookURL}&event_name=${encodeURIComponent(
    eventName
  )}&message=${encodeURIComponent(message)}&status=success`;
}

const sinonGet = sinon.stub(axios, "get");
const sinonPost = sinon.stub(axios, "post");

describe("Calendry", function () {
  describe("integration", function () {
    it("should return correct integration.json", async function () {
      sinonGet
        .withArgs(`${BASE_URL}/integration.json`)
        .returns(Promise.resolve(integration));

      const res = await axios.get(`${BASE_URL}/integration.json`);
      const expect = await chai();
      expect(res).to.deep.eq(integration);
    });
  });

  describe("/help", function () {
    it("should send help data in response to the CMD", async () => {
      sinonPost
        .withArgs(webhookEndpoint)
        .returns(Promise.resolve({ status: 202 }));
      sinonGet
        .withArgs(encodeUri("Calendry", "Help CMDs"))
        .returns(Promise.resolve({ statusText: "Accepted" }));

      const resp = await axios.post(webhookEndpoint, {
        message: "<strong>/help</strong>",
        settings: [
          {
            label: "username",
            type: "text",
            description: "Test request",
            default: "Phenomenal",
          },
        ],
      });

      const res = await sendEventResponse("Calendry", "Help CMDs");

      const expect = await chai();

      expect(res).to.eq("Accepted");
      expect(resp.status).to.eq(202);
    });
  });

  describe("/create", function () {
    it("should return status 202 on /create", async () => {
      sinonPost
        .withArgs(webhookEndpoint)
        .returns(Promise.resolve({ status: 202 }));

      const resp = await axios.post(webhookEndpoint, {
        message: "<strong>/help</strong>",
        settings: [
          {
            label: "username",
            type: "text",
            description: "Test request",
            default: "Phenomenal",
          },
        ],
      });
      const expect = await chai();
      expect(resp.status).to.eq(202);
    });
  });
});
