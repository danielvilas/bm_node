function LogPacket () {
    this.logData=[];
}

LogPacket.prototype={
    PACKET_SIZE: 1024,
}

function LogData(line){
    var tokens = line.split(",")
    var stMicros=tokens[0];
    var stA0 =tokens[1];
    var stA1=tokens[2];
    var stDate=tokens[3];
    var stDelta=tokens[4];

    //Note on java we do pre clean, on this ds must be cleared
    this.micros = parseInt(stMicros,16);

    if(stMicros.startsWith('-') && this.micros!=-1){
        console.error("Dataset not clear (-), parse in java spliter first");
}

    this.A0=parseInt(stA0);
    this.A1=parseInt(stA1);
    this.date=new Date();
    this.date.setTime(parseInt(stDate));
    this.deltaMicros=parseInt(stDelta);
}

LogData.prototype={

}

function ParsedPacket(date, results){
    this.date=date;
    this.tv=results[0];
    this.bluray=results[1];
    this.appleTv=results[2];
    this.ipTv=results[3];
}

function Packet(date){
    this.date=date;
    this.tvSeconds=0.0;
    this.bluraySeconds=0.0;
    this.appleTvSeconds=0.0;
    this.ipTvSeconds=0.0;
}

module.exports={LogData:LogData, LogPacket:LogPacket, ParsedPacket:ParsedPacket, Packet:Packet};