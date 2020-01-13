var Kafka = require('node-rdkafka');
const registry = require('avro-schema-registry')('http://localhost:8081');
const fs = require('fs');


////----------PRODUCER-------------////

// Producer for the write-RPC-Request
var producer = new Kafka.HighLevelProducer({
  'metadata.broker.list': 'localhost:9092',
});


// Load the Avro schema
let RPC_schema = JSON.parse(fs.readFileSync("AvroSchemas/Request.json"));

let WriteRequest= {
    method :"write",
    // here the value must be stringyfied for maximal flexibility, this approach has the advantages:
    // - we can use the same schema for all request (some producer have problems in sendig multiple schemas on same topic). One could go around it with union schemas but has a tedius sintax
    // - On the OPC-proxy side the value will be converted to the proper OPC type
    params : ["MyVariable", "1"],   
}

// Set the Avro serializer
producer.setValueSerializer(async function(msg) {
    try{
        let encoded_msg = await registry.encodeMessage('OPC-request', RPC_schema, msg);
        return encoded_msg;  
    }
    catch(e){
        console.log(e);
    }
});

// Reset the value of MyVariable to 1 every 10 sec
producer.on("ready", ()=>{
  setInterval(()=>{
    console.log("\n\n\n");
    console.log("Sending Write RPC Request, set:  MyVariable  to  1");
    producer.produce('OPC-request', null,
           WriteRequest,
           "myKeyToWriteReq", Date.now(), function(err, offset) {
           console.log("Write request dispatched, the Kafka offset is :" + offset);
      });
  }, 10000);
    
});

producer.connect();



/// ----- CONSUMER ------ ///

var consumer = new Kafka.KafkaConsumer({
    'group.id': 'NodeConsumer',
    'metadata.broker.list': 'localhost:9092',
    'offset_commit_cb': function(err, topicPartitions) {
  
      if (err) {
        // There was an error committing
        console.error(err);
      } else {
        // Commit went through. Let's log the topic partitions
        console.log("Consumer:: committed read topics");
      }
  
    }
  });


consumer
  .on('ready', function() {
    consumer.subscribe(['OPC-response','OPC']);
    consumer.consume();
})
  .on('data', async function(data) {
    // Output the actual message contents
    try{
       let key =   data.key.toString()  ;
       // deserializing the message
       let message = await registry.decode( data.value );
       console.log("Received message on Topic: ", data.topic, " with timestamp ", new Date(data.timestamp));
       console.log("\t\t", message);
       if(data.topic === "OPC-response") console.log("\n\n\n");
    }
    catch(e){
        console.log("error: ", e);
    }
});

consumer.connect();
