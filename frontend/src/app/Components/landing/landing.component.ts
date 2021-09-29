import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { ViewEncapsulation } from '@angular/core';
import { UsersService } from 'src/app/Services/Users/users.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { User } from 'src/Helpers/Users/Classes/User';
import { Subscription } from 'rxjs';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements OnInit {

  public currUser: User;
  public currentUserSubscription: Subscription;
  public users: User[] = [];

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public userService: UsersService,
    public currentUser: CurrentUserService
  ) { 
    this.currentUser.UserLocation = "/";
  }

  ngOnInit() {
    
    if (this.currentUser.CurrentUserValue) { 
      if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
        this.router.navigate(['/profile/', this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
      } 
      
      else if (this.currentUser.CurrentUserValue instanceof ChallengeUser) {
        this.router.navigate(['/profile/org/', this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
      }
    }
  }

  public OnLogin() {
    let loginDialogRef = this.dialog.open(LoginComponent);
  }

  public OnRegister() {
    let signupDialogRef = this.dialog.open(SignupComponent);
  }

  public OnSubmit() {
    this.router.navigate(['/search/']);
  }
}
