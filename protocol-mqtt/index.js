common = require('../common');
//MQTT Module
var mqtt = require('mqtt')

//Protocol Api
function mqttClient(options){
    // console.log("Options: ",options);
    this.mqttClient= mqtt.connect("mqtt://server.local");//todo change
    this.sentMessages=0;
    this.pendingMessages=0;
}

mqttClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("mqttClient_init");
}

mqttClient.prototype.send=function(data){
    //console.log("mqttClient_send:",data);
    this.sentMessages++;
    this.pendingMessages++;
    var me=this;
    this.mqttClient.publish('AppliancesBucket',JSON.stringify(data), function (err) {
        me.pendingMessages--;
    });

}

mqttClient.prototype.finish=function(){
    var self=this;
    if(self.pendingMessages>0){
        console.log("Pending Messages "+self.pendingMessages);
        setTimeout(function () { self.finish();});
    }else{
        this.mqttClient.end(false,function () {
            console.log("Messages: "+ self.sentMessages);
            process.exit(0);
        })


    }
}

module.exports=mqttClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Mqtt Node')
    var opts = new common.cmdParser(false);
    client = new mqttClient(opts);
    new common.main(opts,client);
}