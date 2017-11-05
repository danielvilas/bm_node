cmd = require ('./cmd');
var NanoTimer = require('nanotimer');
DataReader = require('./data_reader');
PacketReader = require('./packet_reader');
BasicProcess = require('../process-basic');
BucketManager = require('./bucket_manager');
fann = require('fann2');


//Main Function
function bmnode(cfg, client){
    var self = this;
    this.cfg = cfg;
    this.client = client;
    this.timer = new NanoTimer();
   // console.log('main:',cfg);
    if(!cfg.checkOptions()){
        return;
    }
    client.init(cfg);

    //The real code begins Here

    var last_event = Date.now();
    if(cfg.options.continuos) {
        this.timer.setInterval(runContinous, [this], '1m');
    }else{
        /*
        The chain is DataReader -> PacketReader -> Process -> RNA -> Buckets -> Protocol
         */


        var net = new fann.net();
        net.fromFile('./data/net_16000.net');
        var bm = new BucketManager.BucketManager(client);
        var bp= new BasicProcess.BasicProcess(net, bm);
        var pr =new PacketReader.PacketReader(bp);


        //Start the chain
        DataReader.FileReader(cfg.options.dataset, pr);
    }
}


//basic impelmentation for running continuos
var sample=0;
function runContinous(self){
    read=arduinoAdc(sample++);
    var data = {time:Date.now(),value:read};
    self.client.send(JSON.stringify(data));
}
//50hz sin signal
function arduinoAdc( sample){
    var time = sample/1000.0;
    var rad = 2*Math.PI*50*time;
    var res = 2.5 + Math.sin(rad);
    return Math.floor(1023/res);
}

module.exports={cmdParser:cmd, main:bmnode};
