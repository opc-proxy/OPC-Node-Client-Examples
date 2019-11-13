const avro = require('avsc');
const fs = require('fs');




let RPC_req = JSON.parse(fs.readFileSync("AvroSchemas/Request.json"));
let RPC_res = JSON.parse(fs.readFileSync("AvroSchemas/Response.json"));

let req = {
    method :"write",
    params : ["ciao", "768" ],
    id : 890
}

let res = {
    result : "89",
    error : { code: 89, message:"WOooohhPsss"},
    id: 76
}

const type_req = avro.Type.forSchema( RPC_req );
const type_res = avro.Type.forSchema( RPC_res );

const buf_req = type_req.toBuffer(req);
const buf_res = type_res.toBuffer(res);

console.log(buf_req);
console.log(buf_res);