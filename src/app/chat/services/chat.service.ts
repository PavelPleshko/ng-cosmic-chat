import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {API} from '../../app-settings';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChatService {
io:any;
baseUri:string = API.baseUri;
  constructor() { 
  	this.io = io.connect(this.baseUri);
  }

}
