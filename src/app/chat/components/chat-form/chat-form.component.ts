import { Component, OnInit,Output,EventEmitter,ViewChild,ElementRef} from '@angular/core';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent implements OnInit {
message='';
@Output() sendMessage:EventEmitter<string> = new EventEmitter<string>();
@Output() toggleTypingNotification:EventEmitter<boolean> = new EventEmitter<boolean>();
@ViewChild('textarea') textarea:ElementRef;
  constructor() { }

  ngOnInit() {
  }


  send(){
  	if(this.message.length > 0){
  		this.sendMessage.next(this.message);
  		this.message = '';
      this.textarea.nativeElement.focus();
  	}
  }

  showTypingNotification(){
  	this.toggleTypingNotification.next(true);
  }

  hideTypingNotification(){
  	this.toggleTypingNotification.next(false);
  }
}
