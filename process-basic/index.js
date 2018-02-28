const FFT = require('dsp.js');
const FFT_SIZE=300;

types = require('../common/appliances');

function BasicProcess(net, cb){
    this.net = net;
    this.cb=cb;
    this.packets=0;
    this.pendingPackets=0;
}


BasicProcess.prototype={
    push:function bp_push(logPacket){
        this.packets++;
        var data0 = this.processSamples(logPacket.logData,0);
        var data3 = this.processSamples(logPacket.logData,300);
        var data6 = this.processSamples(logPacket.logData,600);
        var data9 = this.processSamples(logPacket.logData,1023-300);

        var res0 = this.net.run(data0);
        var res3 = this.net.run(data3);
        var res6 = this.net.run(data6);
        var res9 = this.net.run(data9);

        var out=[];
        for(i=0;i<res0.length;i++){
            out.push((res0[i]+res3[i]+res6[i]+res9[i])/4);
        }
        var pp = new types.ParsedPacket(logPacket.logData[0].date,out);
        this.fireEvent(pp);
    },
    processSamples:function bp_processSamples(samples, offset) {
        var ret=new Float32Array(FFT_SIZE);
        var average =  0.0;
        for(i=0;i<FFT_SIZE;i++){
            var value =samples[i+offset].A0;
            value = parseFloat((value - 512.0)/512.0);
            ret[i]=value;
            average+=Math.abs(value);
        }
        average /= FFT_SIZE;

        fft = new FFT.DFT(FFT_SIZE,1000);
        fft.forward(ret);
        //fft.get

        return  [this.getMagnitude(fft,50),this.getMagnitude(fft,150),this.getMagnitude(fft,250),this.getMagnitude(fft,350),average]
    },
    getMagnitude:function bp_getMagnitude(fft, i) {
        var pos = i*(FFT_SIZE/2)/500;
        pos= Math.floor(pos);
        return fft.spectrum[pos]*fft.bufferSize/2;
    },
    fireEvent:function bp_fireEvent(pp){
        var me=this;
        me.pendingPackets++;
        setTimeout(function () {
            me.cb.send(pp);
            me.pendingPackets--;
        });
    },
    finish:function bp_finish() {
        var me = this;
        if(me.pendingPackets>0){
            console.log("Pending packets to Send:" +me.pendingPackets);
            setTimeout(function(){me.finish()});
        }else{
            console.log("Packets: "+this.packets);
            setTimeout(function () {me.cb.finish();})
        }
    }
}

module.exports={BasicProcess:BasicProcess}