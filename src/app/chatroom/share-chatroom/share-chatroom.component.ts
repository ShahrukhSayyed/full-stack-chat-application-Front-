import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-share-chatroom',
  templateUrl: './share-chatroom.component.html',
  styleUrls: ['./share-chatroom.component.css'],
  providers: [SocketService]

})
export class ShareChatroomComponent implements OnInit {

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
  public userInfo: any;
  public authToken: string;
  public loggedInUser: string;
  public chatRoomId: any;
  public retrivedRoomDetails: { 'chatRoomId': any; 'chatRoomTitle': any; 'chatRoomLink': any; 'userName': any; };
  public email: any;
  public baseUrlApplication = 'http://localhost:4200';

  constructor(private _route: ActivatedRoute, public socketService: SocketService, public appService: AppService, public router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalstorage();
    this.loggedInUser = Cookie.get('loggedInUser');
    this.userName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
    this.chatRoomId = this._route.snapshot.paramMap.get('chatRoomId');

    this.loadChatRoomDetails(this.chatRoomId);

  }

  public gotoChat: any = () => {
    this.router.navigate(['/chat']);
  }

  public loadChatRoomDetails: any = (chatRoomId) => {
    this.appService.getChatRoomDetails(chatRoomId)
      .subscribe((responseData) => {

        if (responseData.status === 200) {

          this.retrivedRoomDetails = {
            'chatRoomId': responseData.data.chatRoomId,
            'chatRoomTitle': responseData.data.chatRoomTitle,
            'chatRoomLink': responseData.data.chatRoomLink,
            'userName': responseData.data.userName,
          };

          console.log('loadChatRoomDetails');
          console.log(this.retrivedRoomDetails);
          //console.log(this.unseenUserList);                
          this.toastr.success("Chat Room Found")


        } else {
          this.toastr.error(responseData.message)
        } // end condition

      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end 

  public shareChatRoom: any = () => {
    if (!this.loggedInUser) {
      this.toastr.warning("Missing User Id");
    }
    else if (!this.userName) {
      this.toastr.warning("Missing User Name");
    }
    else if (!this.chatRoomId) {
      this.toastr.warning("Missing Chat Room Id");
    }
    else if (!this.email) {
      this.toastr.warning("Missing Email Id");
    }
    else {

      let emailDetails = {
        emailId: this.email,
        senderName: this.userName,
        chatRoomTitle: this.retrivedRoomDetails.chatRoomTitle,
        chatRoomLink: this.retrivedRoomDetails.chatRoomLink,
        chatCreatedBy: this.retrivedRoomDetails.userName,
        baseUrlApplication:this.baseUrlApplication

      }


      this.socketService.shareChatRoom(emailDetails)

      this.toastr.success('Invite Link sent...');


      setTimeout(() => {
        this.gotoChat();
      }, 1000);

      this.router.navigate(['/chat']);


    }//End condition
  }//End joinChatRoom function

}
