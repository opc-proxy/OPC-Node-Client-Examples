var Kafka = require('node-rdkafka');
const registry = require('avro-schema-registry')('http://localhost:8081');
const fs = require('fs');

var producer = new Kafka.HighLevelProducer({
  'metadata.broker.list': 'localhost:9092',
});



let RPC_schema = JSON.parse(fs.readFileSync("AvroSchemas/Request.json"));
let message = {
    method :"write",
    // here the value must be stringyfied for maximal flexibility, this approach has the advantages:
    // - we can use the same schema for all request (some producer have problems in sendig multiple schemas on same topic). One could go around it with union schemas but has a tedius sintax
    // - On the OPC-proxy side the value will be converted to the proper OPC type
    params : ["ciao", "1"],   
    id : 42 
}
  
  producer.setValueSerializer(async function(v) {
    try{
        console.log("sending message ", v);
        let msg = await registry.encodeMessage('OPC-request', RPC_schema, v);
        //let msg = await schemaRegistry.encodeBySubject(v, 'subjectName-9')
        console.log("sending message ", msg);
        return msg;  
    }
    catch(e){
        console.log(e);
    }
});

producer.connect();
producer.on("ready", ()=>{
    producer.produce('OPC-request', null, 
        message,
       "hey", Date.now(), function(err, offset) {
        // The offset if our acknowledgement level allows us to receive delivery offsets
         //producer.disconnect();
         console.log("the offset is :" + offset);
         console.log(err);
        producer.disconnect();

    });
    
});




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
        console.log(topicPartitions);
      }
  
    }
  });

consumer.connect();

consumer
  .on('ready', function() {
    consumer.subscribe(['OPC-response','OPC']);
    consumer.consume();
})
  .on('data', async function(data) {
    // Output the actual message contents
    try{
       let key =   data.key.toString()  ;
       let message = await registry.decode( data.value );
       console.log("topic: ",data.topic ,"  key :", key, "  value: ", message ,  "  timestamp: ",  new Date(data.timestamp));
    }
    catch(e){
        console.log("error: ", e);
    }
    finally{
     consumer.disconnect();
     consumer.unsubscribe();
     consumer.unassign();    

    }
});

