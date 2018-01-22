import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import {ChatService} from './chat.service';
import {UserService} from './user.service';

const initialMessages: any[] = [];
interface IMessagesOperation extends Function{
	(messages:any[]):any[];
}

@Injectable()
export class MessageService {
newMessages:Subject<any> = new Subject<any>();
messages:Observable<any[]>;
updates:Subject<any> = new Subject<any>();
create:Subject<any> = new Subject<any>();
io:any;
currentUser;

  constructor(public chatService:ChatService,
  	public userService:UserService) {
  	this.io = this.chatService.io;

  	this.userService.currentUser.subscribe((user)=>{
  		this.currentUser = user;
  	});

  this.messages = this.updates
  	.scan((messages:any[],operation:IMessagesOperation)=>{
  		return operation(messages);
  	},initialMessages).startWith([])
  	.publishReplay(1)
  	.refCount();

  	this.create.map(function(message:any):IMessagesOperation{
  		return (messages:any[])=>{
  			return messages.concat(message)
  		}
  	}).subscribe(this.updates);

  	this.newMessages.subscribe(this.create);
  	this.io.on('receive:im',data=>this.addMessage(data));
  }

sendMessage(message:any){
	message['user'] = this.currentUser;
	this.io.emit('sendMessage',message);
}

addMessage(newMessage:any){
	this.newMessages.next(newMessage);
}
}
