# NodeJs Client for OPC-Proxy's Kafka-Connector library

Using Node we show how to connect to a published data stream of nodes change on kafka, and how to interface to the kafka-RPC for writing nodes values.

# Documentation
You can find full documentation and configuration options at [opc-proxy.readthedocs.io](https://opc-proxy.readthedocs.io/en/latest/)


# Install

```bash
git clone git@github.com:opc-proxy/OPC-Node-Client-Examples.git
cd OPC-Node-Client-Examples
npm install
```

# Run the example

### Pre-requisites

- Run Kafka, with at least one brocker (here we assume listening on default localhost:9092)
- Run [SchemaRegistry](https://www.confluent.io/confluent-schema-registry) server (here we assume listening on default localhost:8081)
- Run your opc test-server (here we assume the OPC-server is the [Python-OPCUA](https://github.com/FreeOpcUa/python-opcua))
- Run the OPC-Proxy, for example the [Standalone](https://github.com/opc-proxy/opcProxy-Standalone) executable with enabled ``kafkaConnector`` in the configuration file.

### Run 

```
cd Examples/Kafka
# Run the OPC-server
python python_test_server.py
# Now run the OPC-Proxy with KafkaConnector then 
# Run the example
node kafkaAvro.js
```

This will run an OPC-server with  ``MyVariable`` increasing by 0.1 every 2 second. 
A kafka consumer is registered on topics ``OPC`` (default data stream) and ``OPC-response`` (default for RPC-response).
Every 10 sec, an RPC-write request is made resetting the value of ``MyVariable`` to 1.

Also keep in mind that the OPC-server will push variables values (if they change) to the OPC-Proxy
with rate of 1 sec, you can query the OPC-Proxy much faster than that, the write request will be forwared
to the server immediately, but read request will read the latest value from the memory cache of the
OPC-Proxy.
 
