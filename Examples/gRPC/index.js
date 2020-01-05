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

var client = new grpc_connect.Http('localhost:5055', grpc.credentials.createInsecure());
grpc_promise.promisifyAll(client);

 // Write Request
client.WriteOpcNode()
	.sendMessage({name : "MyVariable", value : "15" })
    	.then(response => {
      		console.log('WriteResponse:\n', response);
    	})
    	.catch(err => {
      		console.log('Error:\n', err);
    	});


// Read Request
client.ReadOpcNodes()
    .sendMessage({ names: ["MyVariable"] })
    .then(response => {
      console.log('ReadResponse:\n', response);
    })
    .catch(err => {
      console.log('Error:\n', err);
    });
