common = require('../common');
//MQTT Module
var Client = require('node-rest-client').Client;

//Protocol Api
function restClient(options){
    this.client = new Client();
    this.client.registerMethod("sendAppliancesData", "http://server.local:9090/api/addPacket", "POST");
    this.sentMessages=0;
    this.pendingMessages=0;
}

restClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("restClient_init");
}

restClient.prototype.send=function(data){
    //console.log("mqttClient_send:",data);
    var bucket=new types.Packet(data.date);
    bucket.tvSeconds+=data.tv;
    bucket.bluraySeconds+=data.bluray;
    bucket.appleTvSeconds+=data.appleTv;
    bucket.ipTvSeconds+=data.ipTv;
    var args = {
        data: JSON.stringify(bucket),
        headers: { "Content-Type": "application/json" }
    };
    this.sentMessages++;
    this.pendingMessages++;
    var self = this;
    this.client.methods.sendAppliancesData(args,function (datar, response) {
        // parsed response body as js object
        if(response.statusCode!=200){
            console.log(datar);
            // raw response
            console.log(response);
        }
        self.pendingMessages--;
    });
}


restClient.prototype.finish=function(){
    var self=this;
    if(self.pendingMessages>0){
        console.log("Pending Messages "+self.pendingMessages);
        setTimeout(function () { self.finish();});
    }else{
        console.log("Messages: "+ self.sentMessages);
        process.exit(0);
    }
}

module.exports=restClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Mqtt Node')
    var opts = new common.cmdParser(false);
    client = new restClient(opts);
    new common.main(opts,client);
}