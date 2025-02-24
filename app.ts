import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import authRoute from "./routes/auth";
import calenderRoute, { authWrapper } from "./routes/calender";
import telexRoute from "./routes/telex";
import cors from "cors";
import integration from "./integration.json";

import { keepAlive } from "./utils/utils";
import { connectDB } from "./db/connect";
// import { clearScene } from "./scenes/scene";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "active" });
});

app.get("/integration.json", (req, res) => {
  res.status(202).json(integration);
});

app.use("/auth", authRoute);

app.use("/calendars", authWrapper, calenderRoute);
app.use(telexRoute);

function start() {
  connectDB(process.env.MONGO_URI || "")
    .then(() => {
      console.log("DB connected");
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => console.log(err));
}

start();

cron.schedule("*/5 * * * *", () => {
  keepAlive("https://calendry.onrender.com");
  // clearScene();
  console.log("Pinging the server every 5 minutes");
});
