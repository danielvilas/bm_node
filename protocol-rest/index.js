common = require('../common');
//MQTT Module
var Client = require('node-rest-client').Client;

//Protocol Api
function restClient(options){
    this.client = new Client();
    this.client.registerMethod("sendAppliancesData", "http://server.local:9090/api/addBucket", "POST");
}

restClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("restClient_init");
}

restClient.prototype.send=function(data){
    //console.log("mqttClient_send:",data);
    var args = {
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    };
    this.client.methods.sendAppliancesData(args,function (datar, response) {
        // parsed response body as js object
        if(response.statusCode!=200){
            console.log(datar);
            // raw response
            console.log(response);
        }
    });
}

module.exports=restClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Mqtt Node')
    var opts = new common.cmdParser(false);
    client = new restClient(opts);
    new common.main(opts,client);
}