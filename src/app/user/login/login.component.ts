import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: any;
  public password: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) {

   }

 
  ngOnInit() {
  }

  public gotoChat: any = () => {
    this.router.navigate(['/chat']);
  }

  public gotoResetPassword: any = () => {
    this.router.navigate(['/reset-password']);
  }


  public signIn: any = () => {
    if (!this.email) {
      this.toastr.warning("Enter Email Address");
    }
    else if (!this.password) {
      this.toastr.warning("Enter Password");
    }
    else {
      let data = {
        email: this.email,
        password: this.password,
      }

      this.appService.signIn(data)
        .subscribe((apiResponse) => {
 
          //console.log(apiResponse);
          if (apiResponse.status == 200) {
            
            Cookie.set('authToken',apiResponse.data.authToken);
            //Cookie.set('receiverId',apiResponse.data.userDetails.userId);
            //Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
            Cookie.set('loggedInUser',apiResponse.data.userDetails.userId);

            /*  
            //userDetails =>
            "mobileNumber": 2234435524,
            "email": "someone@mail.com",
            "lastName": "Sengar",
            "firstName": "Rishabh",
            "userId": "-E9zxTYA8"
            
            */
            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            this.toastr.success('You are Login Successfully');
            

            setTimeout(() => {
              this.gotoChat();
            }, 1000);

          }
          else if(apiResponse.status == 404){
            this.toastr.error(apiResponse.message);
          }
        },
        (err)=>{
            this.toastr.error("Login failed . Check your Email and Password");
        });

    }//End condition
  }//End signin function

  public loginUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.signIn();

    }

  } // end sendMessageUsingKeypress

  public resetPassword: any = () => {
    if (!this.email) {
      this.toastr.warning("Enter Email Address");
    }
    else {
      let data = {
        email: this.email,
      }

      this.appService.resetPassword(data)
        .subscribe((apiResponse) => {

          //console.log(apiResponse);
          if (apiResponse.status == 200) {
            this.toastr.success('Email has sent to your registered Email ID. Please follow that instructions to reset your password');
            

            setTimeout(() => {
              this.gotoResetPassword();
            }, 1000);
          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
        (err)=>{
          this.toastr.error("Some error occured");
        });

    }//End condition
  }//End signup function



}
