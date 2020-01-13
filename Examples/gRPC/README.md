# Node gRPC Example

Connect to an OPC-Proxy that runs a HTTP (gRPC) endpoint.

# Documentation
Find full docs at [opc-proxy.readthedocs.io](https://opc-proxy.readthedocs.io/en/latest/)

# Install

```bash
git clone git@github.com:opc-proxy/OPC-Node-Client-Examples.git
cd OPC-Node-Client-Examples
npm install
```

# Run the example

First run the OPC-Proxy configured with a gRPC endpont, this example assumes an OPC-Proxy running on ``port:5051``, 
which is default, it also assume that the OPC-server is the [Python-OPCUA](https://github.com/FreeOpcUa/python-opcua/blob/master/examples/server-minimal.py), or in general that there will be an exposed variable called ``MyVariable``. Then run the example with:

```bash
cd Examples/gRPC
# Run the python opc-server
python python_test_server.py 
# Run the OPC-Proxy with ``grpcConnector : true``, then 
# Run the client
node index.js
```
This will read and write a value to ``MyVariable`` of the python test server example. 
The value of MyVariable is always increasing by 0.1 every half a second. The client will read
its value and reset it to 1.

Also keep in mind that the OPC-server will push variables values (if they change) to the OPC-Proxy
with rate of 1 sec, you can query the OPC-Proxy much faster than that, the write request will be forwared
to the server immediately, but read request will read the latest value from the memory cache of the
OPC-Proxy.
