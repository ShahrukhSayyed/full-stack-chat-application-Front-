import { Injectable } from '@angular/core';


//Added for Http and Observables
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  public baseUrl = "chatapp-api.shahrukhsayyed.tech";

  constructor(private _http: HttpClient) {
    console.log("AppService is called");
  }

  //method to handle http calls
  private handleError(err: HttpErrorResponse) {
    console.log("Handle error HTTP calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }

  //method to SignUp the User
  public signUp = (data): Observable<any> => {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)

    let response = this._http.post(`${this.baseUrl}/api/v1/users/signup`, params);
    return response;
  }

 
  //method to SignIn the User
  public signIn = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    let response = this._http.post(`${this.baseUrl}/api/v1/users/login`, params);
    console.log(response)
    return response;
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/api/v1/users/logout`, params);

  } // end logout function

  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)

    return this._http.post(`${this.baseUrl}/api/v1/users/resetPassword`, params);

  } // end resetPassword function

  public updatePassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('recoveryPassword', data.recoveryPassword)
      .set('password', data.password)

    return this._http.post(`${this.baseUrl}/api/v1/users/updatePassword`, params);

  } // end updatePassword function

  public changePassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('oldPassword', data.oldPassword)
      .set('newPassword', data.newPassword)
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/api/v1/users/changePassword`, params);

  } // end updatePassword function

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }// end setUserInfoFromLocalstorage


public deleteUserInfoInLocalStorage = () => {
    localStorage.removeItem('userInfo');
  }// end setUserInfoFromLocalstorage



  //* Chat related methods *//
  
  public getChat(chatRoomId, skip): Observable<any> {

    return this._http.get(`${this.baseUrl}/api/v1/chat/get/for/group?chatRoom=${chatRoomId}&skip=${skip}&authToken=${Cookie.get('authToken')}`)

  } // end getChat function

  public getCount(userId, senderId): Observable<any> {

    return this._http.get(`${this.baseUrl}/api/v1/chat/count/unseen?userId=${userId}&senderId=${senderId}&authToken=${Cookie.get('authToken')}`)

  } // end getCount function

  public unseenUserList(userId): Observable<any> {

    return this._http.get(`${this.baseUrl}/api/v1/chat/unseen/user/list?userId=${userId}&authToken=${Cookie.get('authToken')}`)

  } // end unseenUserList function


  //* Chat Room related methods *//

  public updateChatRoom = (data): Observable<any> => {
    const params = new HttpParams()
      .set('chatRoomId', data.chatRoomId)
      .set('chatRoomTitle', data.chatRoomTitle)
      .set('authToken', Cookie.get('authToken'))

    return this._http.put(`${this.baseUrl}/api/v1/chatroom/update`, params);

  } // end updateChatRoom function


  public getAllRoomsUserJoined(userId): Observable<any> {

    return this._http.get(`${this.baseUrl}/api/v1/chatroom/view/all/rooms/user/joined/${userId}?authToken=${Cookie.get('authToken')}`)

  } // end getAllRoomsUserJoined function
  
  public getAllRoomsAvailableToJoin(userId): Observable<any> {

    return this._http.get(`${this.baseUrl}/api/v1/chatroom/view/all/rooms/available/to/join/${userId}?authToken=${Cookie.get('authToken')}`)

  } // end getAllRoomsAvailableToJoin function

  public getChatRoomDetails(chatRoomId): Observable<any> {

    return this._http.get(`${this.baseUrl}/api/v1/chatroom/details/${chatRoomId}?authToken=${Cookie.get('authToken')}`)

  }//

  public markGroupAsClose = (data): Observable<any> => {
    const params = new HttpParams()
      .set('chatRoomId', data)
      .set('active', 'No')
      .set('authToken', Cookie.get('authToken'))

    return this._http.put(`${this.baseUrl}/api/v1/chatroom/update`, params);

  } // end updateChatRoom function

  public deleteGroup = (data): Observable<any> => {
    const params = new HttpParams()
      .set('chatRoomId', data.chatRoomId)
      .set('userId', data.userId)
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/api/v1/chatroom/delete`, params);

  } // end updateChatRoom function


}
