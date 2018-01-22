import { Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import { trigger, state, query,animate,keyframes, transition, style } from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [trigger('fadeOut', [
        transition(':leave', [
            style({ opacity: 1}),

            animate('.3s', style({ opacity: 0 }))
        ])])]
})

export class ChatComponent implements OnInit {
authSubmitted:boolean = false;

  constructor(public chatService:ChatService) { }

  ngOnInit() {
  }


}
