
var currentConfig;
var fs = require("fs");

function getConfig() {
    if (currentConfig) {
        return currentConfig;
    }
    currentConfig = JSON.parse(fs.readFileSync("appSettings.json", 'utf8'));
    return currentConfig;
}

function saveConfig(config) {
    fs.writeFile("appSettings.json", JSON.stringify(config), { encoding: 'utf8' },
        function (err) {
            console.log(err)
        });
}

module.exports = {
    getConfig: getConfig,
    saveConfig: saveConfig
}