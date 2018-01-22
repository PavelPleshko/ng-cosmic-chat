import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ThreadService} from '../../services/thread.service';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.css']
})
export class ChatUsersComponent implements OnInit {
users;
searchValue;
  constructor(public userService:UserService,public threadService:ThreadService) { }

  ngOnInit() {
  	this.users = this.userService.users$;
  }

  chatWithUser(user){
  	this.threadService.openThread(user);
  }

  goToPublic(){
  	let thread = {};
  	thread['name']='public';
  	thread['participants']=[];
  	this.threadService.setCurrentThread(thread);
  }

}
