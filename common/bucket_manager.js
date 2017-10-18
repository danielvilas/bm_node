
types = require('./appliances')

const BUCKET_SIZE_MINUTES=5;
const THRESOLD = 0.75;

function BucketManager(client){
    this.buckets=[];
    this.client=client;
}

function getSeconds(tv){
    if(tv>= THRESOLD)return 1.0;
    return 0.0;
}

BucketManager.prototype={
    push:function bm_push(parsed) {
        var bucket=this.getOrCreateBucket(parsed.date);
        bucket.tvSeconds+=getSeconds(parsed.tv);
        bucket.bluraySeconds+=getSeconds(parsed.bluray);
        bucket.appleTvSeconds+=getSeconds(parsed.appleTv);
        bucket.ipTvSeconds+=getSeconds(parsed.ipTv);

        this.client.send(bucket);

    },
    getOrCreateBucket:function bm_getBucket(date) {
        var milliseconds = date.getTime();
        var bucketNum = milliseconds/ (1000 * 60 * BUCKET_SIZE_MINUTES );
        bucketNum=Math.ceil(bucketNum);
        if(this.buckets[bucketNum]!=undefined){
            return this.buckets[bucketNum];
        }
        var bucketStart = new Date(bucketNum*BUCKET_SIZE_MINUTES*60*1000);
        var bucketEnd = new Date((1+bucketNum)*BUCKET_SIZE_MINUTES*60*1000);
        var bucket = new types.Bucket(bucketStart,bucketEnd);
        this.buckets[bucketNum]=bucket;
        return this.buckets[bucketNum];
    }
}


module.exports={BucketManager:BucketManager};