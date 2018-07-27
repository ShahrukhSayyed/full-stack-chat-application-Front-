import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';

import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { RemoveSpecialCharPipe } from '../../shared/pipe/remove-special-char.pipe';
import { FirstCharComponent } from '../../shared/first-char/first-char.component';

import { ChatMessage } from './chat'
import { CheckUser } from '../../CheckUser'

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit, ChatMessage {

  chatId?: string;
  message: string;
  createdOn: Date;
  senderId: string;
  senderName: string;
  chatRoom: string;
 
  @ViewChild('scrollMe', { read: ElementRef })

  public scrollMe: ElementRef;

  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public chatRoomId: any;
  public chatRoomTitle: any;
  
  public userList: any = [];
  public unseenUserList: any = [];
  public disconnectedSocket: boolean;
  public loggedInUser: string;
  public messageText: any;
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;
  public scrollToChatTop: boolean = false;
  public unseenMessage: number;

  public joinedGroups: any = [];
  public groupsAvailableToJoin:any = [];
  public userName: string;
  public usersInGroup: any = [];
  public lastTypedTime :any


  displayListOfGroups:boolean;
  displayChatMessage:boolean;
  userNameTyping: any;


  constructor(public appService: AppService, public socketService: SocketService, public router: Router, private toastr: ToastrService) {

 
  }

  ngOnInit() {
    //console.log("On Init is called");
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalstorage();
    this.loggedInUser = Cookie.get('loggedInUser');

    this.userName = this.userInfo.firstName + ' ' + this.userInfo.lastName ;
  
    this.verifyUserConfirmation(); //verifying user
    this.getAllRoomsUserJoinedList(); // getting list of groups joined 
    this.getAllRoomsAvailableToJoinList(); //getting list of groups available to join

    this.getMessageFromAUser()  // listening event chatByUserId

    this.createdChatRoomFunction(); // listening event createdChatRoom
    this.joinedChatRoomFunction();// listening event joinedChatRoom
    this.leavedChatRoomFunction();// listening event leavedChatRoom
    this.deletedChatRoomFunction();//// listening event deletedChatRoom

    this.listenTypingFunction()  // listening event typing

    //this.getOnlineUserList();
    //this.getunseenUserList();

  }

  ngOnChanges() {
    //console.log("On changes is called");

  }
  
  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe((apiResponse) => {
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);

      },
        (err) => {
          this.toastr.error("Some error occured");
        });
  } // end verifyUserConfirmation

  public groupSelectedToChat: any = (id, name) => {
    //console.log("setting user as active")

    // setting that user to chatting true   
    this.userList.map((user) => {
      if (user.userId == id) {
        user.chatting = true;
        //console.log(user.chatting);
      }
      else {
        user.chatting = false;
      }
    })

    Cookie.set('chatRoomId', id);
    Cookie.set('chatRoomTitle', name);

    Cookie.set('receiverId', id);
    Cookie.set('receiverName', name);

    this.chatRoomId = id;
    this.chatRoomTitle = name;
    this.messageList = [];
    this.pageValue = 0;

    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id
    }

    this.socketService.markChatAsSeen(chatDetails);
    this.getChatWithUser();
    this.getChatRoomDetails();
  } // end groupSelectedToChat function

  public getChatWithUser: any = () => {
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);

    this.appService.getChat(this.chatRoomId, this.pageValue * 10)
      .subscribe((apiResponse) => {

        //console.log(apiResponse);

        if (apiResponse.status == 200) {
          this.messageList = apiResponse.data.concat(previousData);
        } else {
          this.messageList = previousData;
          this.toastr.warning('No Messages available');
        }
        this.loadingPreviousChat = false;

      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end getChatWithUser

  public getChatRoomDetails: any = () => {

    this.appService.getChatRoomDetails(this.chatRoomId)
      .subscribe((apiResponse) => {

        //console.log(apiResponse);
        
        if (apiResponse.status == 200) {
          this.usersInGroup = [];
          
          for(let x in apiResponse.data.activeUsers){
            let currentUser = apiResponse.data.activeUsers[x].user
            if(currentUser != this.userName)
              this.usersInGroup.push(currentUser)  
            else{
              this.usersInGroup.push('You')  
            }
          }
          //console.log(this.usersInGroup)
          
        } else {
          this.toastr.warning('Group members not found');
        }
      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end getChatWithUser

  public loadEarlierPageOfChat: any = () => {
    this.loadingPreviousChat = true;

    this.pageValue++;
    this.scrollToChatTop = true;

    this.getChatWithUser()

  } // end loadPreviousChat

  public sendMessageUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is keycode of enter.
      this.sendMessage();
    }
    else{
          this.socketService.emitUserTyping(this.userName)            
      
          setTimeout(() => {
            this.socketService.emitUserTyping('')            
          }, 5000);
      
    }

  } // end sendMessageUsingKeypress

  public sendMessage: any = () => {

    if (this.messageText) {

      let chatMsgObject: ChatMessage = {
        senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('receiverName'),
        receiverId: Cookie.get('receiverId'),
        message: this.messageText,
        chatRoom: Cookie.get('chatRoomId'),
        chatRoomTitle:Cookie.get('chatRoomTitle'),
        createdOn: new Date()
      } // end chatMsgObject
      //console.log(chatMsgObject);
      this.socketService.SendChatMessage(chatMsgObject)
      this.pushToChatWindow(chatMsgObject)


    }
    else {
      this.toastr.warning('text message can not be empty')

    }

  } // end sendMessage

  public pushToChatWindow: any = (data) => {

    this.messageText = "";
    this.messageList.push(data);
    this.scrollToChatTop = false;


  }// end push to chat window;

  public getMessageFromAUser: any = () => {    
      this.socketService.chatByUserId()
      .subscribe((data) => {

        for(let x in this.joinedGroups){
          let myChatRoomId = this.joinedGroups[x].chatRoomId
          if(data.chatRoom == myChatRoomId){
            //console.log("In a chatByUserId");
            //console.log(data.chatRoom);
            
            (this.chatRoomId == data.chatRoom) ? this.messageList.push(data) : '';
    
            this.toastr.success(`${data.senderName} : ${data.message}`,`${data.chatRoomTitle}`)
    
            this.scrollToChatTop = false;
  
          }
  
        }

      });//end subscribe

  }// end get message from a user 


  public logout: any = () => {

    this.appService.logout()
      .subscribe((apiResponse) => {

        //console.log(apiResponse);
        if (apiResponse.status === 200) {
          //console.log("logout called")
          Cookie.delete('authToken');
          Cookie.delete('loggedInUser');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          Cookie.delete('chatRoomId');
          Cookie.delete('chatRoomTitle');

          this.appService.deleteUserInfoInLocalStorage()
          this.socketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.toastr.error(apiResponse.message)

        } // end condition

      }, (err) => {
        this.toastr.error('some error occured')


      });

  } // end logout

  // handle the output from a child component 

  public showUserName = (name: string) => {

    this.toastr.success("You are chatting with " + name)
  }//end showUserName

  public getOnlineUserList: any = () => {
    this.socketService.onlineUserList()
      .subscribe((respnseList) => {
        this.userList = [];
  
        for (let x in respnseList) {
          let count: number;
          if (this.loggedInUser != x) {
            this.appService.getCount(this.loggedInUser, x)
              .subscribe((apiResponse) => {
                if (apiResponse.status === 200) {
                  count = apiResponse.data;

                } else {
                  this.toastr.error(apiResponse.message)

                } // end condition

                  let temp = { 'userId': x, 'name': respnseList[x], 'chatting': false, 'unread': count ,'online' : true};
                  this.userList.push(temp);
                  //console.log(this.userList);

              },
                (err) => {
                  this.toastr.error("Some error occured");
                });
          }
        }
      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end getOnlineUserList

  public getunseenUserList: any = () => {
    this.appService.unseenUserList(this.loggedInUser)
      .subscribe((respnseList) => {

        this.unseenUserList = [];

        for (let x in respnseList.data) {
          let count: number;
          this.appService.getCount(this.loggedInUser, respnseList.data[x].userId)
            .subscribe((apiResponse) => {
              if (apiResponse.status === 200) {
                count = apiResponse.data;

              } else {
                this.toastr.error(apiResponse.message)

              } // end condition
               
                let temp = { 'userId': respnseList.data[x].userId, 'name': respnseList.data[x].firstName + " " + respnseList.data[x].lastName, 'chatting': false, 'unread': count ,'online' : false};
                
                this.unseenUserList.push(temp);  
                //console.log(this.unseenUserList);                
            },
              (err) => {
                this.toastr.error("Some error occured");
              });
        }
      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end getunseenUserList

  public getAllRoomsUserJoinedList: any = () => {
    this.appService.getAllRoomsUserJoined(this.loggedInUser)
      .subscribe((responseList) => {

        if (responseList.status === 200) {
          //console.log('getAllRoomsUserJoined');
          this.joinedGroups = [];
          for (let x in responseList.data) {
            let count= responseList.data[x].activeUsers.length;
            
            let temp = { 
              'chatRoomId': responseList.data[x].chatRoomId, 
              'chatRoomTitle': responseList.data[x].chatRoomTitle, 
              'chatRoomLink': responseList.data[x].chatRoomLink, 
              'userId': responseList.data[x].userId, 
              'userName' : responseList.data[x].userName, 
              'activeUsers':responseList.data[x].activeUsers, 
              'active': responseList.data[x].active,
              'count':count
            };
            
            
            //console.log(temp);
            this.joinedGroups.push(temp);  
            //console.log(this.joinedGroups);                
  
          }
  
        } else {
          this.toastr.info("User have not joined any group yet")
        } // end condition
         
      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end getAllRoomsUserJoinedList

  public getAllRoomsAvailableToJoinList: any = () => {
    this.appService.getAllRoomsAvailableToJoin(this.loggedInUser)
      .subscribe((responseList) => {

        if (responseList.status === 200) {
          //console.log('getAllRoomsAvailableToJoin');
          this.groupsAvailableToJoin = [];

          for (let x in responseList.data) {
            let count= responseList.data[x].activeUsers.length;
            
            let temp = { 
              'chatRoomId': responseList.data[x].chatRoomId, 
              'chatRoomTitle': responseList.data[x].chatRoomTitle, 
              'chatRoomLink': responseList.data[x].chatRoomLink, 
              'userId': responseList.data[x].userId, 
              'userName' : responseList.data[x].userName, 
              'activeUsers':responseList.data[x].activeUsers, 
              'active': responseList.data[x].active,
              'count':count
            };

             
            //console.log(temp);
            this.groupsAvailableToJoin.push(temp);  
            //console.log(this.unseenUserList);                
  
          }
  
        } else {
          this.toastr.info("No chat group available to join")
        } // end condition
         
      },
        (err) => {
          this.toastr.error("Some error occured");
        });

  }//end getAllRoomsAvailableToJoinList

  public createdChatRoomFunction: any = () => {

    this.socketService.createdChatRoom()
      .subscribe((data) => {

        //console.log("Listening createdChatRoom");
        //console.log(data);

        this.toastr.success(`${data.userName} Created the Chat Room ${data.chatRoomTitle}`)

        setTimeout(() => {
          this.getAllRoomsUserJoinedList();
          this.getAllRoomsAvailableToJoinList();
        }, 1000);
  

      });//end subscribe

  }// end createdChatRoomFunction 

  public joinedChatRoomFunction: any = () => {

    this.socketService.joinedChatRoom()
      .subscribe((data) => {

        //console.log("Listening joinedChatRoom");
        //console.log(data);
        ////console.log(data)
        this.toastr.success(`${data.userName} Joined the Chat Room ${data.chatRoomTitle}`)

        setTimeout(() => {
          this.getAllRoomsUserJoinedList();
          this.getAllRoomsAvailableToJoinList();
        }, 1000);

      });//end subscribe

  }// end joinedChatRoomFunction
  
  
  public leavedChatRoomFunction: any = () => {

    this.socketService.leavedChatRoom()
      .subscribe((data) => {

        //console.log("Listening leavedChatRoom");
        ////console.log(data);
        //console.log(data)
        this.toastr.success(`${data.userName} Leaved the Chat Room ${data.chatRoomTitle}`)

        setTimeout(() => {
          this.getAllRoomsUserJoinedList();
          this.getAllRoomsAvailableToJoinList();
        }, 2000);

      });//end subscribe

  }// end leavedChatRoomFunction

  public deletedChatRoomFunction: any = () => {

    this.socketService.deletedChatRoom()
      .subscribe((data) => {

        //console.log("Listening deletedChatRoom");
        //console.log(data);
        //console.log(data)
        //this.toastr.success(`${data.userName} Deleted the Chat Room ${data.chatRoomTitle}`)
        this.toastr.info(`${data.response}`)

        setTimeout(() => {
          //console.log("Iam in deleted")
          this.getAllRoomsUserJoinedList();
          this.getAllRoomsAvailableToJoinList();
        }, 2000);

        this.chatRoomTitle='';
      });//end subscribe

  }// end deletedChatRoomFunction

  //Emitting leaveChatRoom 
  public leaveChatRoom: any = () => {
    if (!this.loggedInUser) {
      this.toastr.warning("Missing User Id");
    }
    else if (!this.chatRoomId) {
      this.toastr.warning("Missing Chat Room Id");
    }
    else {
      //console.log(this.userInfo)

      let chatRoomDetails = {
        userId: this.loggedInUser,
        chatRoomId: this.chatRoomId,
        userName:this.userName,
        chatRoomTitle:this.chatRoomTitle
      }

      this.socketService.leaveChatRoom(chatRoomDetails)

      this.toastr.success('Chat Room Leaved Successfully');
      this.chatRoomTitle='';

    }//End condition
  }//End leaveChatRoom function

  //Emitting deleteChatRoom 
  public deleteChatRoom: any = () => {
    if (!this.loggedInUser) {
      this.toastr.warning("Missing User Id");
    }
    else if (!this.chatRoomId) {
      this.toastr.warning("Missing Chat Room Id");
    }
    else {
      //console.log(this.userInfo)

      let chatRoomDetails = {
        userId: this.loggedInUser,
        chatRoomId: this.chatRoomId,
        userName:this.userName,
        chatRoomTitle:this.chatRoomTitle
      }

      this.socketService.deleteChatRoom(chatRoomDetails)

      this.chatRoomTitle='';

    }//End condition
  }//End deleteChatRoom function


  

  public refreshArray: any = (array,value) => {
    array = array.filter(chatroom => chatroom.chatRoomId != value );  
    return array;
  } // end refreshArray

  public listenTypingFunction: any = () => {

    this.socketService.listenUserTyping()
      .subscribe((data) => {

        //console.log("Listening userTyping");
        //console.log(data);

        //this.toastr.success(`${data.userName} Created the Chat Room ${data.chatRoomTitle}`)

        this.userNameTyping = data;
      });//end subscribe



  }// end listenTyping 

  public markClose: any = (chatRoomId) => {

    this.appService.markGroupAsClose(chatRoomId)
      .subscribe((apiResponse) => {

        //console.log(apiResponse);
        if (apiResponse.status === 200) {
          //console.log("logout called")
          this.toastr.success('Chat Room Marked as Closed')

        } else {
          this.toastr.error(apiResponse.message)

        } // end condition

      }, (err) => {
        this.toastr.error('some error occured')


      });

  } // end markClose

}
  