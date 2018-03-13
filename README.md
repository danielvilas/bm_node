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

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone https://github.com/danielvilas/bm_node
cd bm_node 
npm install

node . -d 0Initial -p KAFKA

´´´