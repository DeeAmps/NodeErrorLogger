const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf"); 

const checkAndCreateLogDirectory = (directory) => {
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
        return directory;
    }
    else{
        return directory;
    }
}

const clearLogs = (files, folderPath) => {
    files.forEach(folder => { 
        let todaysDate = new Date();
        let convertFileToDate = new Date(folder);
        let diff = dateDiffInDays(convertFileToDate, todaysDate);
        if(diff >= 7){
            rimraf(path.resolve(path.join(folderPath, folder)), (err) => {
                if(err) console.log(err);
            });
        }
    })
}

const dateDiffInDays = (a, b) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const resolveAndClearLogs = (filesArray, fpath) => {
    filesArray.forEach(folder => {
        let folderPath = path.join(fpath, folder);
        fs.readdir(folderPath, (err, files) => {
            clearLogs(files, folderPath)
        })
    });
}

module.exports = {
    checkAndCreateLogDirectory,
    resolveAndClearLogs
}