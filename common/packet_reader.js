
types = require('./appliances');

function packetReader(cb) {
    this.cb=cb;
    this.packet= new types.LogPacket();
    this.self=this;
}
packetReader.prototype={
    pushLogData:function pr_push(logPacket){
        this.packet.logData.push(logPacket);
        if(this.packet.logData.length==this.packet.PACKET_SIZE) {
            var firePacket = this.packet;
            this.packet = new types.LogPacket();
            this.fireEvent(firePacket);
        }
    },
    fireEvent:function pr_fire(packet){
        var cb = this.cb;
        setTimeout(function () {
            cb.push(packet);
        })
    }
}

module.exports={PacketReader:packetReader};