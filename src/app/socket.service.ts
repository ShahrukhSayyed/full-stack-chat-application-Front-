import { Injectable } from '@angular/core';

//Added for Http and Observables
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import * as io from 'socket.io-client';
  
@Injectable()
export class SocketService {
  public baseUrl = "http://localhost:3000";
  public socket;

  constructor(private _http: HttpClient) {
    //console.log("SocketService is called");
    //handshake is happening
    this.socket = io(this.baseUrl);

  }


  //events that has to be listen
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });//On method
    });//end observable
  }//end verifyUser

  public onlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
        observer.next(userList);
      });//end On method
    });//end observable

  }//end onlineUserList

  public disconnect = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });//end On method
    });//end observable

  }//end disconnect


  public createdChatRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('created-chatroom', (data) => {
        observer.next(data);
      });//end On method
    });//end observable

  }//end createdChatRoom

  public joinedChatRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('joined-chatroom', (data) => {
        observer.next(data);
      });//end On method
    });//end observable

  }//end joinedChatRoom


  public leavedChatRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('leaved-chatroom', (data) => {
        observer.next(data);
      });//end On method
    });//end observable

  }//end leavedChatRoom


  public deletedChatRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('deleted-chatroom', (data) => {
        observer.next(data);
      });//end On method
    });//end observable

  }//end leavedChatRoom

  //* Events that are emitted *//

  public setUser = (authToken) => {
    this.socket.emit('set-user', authToken);
  }


  public markChatAsSeen = (userDetails) => {
    this.socket.emit('mark-chat-as-seen', userDetails);
  }

  public SendChatMessage = (chatDetails) => {
    this.socket.emit('chat-msg', chatDetails);
  }

  //method to handle http calls
  private handleError(err: HttpErrorResponse) {
    console.log("Handle error HTTP calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }


  public chatByUserId = () => {
    return Observable.create((observer) => {
      this.socket.on('get-chat', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end chatByUserId

  public exitSocket = () =>{
    this.socket.disconnect();
  }// end exit socket

  //* Events that are emitted for Chat Room*//
  public createChatRoom = (data) => {
    this.socket.emit('create-chat-room', data);
  }

  public joinChatRoom = (data) => {
    this.socket.emit('join-chat-room', data);
  }

  public leaveChatRoom = (data) => {
    this.socket.emit('leave-chat-room', data);
  }

  public deleteChatRoom = (data) => {
    this.socket.emit('delete-chat-room', data);
  }

  public shareChatRoom = (emailDetails) => {
    this.socket.emit('share-chat-room', emailDetails);
  }

  public emitUserTyping = (data) => {
    this.socket.emit('typing', data);
  }

  
  public listenUserTyping = () => {
    return Observable.create((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end listenUserTyping

  public listenAuthError = () => {
    return Observable.create((observer) => {
      this.socket.on('auth-error', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end listenAuthError

}

