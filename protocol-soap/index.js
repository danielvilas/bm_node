common = require('../common');
soap = require("soap");


function soapClient(options){
    var self = this;
    soap.createClient("http://server.local:9090/ws/appliances.wsdl", function(err, client) {
        self.client=client;
        //console.log(self.client.describe());
    });
    self.sentMessages=0;
    self.pendingMessages=0;
}

soapClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("soapClient_init");

}

soapClient.prototype.send=function(data){
    //console.log("mqttClient_send:",data);
    var self = this;
    if(!this.client){
        setTimeout(function () {
            self.send(data);
        })
        return;
    }
    var args={packet:{
        date:data.date.toISOString(),
        tvSeconds:data.tv,
        bluraySeconds:data.bluray,
        appleTvSeconds:data.appleTv,
        ipTvSeconds:data.ipTv
    }};
    self.sentMessages++;
    self.pendingMessages++;
    this.client.AddPacket(args, function(err, result) {
        self.pendingMessages--;
        if(err){
            console.log(err)
        }
    });

}

soapClient.prototype.finish=function(){
    var self=this;
    if(self.pendingMessages>0){
        console.log("Pending Messages "+self.pendingMessages);
        setTimeout(function () { self.finish();});
    }else{
        console.log("Messages: "+ self.sentMessages);
        process.exit(0);
    }
}


module.exports=soapClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Soap Node')
    var opts = new common.cmdParser(false);
    client = new soapClient(opts);
    new common.main(opts,client);
}