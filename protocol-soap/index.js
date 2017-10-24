common = require('../common');
soap = require("soap");


function soapClient(options){
    self = this;
    soap.createClient("http://server.local:9090/ws/appliances.wsdl", function(err, client) {
        self.client=client;
        //console.log(self.client.describe());
    });
}

soapClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("soapClient_init");

}

soapClient.prototype.send=function(data){
    //console.log("mqttClient_send:",data);
    if(!this.client){
        console.log("Not Defined")
        return;
    }
    args={bucket:{
        start:data.start.toISOString(),
        end:data.end.toISOString(),
        tvSeconds:data.tvSeconds,
        bluraySeconds:data.bluraySeconds,
        appleTvSeconds:data.appleTvSeconds,
        ipTvSeconds:data.ipTvSeconds
    }};

    this.client.AddBucket(args, function(err, result) {
        if(err){
            console.log(err)
        }
    });

}

module.exports=soapClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Soap Node')
    var opts = new common.cmdParser(false);
    client = new soapClient(opts);
    new common.main(opts,client);
}