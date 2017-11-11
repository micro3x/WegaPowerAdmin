


$.get("/api/appconfig", function (data) {
    $('#dbserver').val(data.db.host);
    $('#dbport').val(data.db.port | 3306);
    $('#dbclean-transmited').val(data.db.cleanTransmited | 1);
    $('#dbclean-non-transmited').val(data.db.cleanNonTransmited | 1);
    $('#dbname').val(data.db.database);
    $('#dbuser').val(data.db.user);
    $('#dbpass').val(data.db.password);

    $('#remoteserver').val(data.server.baseUrl);
    $('#remoteappid').val(data.server.appId);
    $('#remoteuser').val(data.server.username);
    $('#remotepass').val(data.server.password);

    $('#rcreadinterval').val(data.const.readInterval);
    $('#rcconsolidate').val(data.const.consolidateInterval);
    $('#rctransmit').val(data.const.transmitInterval);
    $('#rcchunksize').val(data.const.chunkSize);
    $('#rcUpdate').val(data.const.configUpdateInterval);

    $('#serport').val(data.serial.port);
    $('#serboudrate').val(data.serial.baudRate);
})


$('#saveRestartAppConfig').on('click', function () {
    var payload = {
        db: {
            host: $('#dbserver').val(),
            port: $('#dbport').val(),
            database: $('#dbname').val(),
            user: $('#dbuser').val(),
            password: $('#dbpass').val(),
            cleanTransmited: $('#dbclean-transmited').val(),
            cleanNonTransmited: $('#dbclean-non-transmited').val()
        }, server: {
            baseUrl: $('#remoteserver').val(),
            appId: $('#remoteappid').val(),
            username: $('#remoteuser').val(),
            password: $('#remotepass').val()
        }, const: {
            readInterval: $('#rcreadinterval').val(),
            consolidateInterval: $('#rcconsolidate').val(),
            transmitInterval: $('#rctransmit').val(),
            chunkSize: $('#rcchunksize').val(),
            configUpdateInterval: $('#rcUpdate').val()
        }, serial: {
            port: $('#serport').val(),
            baudRate: $('#serboudrate').val()
        }
    };
    $.post("/api/appconfig", JSON.stringify(payload),function(resp){
        alert(resp);
    })
})