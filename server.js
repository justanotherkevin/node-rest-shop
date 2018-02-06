const http = require('http'); //come from node.js 
const app = require('./app'); 

const port = process.env.PORT || 3000;

const server = http.createServer(app); // render "app" as your server

server.listen(port);