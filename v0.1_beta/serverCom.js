var Client = require('node-rest-client-promise').Client;

var client = new Client();

var ServerCommunicator = function (serverSettings) {

    var baseUrl = serverSettings.baseUrl;
    var headers = {
        "X-Parse-Application-Id": serverSettings.appId,
        "Content-Type": "application/json"
    }
    var user = {};

    var transmit = function (data) {
        var transmitData = bulkSend;
        if (!user['sessionToken']) {
            return this.login().then(function (userData, response) {
                if (userData.response['statusCode'] === 200) {
                    user = userData.data;
                }
                if (user['sessionToken']) {
                    return transmitData(data);
                }
            })
        }
        else {
            return transmitData(data);
        }
    }

    // var sendData = function (data) {
    //     var path = '/classes/Data';
    //     var args = {
    //         data: JSON.stringify(buildTransmisionPackage(data)),
    //         headers: headers
    //     }
    //     args.headers['X-Parse-Session-Token'] = user['sessionToken'];
    //     return client.postPromise(baseUrl + path, args)
    // }

    var bulkSend = function (data) {
        var path = '/batch';
        var args = {
            headers: headers,
            data: JSON.stringify(getRequsts(data))
        };
        args.headers['X-Parse-Session-Token'] = user['sessionToken'];
        return client.postPromise(baseUrl + path, args);
    }

    function getRequsts(data) {
        var pack = { requests: [] };
        data.forEach(function (element) {
            var req = {
                "method": "POST",
                "path": "/parse/classes/Data",
                "body": buildTransmisionPackage(element)
            }
            pack.requests.push(req);
        }, this);
        return pack;
    }

    var login = function () {
        var path = '/login'
        var args = {
            parameters: { username: serverSettings.username, password: serverSettings.password },
            headers: headers
        }

        return client.getPromise(baseUrl + path, args);
    }

    function buildTransmisionPackage(rawData) {
        var package = {
            "nc": 0, "windv": 0, "solA": 0, "out1": 0, "dayOrNight": 0, "windA": 0,
            "dumpA": 0, "mppt": 0, "Controller": {}, "outA": 0,
            "id": 0, "batv": 0, "batCapacity": 0, "batState": 0,
            "out2": 0, "rpm": 0, "utc_time": 0, "solv": 0
        };
        for (var key in package) {
            if (package.hasOwnProperty(key)) {
                if (rawData.hasOwnProperty(key)) {
                    package[key] = rawData[key];
                }
            }
        }
        package.Controller = {
            "__type": "Pointer",
            "className": "_User",
            "objectId": user.objectId
        };
        return package;
    }

    return {
        transmit: transmit,
        login: login
    }
}

module.exports = { ServerCommunicator: ServerCommunicator };


