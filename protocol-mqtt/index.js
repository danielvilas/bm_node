common = require('../common');
//MQTT Module
var mqtt = require('mqtt')

//Protocol Api
function mqttClient(options){
    // console.log("Options: ",options);
    this.mqttClient= mqtt.connect("mqtt://server.local");//todo change
}

mqttClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("mqttClient_init");
}

mqttClient.prototype.send=function(data){
    //console.log("mqttClient_send:",data);
    this.mqttClient.publish('AppliancesBucket',JSON.stringify(data))
}

module.exports=mqttClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Mqtt Node')
    var opts = new common.cmdParser(false);
    client = new mqttClient(opts);
    new common.main(opts,client);
}