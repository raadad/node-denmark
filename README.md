# Denmark
Node.js webserver for benchmarking and testing downstream infrstructure that deals with node.js services
### Why?
This allows you to test how your downstream infrastructure is able to handle the load of your expected application in areas such as payload and latency.

### Install
    npm install denmark -g

### Usage
    bash> denmark

This will start a clustered webserver listening on port 3000 by default

### Url Configuration
    http://{host}:{port}/?latmin=100&latmax=1000&paymin=1024&paymax=2048
This url will generate a response from a server with a random latency between 100ms and 1000ms that has a random payload size between 1024kb and 2048kb

    http://{host}:{port}/?latmin=100&paymin=1024
This url will generate a response from a server with 100ms latency and 1024kb payload size

### Server Configuration
Denmark can be configured via the following environment variables:

* NODE_PORT=3000 - will listen for requests on port 3000
* NODE_CPU=10 - will run 10 processes






