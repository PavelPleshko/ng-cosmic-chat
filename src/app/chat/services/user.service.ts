import { Injectable } from '@angular/core';
import {ChatService} from './chat.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

const initUsers = [];

@Injectable()
export class UserService {
io;
isTyping:boolean = false;
currentUser:BehaviorSubject<any> = new BehaviorSubject<any>(null);
newUsers:Subject<any> = new Subject<any>();
users$:Observable<any>;
updates:Subject<any> = new Subject<any>();
add:Subject<any> = new Subject<any>();
disconnect:Subject<any> = new Subject<any>();


usersTyping$:Observable<any[]>;
usersTyping:Subject<any> = new Subject<any>();
handleUser:Subject<any> = new Subject<any>();
newUsersTyping:Subject<any> = new Subject<any>();
deleteUsers:Subject<any> = new Subject<any>();


  constructor(public chatService:ChatService) { 
  	var self = this;
  	this.users$ = this.updates.scan((users,action)=>{
  		return action(users).filter(user=>{
      let userToSearch = this.currentUser.getValue();
      if(userToSearch){
        return user.id != userToSearch.id;
      }else{
        return user;
      }   
    });
  	},initUsers);

  	this.add.map(function(newUsers){
  		return (users)=>{
  		let userArr=[];
  		newUsers.forEach((user)=>{
  			let found = users.find((item)=>item.id == user.id);
  			if(!found){
  				user['online'] = true;
  				userArr.push(user);
  			}
  		})
  			return users.concat(userArr);
  		}
  	}).subscribe(this.updates);

  	this.disconnect.map(function(id){
  		return users=>{
  			let user = users.findIndex(user=>user.id == id);
  			if(user>=0){
  				let offlineUser = users[user];
  				offlineUser.online = false;
  				users.splice(user,1,offlineUser);
  			}
  			return users;
  		}
  	}).subscribe(this.updates);

  	this.newUsers.subscribe(this.add);

  	this.io = this.chatService.io;
  	this.io.on('connectedUser',data=> {
      if(this.currentUser.getValue() && (data.user.nickname == this.currentUser.getValue() || data.user.nickname == this.currentUser.getValue().nickname)){
        this.currentUser.next(data.user);
      };

  		self.addUsersToList(data.connectedUsers);
  	});

      this.usersTyping$ = this.usersTyping.scan((users,transformingOp)=>{
      return transformingOp(users).filter((user)=>user != this.currentUser.getValue().nickname);
    },[]);
    this.handleUser.map(function(user){
      return (users)=>{
          let found;
         
        if(users.length>0){
           found = users.findIndex((searchItem)=>user == searchItem);
           if(found>=0){
           users.splice(found,1);
          return users;
        }else{
          return users.concat(user);
        }  
        }else{
          return users.concat(user);
        }
      }
    }).subscribe(this.usersTyping);
    this.newUsersTyping.subscribe(this.handleUser);

    this.io.on('userIsTyping',data=>this.addOrDeleteUserFromList(data));
    this.io.on('userStoppedTyping',data=>this.addOrDeleteUserFromList(data));

  	this.io.on('disconnectedUser',data=>{
  		console.log('disconnecting',data);
  		self.disconnectUser(data.id);
  	})
  }


  authorizeUser(user):void{
  	this.currentUser.next(user);
  	this.io.emit('authorization',user);
  }


  addUsersToList(users){
  	this.newUsers.next(users);
  }

    disconnectUser(id):void{
  		this.disconnect.next(id);
  	}

  	findUser(data,user){
  		return data.connectedUsers.find((item)=> item.nickname == user.nickname);
  	}

  toggleTyping(event,thread){
if(event && !this.isTyping){
  this.isTyping = true;
  this.io.emit('userTyping',{user:this.currentUser.getValue(),thread:thread});
}else if(!event && this.isTyping){
  this.isTyping = false;
  this.io.emit('userStoppedTyping',{user:this.currentUser.getValue(),thread:thread});
}
}

addOrDeleteUserFromList(data){
  this.newUsersTyping.next(data);
}
}
