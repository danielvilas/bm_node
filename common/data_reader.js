var lineReader = require('line-reader');
fs = require('fs');
types = require('./appliances');

/*
This file reads a Data file (must be Cleared first by the java spliter) and fires a callbac for each point readed
 */

function fileReader(dataset, callback) {

    var files =fs.readdirSync('./data/sets/'+dataset);

    //for(var i = 0;i< files.length;i++){
    proccessFile(dataset, 0,files,callback)
}

module.exports={FileReader:fileReader};

function proccessFile(dataset, i, files, callback){
    if(i>=files.length){
        console.log("I'm done!!");
        setTimeout(function () {
            process.exit();
        });
    }
    var file = files[i];
    console.log(file);
    var lastPacket;
    lineReader.eachLine('./data/sets/'+dataset+'/'+file, function(line, last) {
        if(line.startsWith('#')){
            //console.log('line from '+file+':'+line);
            return;
        }
        var lg = new types.LogData(line);
        if(!lastPacket){
            lastPacket=lg;
        }else{
            if(lastPacket.micros>lg.micros && lg.micros!=-1){
                console.error("Dataset not clear (micros), parse in java spliter first");
            }
            if(lastPacket.date>lg.date && lg.micros!=-1){
                console.error("Dataset not clear (date), parse in java spliter first");
            }
        }
        if(callback){
            callback.pushLogData(lg);
        }
        if(last){
            proccessFile(dataset, i+1,files,callback);
        }
    });
}
