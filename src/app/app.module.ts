import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module'

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Added for toast message
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ], 
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ChatModule,
    UserModule,
    ChatroomModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
