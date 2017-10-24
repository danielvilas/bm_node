common = require('../common');
//MQTT Module
//var mqtt = require('mqtt')
//var zookeeper = require('node-zookeeper-client');
var kafka = require('kafka-node');
var Producer = kafka.Producer;


//Protocol Api
function kafkaClient(options){
    // console.log("Options: ",options);
    self = this;
    /*this.endpoints=[];
    this.endpointsSize=1;
    this.zooClient = zookeeper.createClient('server.local:2181');//todo change
    this.zooClient.once('connected', function () {
        console.log('Connected to ZooKeeper.');
        self.zooClient.getChildren("/brokers/ids",function (error, children, stats){
            console.log(children);
            self.endpointsSize=children.length;
            for(i=0;i<children.length;i++){
                self.zooClient.getData("/brokers/ids/"+children[i], function (error, data, stat){
                    data = data.toString('utf8');
                    data =JSON.parse(data);
                    self.endpoints.push(data.endpoints);
                });
            }
        });
    });
    this.zooClient.connect();*/

    self.client = new kafka.Client('server.local:2181',"NodeBm");
    self.producer = new Producer(self.client);
    self.producer.on('ready', function () {
        console.log("Producer ready")
        self.producerReady=true;
    });
}

kafkaClient.prototype.init=function(cfg){
    this.cfg=cfg;
    console.log("kafkaClient_init");

}

kafkaClient.prototype.send=function(data){
    if(!this.producerReady){console.log("KafkaClient_send:",data);return}

    payloads = [{ topic: 'AppliancesBucket', messages: JSON.stringify(data)}];
    this.producer.send(payloads, function (err, data) {
        //console.log(data);
    });
}

module.exports=kafkaClient;

//If we are the main module, we check the command line
if(require.main === module){
    console.log('Benchmark Kafka Node')
    var opts = new common.cmdParser(false);
    client = new kafkaClient(opts);
    new common.main(opts,client);
}