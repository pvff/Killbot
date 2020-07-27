require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const moment = require("moment");
const images = require("./images");
const fs = require("fs");
const EVENTS_ENDPOINT = "https://gameinfo.albiononline.com/api/gameinfo/events";

let event = null;
fs.readFile("./debug/testEvent.js", (err, data) => {
  if (err) return;
  event = JSON.parse(data)[0];
});

app.get("/", async (req, res) => {
  if (!event) {
    try {
      const response = await axios.get(EVENTS_ENDPOINT, {
        params: {
          offset: 0,
          limit: 1,
          timestamp: moment().unix(),
        },
      });
      event = response.data[0];
    } catch (e) {
      return res.send(`Failed to fetch event. Please try again: ${e}`);
    }
  }
  res.contentType("image/png");
  return res.end(await images.generateEventImage(event), "binary");
});

app.listen(3000, () => {
  console.log("Please go to http://localhost:3000/");
});
