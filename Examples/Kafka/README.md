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

 
