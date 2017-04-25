// todo requires

var ServerCommunicator = function (serverSettings) {

    var transmit = function (){
        console.log('transmiting...')
    }

    return {
        transmit: transmit,
    }
}

module.exports = { ServerCommunicator: ServerCommunicator };