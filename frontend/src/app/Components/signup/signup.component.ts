import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    public signupDialogRef: MatDialogRef<SignupComponent>,
    public currentUser: CurrentUserService) { }

  ngOnInit() {
  }

  public OnExit(): void {
    this.signupDialogRef.close();
  }
  
  public OnRegister(): void {
    this.signupDialogRef.close();
  }
}
