import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public recoveryPassword: any;
  public password: any;
  public confirmPassword:any;
  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) {

   }


  ngOnInit() {
  }

  public gotoSignIn: any = () => {
    this.router.navigate(['/']);
  }

  public updatePassword: any = () => {
    if (!this.recoveryPassword) {
      this.toastr.warning("Recovery Password is missing");
    }
    else if (!this.password) {
      this.toastr.warning("Password is missing");
    }
    else if (!this.confirmPassword) {
      this.toastr.warning("retype Password is missing");
    }
    else if(this.password != this.confirmPassword){
      this.toastr.warning("Password Doesn't match.");
    }
    else {
      let data = {
        recoveryPassword: this.recoveryPassword,
        password: this.password,
      }

      this.appService.updatePassword(data)
        .subscribe((apiResponse) => {

          //console.log(apiResponse);
          if (apiResponse.status == 200) {
            
            this.toastr.success('Password reset Successfully');
            

            setTimeout(() => {
              this.gotoSignIn();
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




