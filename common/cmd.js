var stdio = require('stdio');
//This file parses the command line an chechs the value

//This version configures Stdio for read the options (see readme.md)
//Full is false for specific modules
function cmd(isFull){
    this.isFull=isFull;
    console.log('Reading options');
    opts={    'dataset': {description: 'DataSet to use',key:'d', args: 1},
    'server': {description: 'Server IP to use', key:'s',default:'server.local'},
    'continuos': {description: 'Continuos mode', key:'c', default:false}};
    if(isFull){
        opts.protocol={description: 'Client to use MQTT|WS|Kafka',key:'p', default: 'MQTT', args: 1};
    }

    this.options=stdio.getopt(opts);
}
//CAll this function to check configuration
cmd.prototype.checkOptions=function(){
    this.print();
    if(this.options.dataset==undefined || (this.isFull && this.options.protocol==undefined)){
        this.options.printHelp();
        return false;
    }
    return true;
}

//Print method to help debug
cmd.prototype.print=function(){
    console.log(this.options);
}

module.exports=cmd;