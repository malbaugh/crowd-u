import { Component, OnInit } from '@angular/core';
import { ChallengeUser } from '../../../Helpers/Users/Classes/ChallengeUser';
import { ParticipantUser } from '../../../Helpers/Users/Classes/ParticipantUser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { _filter } from 'src/Data/Information/Filter';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  public dataLoaded = false;
  public invalidCred = false;
  public user: any;
  public returnUrl: string;
  public loginForm: FormGroup;
  public hide = true;
  
  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public loginDialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public snackBar: MatSnackBar
  ) {
    //Option to redirect them to their home page if they are already logged in with cookies
  }
  
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.dataLoaded = true;
  }

  // Convenience getter for easy access to form fields
  public get form() { return this.loginForm.controls; }

  // Getters so we can get each control for error messages in form
  public get email() { return this.loginForm.get('email'); }
  public get password() { return this.loginForm.get('password'); }

  public OnSubmit() {
    this.invalidCred = false;
    this.dataLoaded = false;
    this.currentUser.Login(this.email.value, this.password.value).subscribe(
      data => {
        this.dataLoaded = true;
        if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
          this.router.navigate(['/participant/dashboard']);
          this.OnExit();
        }
        
        else if (this.currentUser.CurrentUserValue instanceof ChallengeUser) {
          this.router.navigate(['/organization/dashboard']);
          this.OnExit();
        }
      },
      error => {
        this.snackBar.open("Incorrect email or password.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.dataLoaded = true;
      });
  }

  public OnExit(): void {
    this.loginDialogRef.close();
  }

  public OnRegister(): void {
    this.loginDialogRef.close();
    let signupDialogRef = this.dialog.open(SignupComponent);
  }
}
