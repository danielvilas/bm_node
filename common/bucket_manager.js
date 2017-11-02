
types = require('./appliances')

//Class for post-process and send

function BucketManager(client){
    this.client=client;
}
BucketManager.prototype={
    push:function bm_push(parsed) {
        /*var bucket=new types.Packet(parsed.date);
        bucket.tvSeconds+=parsed.tv;
        bucket.bluraySeconds+=parsed.bluray;
        bucket.appleTvSeconds+=parsed.appleTv;
        bucket.ipTvSeconds+=parsed.ipTv;*/

        this.client.send(parsed);

    },

}


module.exports={BucketManager:BucketManager};