import { Component,Output,EventEmitter,ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-chat-auth',
  templateUrl: './chat-auth.component.html',
  styleUrls: ['./chat-auth.component.css']
})
export class ChatAuthComponent  {
nickname:string='';
@ViewChild('nicknameInput') nicknameInput:NgModel;
@Output() submitted:EventEmitter<any> = new EventEmitter<any>();

  constructor(public userService:UserService){
   console.log(this.nicknameInput);
    }



  authenticate(){
    if(!this.nicknameInput.valid){
      return;
    }else{
      this.userService.authorizeUser({nickname:this.nickname});
      this.submitted.next(true);
    }
  }
}
