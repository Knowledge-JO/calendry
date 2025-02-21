import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
// import cron from "node-cron";
import authRoute from "./routes/auth";
import calenderRoute, { authWrapper } from "./routes/calender";
import cors from "cors";
// import { keepAlive } from "./utils/utils";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.status(200).json({ status: "active" });
});

app.get("/integration.json", (req, res) => {});

app.use("/auth", authRoute);

app.use("/calendars", authWrapper, calenderRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// cron.schedule("*/5 * * * *", () => {
//   keepAlive("");
//   console.log("Pinging the server every 5 minutes");
// });
