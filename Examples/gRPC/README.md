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
it also assume that the OPC-server is the [Python-OPCUA](https://github.com/FreeOpcUa/python-opcua/blob/master/examples/server-minimal.py). Then run the example with:

```bash
cd Examples/gRPC
node index.js
```
This will read and write a value to ``MyVariable`` of the python test server example. 
To see the effect we suggest to modify the ``try`` block of the opc-test server example as follows:

```python
try:
    count = 1
    myvar.set_value(count)
    while True:
        time.sleep(1)
        #count += 0.1
        #myvar.set_value(count)
finally:
    #close connection, remove subcsriptions, etc
    server.stop()
```

Also keep in mind that the OPC-server will push variables values (if they change) to the OPC-Proxy
with rate of 1 sec, you can query the OPC-Proxy much faster than that, the write request will be forwared
to the server immediately, but read request will read the latest value from the memory cache of the
OPC-Proxy.
