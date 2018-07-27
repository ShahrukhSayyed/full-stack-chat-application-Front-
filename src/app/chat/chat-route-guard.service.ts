import { Injectable } from '@angular/core';
import { CanActivate ,ActivatedRouteSnapshot,Router, Route} from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies'

@Injectable()
export class ChatRouteGuardService implements CanActivate{
  constructor(private router : Router) { 
    

  }

  canActivate(route: ActivatedRouteSnapshot) : boolean {
    console.log("In Guard Route Service...");
    
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }
  

}
