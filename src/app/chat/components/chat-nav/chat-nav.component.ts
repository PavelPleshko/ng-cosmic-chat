import { Component, OnInit } from '@angular/core';
import {MessageService} from '../../services/message.service';
import {ThreadService} from '../../services/thread.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.css']
})
export class ChatNavComponent implements OnInit {
currentUser;
unreadMessagesCount:number = null;

  constructor(public messageService:MessageService,
  	public userService:UserService,public threadService:ThreadService) { }

  ngOnInit() {
  	this.userService.currentUser.subscribe((user)=>{
  		this.currentUser = user;
  	})
  	this.messageService.messages.combineLatest(this.threadService.openedAndReadThread,(messages,thread)=>{
  		return messages.reduce((sum,msg)=>{
  			if(!msg.isRead && msg.user.id != this.currentUser.id){
  				sum++;
  			}
  			console.log(msg);
  			return sum;
  		},0);
  	}).subscribe((sum)=>{
  		console.log(sum);
  			this.unreadMessagesCount = sum;
  	})
  }

}
