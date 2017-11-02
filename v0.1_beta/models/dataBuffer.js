var DataBuffer = function (interval = 60) {
    var container = [];

    this.add = function (data) {
        container.push(data);
    }

    this.flush = function () {
        container = [];
    }

    this.clean = function () {
        var maxTime = this.newestData();
        var tempContainer = [];
        container.forEach(function (element) {
            if (element[utc_time] > (maxTime - interval)) {
                tempContainer.push(element);
            }
        }, this);
        container = tempContainer;
    }

    this.oldestData = function () {
        if (container.length < 1) {
            return false;
        }
        container.sort(function (a, b) {
            return (a['utc_time'] - b['utc_time']);
        });
        return container[0];
    }

    this.newestData = function () {
        if (container.length < 1) {
            return false;
        }
        container.sort(function (a, b) {
            return (a['utc_time'] - b['utc_time']);
        });
        return container[container.length - 1];
    }

    this.consolidate = function () {
        var max = this.newestData();
        var min = this.oldestData();
        if ((max - min) > interval) {
            this.clean();
        }

        var counter = 0;
        var result = {};

        container.forEach(function (dataElement) {
            for (var key in dataElement) {
                if (dataElement.hasOwnProperty(key)) {
                    if (!result[key]) {
                        result[key] = 0;
                    }
                    result[key] += dataElement[key];
                }
            }
            counter += 1;
        }, this);

        for (var resultKey in result) {
            if (result.hasOwnProperty(resultKey)) {
                result[resultKey] = Math.floor(result[resultKey] / counter);
            }
        }
        var now = new Date;
        result['utc_time'] = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1000;
        this.flush();
        return result;
    }

    this.getLastReading = function () {
        if (container.length > 0) {
            return container[container.length - 1];
        }
        return {}
    }

}

module.exports = {
    DataBuffer: DataBuffer
}