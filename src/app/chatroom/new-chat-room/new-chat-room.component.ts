import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-new-chat-room',
  templateUrl: './new-chat-room.component.html',
  styleUrls: ['./new-chat-room.component.css'],
  providers:[SocketService]
})
export class NewChatRoomComponent implements OnInit {

  /*
  chatRoomId: { type: String, unique: true, required: true },A
  chatRoomTitle: { type: String, default: '' }, i
  chatRoomLink: { type: String, default: '' },  D
  userName: { type: String, default: '' },      D
  userId: { type: String, default: '' },        D   
  active: { type: Boolean, default: true },     A
  activeUsers:[],                               A
  createdOn: { type: Date, default: Date.now },A
  modifiedOn: { type: Date, default: Date.now }A

  */
  public chatRoomTitle: any;
  public userName: any;
  public userId: any;
  public baseUsrl = 'http://localhost:4200';
  public userInfo:any;

  constructor(public socketService: SocketService, public appService: AppService, public router: Router, private toastr: ToastrService) { 
      
    }

  ngOnInit() {
    this.userInfo = this.appService.getUserInfoFromLocalstorage();

  }
 
  public gotoChat: any = () => {
    this.router.navigate(['/chat']);
  }
 
  public createChatRoom: any = () => {
    if (!this.chatRoomTitle) {
      this.toastr.warning("Missing chat Room Title");
    }
    else {
      console.log(this.userInfo)
      let data = {
        chatRoomTitle: this.chatRoomTitle,
        chatRoomLink: this.baseUsrl ,
        userName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
        userId: this.userInfo.userId,
      }

      this.socketService.createChatRoom(data)
      this.toastr.success('Chat Room Created Successfully');
            
      
      setTimeout(() => {
        this.gotoChat();
      }, 2000);

    }//End condition
  }//End createChatRoom function



}

