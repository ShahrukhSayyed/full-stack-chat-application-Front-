import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule ,Routes } from '@angular/router';


import { LoginComponent } from './user/login/login.component'
import { SignupComponent } from './user/signup/signup.component';
import { ChatBoxComponent } from './chat/chat-box/chat-box.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { NewChatRoomComponent } from './chatroom/new-chat-room/new-chat-room.component';
import { EditChatRoomComponent } from './chatroom/edit-chat-room/edit-chat-room.component';
import { JoinChatroomComponent } from './chatroom/join-chatroom/join-chatroom.component';
import { ShareChatroomComponent } from './chatroom/share-chatroom/share-chatroom.component';


const routes: Routes = [
  {path :'login',component:LoginComponent},
  {path :'signup',component:SignupComponent},
  {path :'reset-password', component:ResetPasswordComponent},
  {path :'change-password', component:ChangePasswordComponent},

  {path :'chat', component:ChatBoxComponent},

  {path :'chatroom/new', component:NewChatRoomComponent},
  {path :'chatroom/edit/:chatRoomId', component:EditChatRoomComponent},
  {path :'chatroom/join/:chatRoomId', component:JoinChatroomComponent},
  {path :'chatroom/share/:chatRoomId', component:ShareChatroomComponent},


  {path : '',redirectTo:'login',pathMatch:'full'},
  {path :'*',component:LoginComponent},
  {path :'**',component:LoginComponent}

];


@NgModule({
  imports: [ 
    CommonModule,
    RouterModule.forRoot(routes) ,
  ],

  exports:[
    RouterModule
  ],
})
export class AppRoutingModule { }
