
types = require('./appliances');

function packetReader(cb) {
    this.cb=cb;
    this.packet= new types.LogPacket();
    this.self=this;
    this.samples=0;
    this.workPackets=0;
}
packetReader.prototype={
    pushLogData:function pr_push(logPacket){
        this.packet.logData[this.packet.i]=logPacket;
        this.samples++;
        this.packet.i++;

        if(this.packet.i==this.packet.PACKET_SIZE) {
            var firePacket = this.packet;
            this.packet = new types.LogPacket();
            this.fireEvent(firePacket);
        }
    },
    fireEvent:function pr_fire(packet){
        var cb = this.cb;
        var me = this.self;
        this.workPackets++;
        setTimeout(function () {
            cb.push(packet);
            me.workPackets--;
        })
    },
    finish:function pr_finsh() {
        var me = this.self;
        if(me.workPackets>0){
            console.log("Pending packets:" +me.workPackets);
            setTimeout(function(){me.finish()});
        }else{
            console.log("Samples: "+me.samples);
            setTimeout(function () {
                me.cb.finish();
            })
        }
    }
}

module.exports={PacketReader:packetReader};