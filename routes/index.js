const express = require("express");
const router = express.Router();
const fs = require("fs");
var fsPath = require('fs-path');
const path = require("path");
const { checkAndCreateLogDirectory, resolveAndClearLogs } = require("../helpers/logHelper");
const { LOG_DIRECTORY } = require("../config/env.config");
const moment = require("moment");

router.post('/', (req, res) => {
    if(!fs.existsSync(LOG_DIRECTORY)){
        fs.mkdirSync(LOG_DIRECTORY);
    }
    let todaysDate = new Date();
    let currentTimeFile = `${moment().format("HH-mm-s")}`;
    let errorType = req.query.type.toLowerCase().trim() || "error";
    let appName = req.query.app.toLowerCase().trim() || "other";
    let error = req.body.message
    const logLevels = ["error", "info", "warning"];
    let appDirectory = checkAndCreateLogDirectory(path.join(LOG_DIRECTORY, appName));
    logLevels.forEach((dir) => {
        let levelPath = path.join(appDirectory, dir);
        checkAndCreateLogDirectory(levelPath);
    });
    let currentLogDirectory = path.join(appDirectory, errorType); 
    let todaysDateString = todaysDate.toLocaleDateString();
    let currentLogDateDirectory = checkAndCreateLogDirectory(path.join(currentLogDirectory, todaysDateString));
    let logFile = path.join(currentLogDateDirectory,  `${errorType}@${currentTimeFile}.log`);
    fs.writeFile(logFile, error, 'utf8', (err) => {
        if(err) {
            return console.log(err);
        }
        return res.json({success: true}).status(200);
    }); 
});

router.get("/clearlogs", (req, res) => {
    let appFolders = fs.readdirSync(LOG_DIRECTORY);
    appFolders.forEach((errTypeFile) => {
        let subfiles = fs.readdirSync(path.join(LOG_DIRECTORY, errTypeFile))
        resolveAndClearLogs(subfiles, path.resolve(path.join(LOG_DIRECTORY, errTypeFile)));
    })

})

module.exports = router;