common = require('../common');
//MQTT Module
//var mqtt = require('mqtt')
//var zookeeper = require('node-zookeeper-client');
var kafka = require('kafka-node');
var Producer = kafka.Producer;


//Protocol Api
function kafkaClient(options){
    // console.log("Options: ",options);
    var self = this;
    self.client = new kafka.Client('server.local:2181',"NodeBm");
    self.producer = new Producer(self.client);
    self.producer.on('ready', function () {
        console.log("Producer ready")
        self.producerReady=true;
    });
    self.sentMessages=0;
    self.pendingMessages=0;
}

kafkaClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("kafkaClient_init");

}

kafkaClient.prototype.send=function(data){
    var self = this;
    if(!this.producerReady){
        setTimeout(function(){self.send(data)},100);
        return;
    }

    self.sentMessages++;
    self.pendingMessages++;

    payloads = [{ topic: 'AppliancesBucket', messages: JSON.stringify(data)}];
    this.producer.send(payloads, function (err, data) {
        //console.log(data);
        self.pendingMessages--;
    });
}

kafkaClient.prototype.finish=function(){
    var self=this;
    if(self.pendingMessages>0){
        console.log("Pending Messages "+self.pendingMessages);
        setTimeout(function () { self.finish();});
    }else{
        this.client.close(function () {
            console.log("Messages: "+ self.sentMessages);
            process.exit(0);
        })


    }
}

module.exports=kafkaClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Kafka Node')
    var opts = new common.cmdParser(false);
    client = new kafkaClient(opts);
    new common.main(opts,client);
}