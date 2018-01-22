'use strict'
const socketIO = require('socket.io');
const InstantMessagingModule = require('./instant-messaging.module');
module.exports = build;

class ChatService {
	 constructor(app, server) {
  
    this.connectedClients = {};
    this.connectedSockets={};
    this.io = socketIO(server);
    this.bindHandlers();
  }


  

    bindHandlers() {
      var that=this;
    this.io.on('connection', function(socket){
      socket.join('public');
      socket.leave(socket.id);
      that.connectedClients[socket.id]=socket.id;
      that.connectedSockets[socket.id] = socket;
      InstantMessagingModule.init(socket, that.connectedClients,that.connectedSockets,that.io);
    });
  }
}


function build(app, server) {
  return new ChatService(app, server);
}

