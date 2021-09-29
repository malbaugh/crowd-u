import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { PasswordValidation } from 'src/Helpers/Validators/Password';
import { first } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-challenge-owner-account-edit',
  templateUrl: './challenge-owner-account-edit.component.html',
  styleUrls: ['./challenge-owner-account-edit.component.css']
})
export class ChallengeOwnerAccountEditComponent implements OnInit {

  public accountForm: FormGroup;
  public passForm: FormGroup;

  public hide1 = true;
  public hide2 = true;
  public hide3 = true;

  public phone: string;

  public changePass: boolean = false;
  
  public dataLoaded: boolean = false;
  
  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public ngZone: NgZone,
    public snackBar: MatSnackBar,
    public accountDialogRef: MatDialogRef<ChallengeOwnerAccountEditComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: ChallengeUser,
    public currentUser: CurrentUserService,
    public usersService: UsersService
  ) { }

  ngOnInit() {
    this.passForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: this.fb.group({
        password1: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        password2: ['', [Validators.required]]},
        { validator: PasswordValidation.MatchPassword.bind(this) }),
    });

    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pocName: ['', [Validators.required]],
      cellPhone: this.validateMinMax(11,12)
    });
    
    this.email.setValue(this.currUser.ChallengerRegistrationData.Email);
    this.cellPhone.setValue(this.currUser.ChallengerRegistrationData.PocPhone);
    this.pocName.setValue(this.currUser.ChallengerRegistrationData.PocFirstName.concat(" ").concat(this.currUser.ChallengerRegistrationData.PocLastName));

    this.dataLoaded = true;
  }

  public validateMinMax(min, max) {
    return ['', [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  public get password() { return this.passForm.get('password'); }
  public get oldPassword() { return this.passForm.get('oldPassword'); }
  public get password1() { return this.passForm.get('password.password1'); }
  public get password2() { return this.passForm.get('password.password2'); }

  public get email() { return this.accountForm.get('email'); }
  public get cellPhone() { return this.accountForm.get('cellPhone'); }
  public get pocName() { return this.accountForm.get('pocName'); }

  public OnSubmitAccount() {
    this.currUser.ChallengerRegistrationData.Email = this.email.value;
    this.currUser.ChallengerRegistrationData.PocPhone = this.cellPhone.value;
    this.currUser.ChallengerRegistrationData.PocFirstName = this.pocName.value.substr(0,this.pocName.value.indexOf(' '));
    this.currUser.ChallengerRegistrationData.PocLastName = this.pocName.value.substr(this.pocName.value.indexOf(' ')+1);
    
    if (this.changePass) {
      this.dataLoaded = false;
      this.usersService.UpdateChallengeUser(this.currUser).subscribe(
        data => {
        },
        error => {
          this.snackBar.open("We were unable to update the user information.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        },
        () => this.usersService.UpdateChallengeUserPassword(this.oldPassword.value,this.password1.value,this.currUser.ChallengerRegistrationData.Username).subscribe(
          data => {
            this.dataLoaded = true;

            this.currUser.Token = data;
            this.currentUser.SetCurrentUser(this.currUser);
            this.snackBar.open("Your password was changed successfully.", "Close", {duration: 2000,panelClass: ['snackbar-color']});

            this.accountDialogRef.close(this.currUser);
          },
          error => {
            this.dataLoaded = true;
            this.snackBar.open("The entered Old Password is incorrect.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
          })
        );        
    } else {
      this.dataLoaded = false;
      this.usersService.UpdateChallengeUser(this.currUser).subscribe(
        data => {
          this.dataLoaded = true;

          this.currentUser.SetCurrentUser(this.currUser);
          this.accountDialogRef.close(this.currUser);
        },
        error => {
          this.dataLoaded = true;
        });
    }
  }

  public OnExit() {
    this.accountDialogRef.close();
  }
}
