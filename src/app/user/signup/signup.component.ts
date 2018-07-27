import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[AppService]
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { 
      
    }

  ngOnInit() {
  }

  public gotoSignIn: any = () => {
    this.router.navigate(['/']);
  }

  public signUp: any = () => {
    if (!this.firstName) {
      this.toastr.warning("Enter First Name");
    }
    else if (!this.lastName) {
      this.toastr.warning("Enter Last Name");
    }
    else if (!this.mobileNumber) {
      this.toastr.warning("Enter Mobile Number");
    }
    else if (!this.email) {
      this.toastr.warning("Enter Email Address");
    }
    else if (!this.password) {
      this.toastr.warning("Enter Password");
    }
    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password: this.password,
      }
 
      this.appService.signUp(data)
        .subscribe((apiResponse) => {

          //console.log(apiResponse);
          if (apiResponse.status == 200) {
            this.toastr.success('You are registered Successfully');
            setTimeout(() => {
              this.gotoSignIn();
            }, 2000);
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
