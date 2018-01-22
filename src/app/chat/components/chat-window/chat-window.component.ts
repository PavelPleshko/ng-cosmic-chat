import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import {MessageService} from '../../services/message.service';
import {ThreadService} from '../../services/thread.service';
import {UserService} from '../../services/user.service';
import PerfectScrollbar from 'perfect-scrollbar';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/repeat';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
currentThread:any={};
currentUser:any;
messages:any;
usersTyping:any;
readMessages$:Subject<any> = new Subject<any>();
scrollPanel:any;
ps;
@ViewChild('incoming') incoming:ElementRef;
@ViewChild('outgoing') outgoing:ElementRef;

sounds = {
  incoming:'/assets/sounds/incoming.mp3',
  outgoing:'/assets/sounds/outgoing.mp3'
};

  constructor(public messageService:MessageService,
    public threadService:ThreadService,public userService:UserService,
    public el:ElementRef) { }

  ngOnInit(){
      this.scrollPanel = this.el.nativeElement.querySelector('.chat-window-body');
      this.ps = new PerfectScrollbar(this.scrollPanel);

  	this.threadService.currentThread.subscribe((thread)=>{
  		if(thread){
  			this.currentThread = thread;
  		}else{
  			this.currentThread['name'] ='public';
  		}
  		
  	})

    this.userService.currentUser.subscribe((user)=>{
      if(user){
         this.currentUser = user;
      }
    });

  	this.messages = this.threadService.currentThreadMessages;
  	this.usersTyping = this.userService.usersTyping$; 

    this.readMessages$.debounceTime(2000).map(()=>this.readMessages()).subscribe();
    this.messages.subscribe((messages:any[])=>{
      if(messages){
          setTimeout(()=>{
      this.scrollToBottom();
          })
      }
  })

    this.messageService.newMessages.subscribe((msg)=>{
      if(msg && msg.user.id != this.currentUser.id){
        this.playSound('incoming');
      }
    })
  }

playSound(type){
if(type="incoming"){
this.incoming.nativeElement.play();
}else{
this.outgoing.nativeElement.play();
}
}

onSendMessage(text:string):void{
if(!text.length) return;
var message={thread:{}};
message['thread'] = this.currentThread;
message['sentAt']=Date.now();
message['text'] = text;
if(this.currentThread.name == 'public'){ //defaults
  message['isRead'] = true;
  message['isReadByUser']=true;
  }else{
    message['isRead'] = false;
    message['isReadByUser']=false;
  }
this.playSound('outgoing');
this.messageService.sendMessage(message);
}


onToggleTyping(event:boolean):void{
  this.userService.toggleTyping(event,this.currentThread);
  this.readMessages$.next(true);
}

readMessages(e?):void{
  if(e) e.stopPropagation();
  this.threadService.setCurrentThread(this.currentThread,true);
}

readMessage(message){
  if(!message.isReadByUser){
    this.readMessages$.next(true);
  }
}

scrollToBottom():void{
  const scrollPanel = this.el.nativeElement.querySelector('.chat-window-body');
  scrollPanel.scrollTop = scrollPanel.scrollHeight;
  this.ps.update();
}
}
