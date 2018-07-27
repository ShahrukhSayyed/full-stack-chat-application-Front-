import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public oldPassword: any;
  public newPassword: any;
  public confirmPassword:any;
  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) {

   }


  ngOnInit() {
  }

  public gotoChat: any = () => {
    this.router.navigate(['/chat']);
  }

  public changePassword: any = () => {
    if (!this.oldPassword) {
      this.toastr.warning("Old Password is missing");
    }
    else if (!this.newPassword) {
      this.toastr.warning("Password is missing");
    }
    else if (!this.confirmPassword) {
      this.toastr.warning("retype Password is missing");
    }
    else if(this.newPassword != this.confirmPassword){
      this.toastr.warning("Password Doesn't match.");
    }
    else {
      let data = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        userId:Cookie.get('loggedInUser')

      }

      this.appService.changePassword(data)
        .subscribe((apiResponse) => {

          //console.log(apiResponse);
          if (apiResponse.status == 200) {
            
            this.toastr.success('Password changed Successfully');
            
            setTimeout(() => {
              this.gotoChat();
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
  }//End updatePassword function

}

