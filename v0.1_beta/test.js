var serialjs = require('serialport-js')

serialjs.open(
    '/dev/ttyUSB0',
    start,
    '\n'
);

function start(port){
    port.on(
        'data',
        gotData
    );

    port.send(Buffer.from([165, 3, 10, 3, 148, 73]))
}

function gotData(data){
    console.log(data);
}