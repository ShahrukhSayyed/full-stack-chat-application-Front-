import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-edit-chat-room',
  templateUrl: './edit-chat-room.component.html',
  styleUrls: ['./edit-chat-room.component.css']
})
export class EditChatRoomComponent implements OnInit {

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
  public chatRoomId: any;

  constructor(public _route:ActivatedRoute,public appService: AppService, public router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.chatRoomTitle = Cookie.get('chatRoomTitle')
    this.chatRoomId = this._route.snapshot.paramMap.get('chatRoomId');

  }

  public gotoChat: any = () => {
    this.router.navigate(['/chat']);
  }


  public updateChatRoom: any = () => {
    if (!this.chatRoomTitle) {
      this.toastr.warning("Enter chat Room Title");
    }
    else {
      let data = {
        chatRoomId: this.chatRoomId,
        chatRoomTitle: this.chatRoomTitle,
      }
      console.log()
      this.appService.updateChatRoom(data)
        .subscribe((apiResponse) => {
 
          //console.log(apiResponse);
          if (apiResponse.status == 200) {

            this.toastr.success('Chat Room Name Updated successfully');

            setTimeout(() => {
              this.gotoChat();
            }, 1000);

          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
          (err) => {
            this.toastr.error(err.message);
          });

    }//End condition
  }//End editChatRoom function

}

