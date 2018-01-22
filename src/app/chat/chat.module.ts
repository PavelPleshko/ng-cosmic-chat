import { NgModule,ModuleWithProviders } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { ChatAuthComponent } from './components/chat-auth/chat-auth.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatThreadsComponent } from './components/chat-threads/chat-threads.component';
import { ChatUsersComponent } from './components/chat-users/chat-users.component';
import {ChatService} from './services/chat.service';
import {UserService} from './services/user.service';
import {MessageService} from './services/message.service';
import {ThreadService} from './services/thread.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverflowPipe} from './pipes/overflow.pipe';
import {ItemFilterPipe} from './pipes/item-filter.pipe';
import {ChatNavComponent } from './components/chat-nav/chat-nav.component';

const COMPONENTS = [ChatComponent, ChatFormComponent, ChatAuthComponent,
 ChatWindowComponent, ChatThreadsComponent,ChatUsersComponent,ChatNavComponent];

const PIPES =[OverflowPipe,ItemFilterPipe];

const SERVICES = [ChatService,UserService,MessageService,ThreadService];

const MODULES = [FormsModule,CommonModule,BrowserAnimationsModule];
@NgModule({
  imports: [...MODULES],
  exports:[...COMPONENTS],
  declarations: [...COMPONENTS,...PIPES]
})

export class ChatModule { 
static forRoot():ModuleWithProviders{
	return <ModuleWithProviders>{
		ngModule:ChatModule,
		providers:[...SERVICES]
	}
}
}
