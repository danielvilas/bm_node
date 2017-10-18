common=require('./common')
MqttClient=require('./protocol-mqtt')


/*
* This file creates a client with all the options
* */

console.log('Benchmark Node')
var cmd = new common.cmdParser(true);
var client;
switch (cmd.options.protocol) {
    case 'MQTT':
        client = new MqttClient(cmd);
        break;
    default:

        break;
}


new common.main(cmd,client);