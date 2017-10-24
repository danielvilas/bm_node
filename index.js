common=require('./common')

/*
* This file creates a client with all the options
* */

console.log('Benchmark Node')
var cmd = new common.cmdParser(true);
var client;
switch (cmd.options.protocol) {
    case 'MQTT':
        MqttClient=require('./protocol-mqtt')
        client = new MqttClient(cmd);
        break;
    case 'KAFKA':
        KafkaClient=require('./protocol-kafka')
        client = new KafkaClient(cmd);
        break;
    case 'REST':
        RestClient=require('./protocol-rest')
        client = new RestClient(cmd);
        break;
    case 'SOAP':
        SoapClient=require('./protocol-soap')
        client = new SoapClient(cmd);
        break;
    default:
        console.log("Procol must be KAFKA, MQTT, REST or SOAP")
        break;
}


new common.main(cmd,client);