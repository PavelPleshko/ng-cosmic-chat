import { Injectable } from '@angular/core';
import {ThreadService} from './thread.service';



@Injectable()
export class SharedService {

currentThread;
  constructor(public threadService:ThreadService) {
  

  this.threadService.currentThread.subscribe((thread)=>{
    this.currentThread = thread;
  })
 
   }


}
