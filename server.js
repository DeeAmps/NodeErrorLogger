const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { SERVICE_URL } = require("./config/env.config");
const Logger = require("./routes/index");
const _MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

let port = process.env.PORT || 8089;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

setInterval(() => {
    https.get(`${SERVICE_URL}/log/clearlogs`);
}, _MILLISECONDS_IN_A_DAY); // every 5 minutes (100000)

app.use("/log", Logger);

app.listen(port, () => {
    console.log(`Logger running on localhost:${port}/api/`);
})