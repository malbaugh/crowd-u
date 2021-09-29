import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ENSTATUSES } from 'src/Data/Information/EnrollmentStatus';
import { TRAVEL } from 'src/Data/Information/TravelAvailability';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { PasswordValidation } from 'src/Helpers/Validators/Password';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-participant-account-edit',
  templateUrl: './participant-account-edit.component.html',
  styleUrls: ['./participant-account-edit.component.css']
})
export class ParticipantAccountEditComponent implements OnInit {

  public accountForm: FormGroup;
  public passForm: FormGroup;
  public hide = true;
  public hide2 = true;
  public hide3 = true;
  public phone: string;
  public statuses = ENSTATUSES;
  public availabilities = TRAVEL;
  public changePass: boolean = false;
  public dataLoaded: boolean;

  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public ngZone: NgZone,
    public snackBar: MatSnackBar,
    public accountDialogRef: MatDialogRef<ParticipantAccountEditComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: ParticipantUser,
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
      cellPhone: this.validateMinMax(11,12),
      enrollmentStatus: [''],
      travelAvailability: ['']
    });

    this.email.setValue(this.currUser.ParticipantRegistrationData.Email);
    this.cellPhone.setValue(this.currUser.ParticipantProfileData.Phone);
    this.enrollmentStatus.setValue(this.currUser.ParticipantProfileData.EnrollmentStatus);
    this.travelAvailability.setValue(this.currUser.ParticipantProfileData.TravelAvailability);

    this.dataLoaded = true;
  }

  public validateMinMax(min, max) {
    return ['', [
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  public get password() { return this.passForm.get('password'); }
  public get oldPassword() { return this.passForm.get('oldPassword'); }
  public get password1() { return this.passForm.get('password.password1'); }
  public get password2() { return this.passForm.get('password.password2'); }

  public get enrollmentStatus() { return this.accountForm.get('enrollmentStatus'); }
  public get email() { return this.accountForm.get('email'); }
  public get cellPhone() { return this.accountForm.get('cellPhone'); }
  public get travelAvailability() { return this.accountForm.get('travelAvailability'); }

  public OnSubmitAccount() {
    this.currUser.ParticipantRegistrationData.Email = this.email.value;
    this.currUser.ParticipantProfileData.Phone = this.cellPhone.value;
    this.currUser.ParticipantProfileData.EnrollmentStatus = this.enrollmentStatus.value;
    this.currUser.ParticipantProfileData.TravelAvailability = this.travelAvailability.value;
    
    if (this.changePass) {
      this.dataLoaded = false;
      this.usersService.UpdateParticipantUser(this.currUser).subscribe(
        data => {
        },
        error => {
          this.snackBar.open("Was unable to update the user information.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        }, 
        () => this.usersService.UpdateParticipantUserPassword(this.oldPassword.value,this.password1.value,this.currUser.ParticipantRegistrationData.Username).subscribe(
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
          }));
    } 
    
    else {
      this.dataLoaded = false;
      this.usersService.UpdateParticipantUser(this.currUser).subscribe(
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
