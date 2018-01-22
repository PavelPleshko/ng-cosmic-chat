'use strict'
module.exports.init = initInstantMessagingModule;

class InstantMessagingModule {
	  constructor(socket, clients,connectedSockets,io) {
    this.socket = socket;
    this.io = io;
    this.clients = clients;
    this.connectedSockets = connectedSockets;
    this.threads = {};
    this.bindHandlers();
  }

    bindHandlers(){
    this.socket.on('sendMessage', data => {
      data.sender = this.socket.id;
      if (!data.thread) {
        let err = new Error('You must be participating in a conversation.')
        err.type = 'no_active_thread';
        return this.handleError(err);
      }
        this.deliverIM(data);
    });

    this.socket.on('authorization',data=>{
      var user = {
        nickname:data.nickname,
        id:this.socket.id
      };
      this.clients[this.socket.id]=user;
      var connectedUsers=[];
      for(var key in this.clients){
        if(this.clients[key] && typeof this.clients[key] == 'object'){
          connectedUsers.push(this.clients[key]);
        }
      }
      this.io.emit('connectedUser',{user,connectedUsers});
    })

    this.socket.on('openedThread',data=>{
      this.io.to(data.id).emit('messagesAreRead',{thread:data,user:this.socket.id});
    })

    this.socket.on('userTyping',data=>{
      this.io.to(data.thread.id).emit('userIsTyping',data.user.nickname);
    })

    this.socket.on('userStoppedTyping',data=>{
      this.io.to(data.thread.id).emit('userStoppedTyping',data.user.nickname);
    });

    this.socket.on('joinRoom',data=>{
      for(var i=0;i<data.participants.length;i++){
        if(data.participants[i].id == this.socket.id){
         this.connectedSockets[data.participants[i].id].join(data.id);
         this.connectedSockets[data.participants[i].id].emit('joinRoom',data);
        }     
      }    
    });

    this.socket.on('disconnect',data=>{
      this.clients[this.socket.id]=null;
      this.io.emit('disconnectedUser',{id:this.socket.id});
    })
  }
  
    deliverIM(message) {   
    if(message.thread.name == 'public'){
      this.io.to('public').emit('receive:im',message);
      return;
    }
    for(var i = 0;i<message.thread.participants.length;i++){
      if(this.socket.id != message.thread.participants[i].id){
        this.connectedSockets[message.thread.participants[i].id].join(message.thread.id);
        this.connectedSockets[message.thread.participants[i].id].emit('joinRoom',message.thread);
      }
    }
    this.io.to(message.thread.id).emit('receive:im',message);
}
    handleError(err) {
    console.error(err);
    return this.socket.emit('send:im:failure', err);
    }
}

function initInstantMessagingModule(socket, clients,sockets,io) {
  return new InstantMessagingModule(socket, clients,sockets,io);
}