import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { NewChatRoomComponent } from './new-chat-room/new-chat-room.component'
import { EditChatRoomComponent } from './edit-chat-room/edit-chat-room.component'
import { FormsModule } from '@angular/forms';
import { JoinChatroomComponent } from './join-chatroom/join-chatroom.component';
import { ShareChatroomComponent } from './share-chatroom/share-chatroom.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [NewChatRoomComponent,EditChatRoomComponent, JoinChatroomComponent, ShareChatroomComponent]
})
export class ChatroomModule { }
