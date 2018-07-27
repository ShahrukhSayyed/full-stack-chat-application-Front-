import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-join-chatroom',
  templateUrl: './join-chatroom.component.html',
  styleUrls: ['./join-chatroom.component.css'],
  providers:[SocketService]

})
export class JoinChatroomComponent implements OnInit {

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
 public userInfo:any;
 public authToken: string;
 public loggedInUser: string;
 public chatRoomId: any;
 public retrivedRoomDetails: { 'chatRoomId': any; 'chatRoomTitle': any; 'chatRoomLink': any; 'userId': any; 'userName': any; 'activeUsers': any; 'active': any; 'count': any; };

 constructor(private _route: ActivatedRoute,public socketService: SocketService, public appService: AppService, public router: Router, private toastr: ToastrService) { 
     
   }

 ngOnInit() {
  this.authToken = Cookie.get('authToken');
  this.userInfo = this.appService.getUserInfoFromLocalstorage();
  this.loggedInUser = Cookie.get('loggedInUser');
  this.userName = this.userInfo.firstName + ' ' + this.userInfo.lastName ;

  this.chatRoomId = this._route.snapshot.paramMap.get('chatRoomId');
  
  this.loadChatRoomDetails(this.chatRoomId);

}

 public gotoChat: any = () => {
   this.router.navigate(['/chat']);
 }
 
 public gotoSignIn: any = () => {
  this.router.navigate(['/login']);
}

 public loadChatRoomDetails: any = (chatRoomId) => {
    this.appService.getChatRoomDetails(chatRoomId)
      .subscribe((responseData) => {

        if (responseData.status === 200) {
          
            this.retrivedRoomDetails = { 
              'chatRoomId': responseData.data.chatRoomId, 
              'chatRoomTitle': responseData.data.chatRoomTitle, 
              'chatRoomLink': responseData.data.chatRoomLink, 
              'userId': responseData.data.userId, 
              'userName' : responseData.data.userName, 
              'activeUsers':responseData.data.activeUsers, 
              'active': responseData.data.active,
              'count':responseData.data.activeUsers.length
            };

            console.log('loadChatRoomDetails');
            console.log(this.retrivedRoomDetails);
            //console.log(this.unseenUserList);                
            this.toastr.success("Chat Room Found")
  
  
        } else {
          this.toastr.error("Please login or register to the System.")
          
          setTimeout(() => {
            this.gotoSignIn();
          }, 2000);
              
        } // end condition
         
      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end 

  public joinChatRoom: any = () => {
    if (!this.loggedInUser) {
      this.toastr.warning("Missing User Id");
    }
    else if (!this.userName) {
      this.toastr.warning("Missing User Name");
    }
    else if (!this.chatRoomId) {
      this.toastr.warning("Missing Chat Room Id");
    }
    else {
      console.log(this.userInfo)

      let chatRoomDetails = {
        userId: this.loggedInUser,
        userName: this.userName,
        chatRoomId: this.chatRoomId,
        chatRoomTitle:this.retrivedRoomDetails.chatRoomTitle,
      }
  

      this.socketService.joinChatRoom(chatRoomDetails)

      this.toastr.success('Chat Room Joined Successfully');
            
      setTimeout(() => {
        this.gotoChat();
      }, 2000);

    }//End condition
  }//End joinChatRoom function



}
