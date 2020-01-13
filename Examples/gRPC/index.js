var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
const grpc_promise = require('grpc-promise');;


var PROTO_PATH = __dirname + '/opc.grpc.connect.proto';

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,

    });

var grpc_connect = grpc.loadPackageDefinition(packageDefinition).OpcGrpcConnect;

var client = new grpc_connect.Http('localhost:5051', grpc.credentials.createInsecure());
grpc_promise.promisifyAll(client);

 // Write Request
client.WriteOpcNode()
	.sendMessage({name : "MyVariable", value : "1" })
    	.then(response => {
      		console.log('\n\nWriteResponse:\n', response);
      		console.log('\n');
    	})
    	.catch(err => {
      		console.log('Error:\n', err);
    	});


// Read Request
client.ReadOpcNodes()
    .sendMessage({ names: ["MyVariable"] })
    .then(response => {
      console.log('\n\nReadResponse:\n', response);
    })
    .catch(err => {
      console.log('Error:\n', err);
    });
