import { Component, OnInit,ElementRef,OnChanges,SimpleChanges} from '@angular/core';
import {ThreadService} from '../../services/thread.service';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})

export class ChatThreadsComponent implements OnInit,OnChanges {
threads;
searchValue;
scrollPanel:any;
ps;
  constructor(public threadService:ThreadService,
  	public el:ElementRef){}

  ngOnInit(){
  	this.threads = this.threadService.orderedThreads$;
  	 this.scrollPanel = this.el.nativeElement.querySelector('.threads-wrapper');
	 this.ps = new PerfectScrollbar(this.scrollPanel);
  }

  ngOnChanges(changes:SimpleChanges){
  		if(this.ps){
  			this.ps.update();
  		}
  }

  setCurrentThread(thread){
  	this.threadService.setCurrentThread(thread,true);
  }
}
