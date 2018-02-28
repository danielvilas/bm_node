# bm_node
Node Implementation for Benchmark RNA on IoT

Common module is the core system with functions for all protocols.

* common/index.js has the core and the exports
* common/cmd.js parses the command line and creates the configuration
* index.js launches the application with all Options

The command line options are
*   -d, --dataset <ARG1>  	DataSet to use
*   -s, --server          	Server IP to use ("server.local" by default)
*   -c, --continuos       	Continuos mode (production)
*   -p, --protocol <ARG1> 	Client to use MQTT|WS|Kafka ("MQTT" by default)

Protocol Modules must conform to this API:
```javascript
function Protocol(options){
     // console.log("Options: ",options);
 }
 
 Protocol.prototype.init=function(cfg){
    //
     this.cfg=cfg;
     console.log("Protocol_init");
 }
 
 Protocol.prototype.send=function(data){
     console.log("Protocol_send:",data);
 }
 ```

Instalation
```sh

sudo apt-get install npm
git clone https://github.com/danielvilas/bm_node
cd bm_node 
npm install
cd common
npm install
cd ../process-basic/
npm install
cd ../protocol-kafka/
npm install
cd ../protocol-mqtt/
npm install
cd ../protocol-rest/
npm install
cd ../protocol-soap/
npm install
cd ..
node . -d 0Initial -p KAFKA

´´´