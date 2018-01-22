import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/combineLatest';
import {ChatService} from './chat.service';
import {UserService} from './user.service';
import {MessageService} from './message.service';
import {createId} from '../utils/utils';
import * as _ from 'lodash';

const initThreads=[];
var threadToCheck={};
@Injectable()
export class ThreadService {
threads$:Observable<any>;
updates:Subject<any> = new Subject<any>();
incomingThreads:Subject<any> = new Subject<any>();
handleThread:Subject<any> = new Subject<any>();
orderedThreads$:Observable<any[]>;
openedAndReadThread:Subject<any>=new BehaviorSubject<any>(null);
currentThread:BehaviorSubject<any> = new BehaviorSubject<any>({name:'public',participants:[]});
currentThreadMessages:Observable<any[]>;
io;
currentUser;



  constructor(public chatService:ChatService,public userService:UserService,
  	public messageService:MessageService) {
  this.io = this.chatService.io;
  this.userService.currentUser.subscribe((user)=>{
  	this.currentUser = user;
  })

    this.threads$ = this.updates
  	.scan((threads:any[],operation:any)=>{
  		return operation(threads);
  	},initThreads).share().combineLatest(this.messageService.messages,this.openedAndReadThread,(threads,messages,openedThread)=>{
  		if(openedThread && openedThread.thread){
  			messages.map(msg=>{	
  				if(openedThread.thread && openedThread.thread.id == msg.thread.id
  					){
  					if(openedThread.user != msg.user.id){
  						msg.isReadByUser = true;		
  					}
  					if(openedThread.user == this.currentUser.id){
  						msg.isRead = true;
  					}
  				}
  				return msg;
  			});
  			this.openedAndReadThread.next(null);
  		}else{
  			 threads
  		.map(thread=>{
  			let messagesForThread = messages
  			.filter((msg)=>msg.thread.id == thread.id).map((msg)=>{
  					if(!thread.lastMessage || thread.lastMessage.sentAt < msg.sentAt){
  						thread.lastMessage = msg;
  					}
  			})
  		return thread;
  		})
  		}
  		return threads;
  	});

  	 	this.orderedThreads$ = this.threads$.map((threads)=>{
  		return _.sortBy(threads,(t:any)=>{
  			if(t.lastMessage){
  				return t.lastMessage.sentAt
  			}
  			}).reverse();
  		});

  	this.handleThread.map(function(thread){
  		return (threads)=>{
  			if(thread.name == 'public') return threads;
  			let found = threads.findIndex(currentThread=>currentThread.id == thread.id);
  			if(found>=0){
  				threads.splice(found,1,thread);
  				return threads;
  			}else{
  				return threads.concat(thread);
  			}
  		}
  	}).subscribe(this.updates);

  	this.incomingThreads.subscribe(this.handleThread);


  this.currentThreadMessages = this.currentThread.combineLatest(this.messageService.messages,(currThread,messages)=>{
  	if(currThread && messages.length>0){
  		return _.chain(messages)
  		.filter(msg=>msg.thread.id == currThread.id)
  		.value();
  	}else{
  		return [];
  	}
  })

  this.io.on('joinRoom',data=>this.openThreadForIncoming(data));
  this.io.on('messagesAreRead',data=>this.markMessagesAsRead(data));
   }



   setCurrentThread(newThread:any,open?:boolean):void{
   	this.currentThread.next(newThread);
   	if(open){
   		this.io.emit('openedThread',newThread);
   	}
   }



   openThread(user){
   	let thread = {};
   	
   	thread['updated']=Date.now();
   	thread['participants']=[user,this.currentUser];
   	thread['name']=user.nickname;
   	var partsIds = [];
   	thread['participants'].forEach((participant,idx)=>{
   		let append;
   		idx == (thread['participants'].length-1) ? append = participant.nickname : append = participant.nickname+',';
   		partsIds.push(participant.nickname);
   	});
   	thread['id'] = partsIds.sort().reduce((acc,cur)=>{
   		return acc+cur;
   	},'');
   	this.setCurrentThread(thread);
   	this.io.emit('joinRoom',thread);
   }

   openThreadForIncoming(thread){
   	this.incomingThreads.next(thread);
   }

   markMessagesAsRead(data){
   this.openedAndReadThread.next(data); 
   }
}
