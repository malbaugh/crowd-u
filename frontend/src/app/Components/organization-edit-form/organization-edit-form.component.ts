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
  selector: 'app-organization-edit-form',
  templateUrl: './organization-edit-form.component.html',
  styleUrls: ['./organization-edit-form.component.css']
})
export class OrganizationEditFormComponent implements OnInit {

  public accountForm: FormGroup;
  public passForm: FormGroup;

  public changePass: boolean = false;
  public hide1 = true;
  public hide2 = true;
  public hide3 = true;

  public phone: string;
  
  public dataLoaded: boolean = false;
  
  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public ngZone: NgZone,
    public snackBar: MatSnackBar,
    public accountDialogRef: MatDialogRef<OrganizationEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public department: ChallengeUser,
    public currentUser: CurrentUserService,
    public usersService: UsersService
  ) { }

  ngOnInit() {
    this.passForm = this.fb.group({
      password: this.fb.group({
        password1: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        password2: ['', [Validators.required]]},
        { validator: PasswordValidation.MatchPassword.bind(this) }),
    });

    this.accountForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      pocName: ['', [Validators.required]],
      cellPhone: this.validateMinMax(11,12)
    });
    
    this.name.setValue(this.department.Department);
    this.email.setValue(this.department.ChallengerRegistrationData.Email);
    this.cellPhone.setValue(this.department.ChallengerRegistrationData.PocPhone);
    this.pocName.setValue(this.department.ChallengerRegistrationData.PocFirstName.concat(" ").concat(this.department.ChallengerRegistrationData.PocLastName));

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
  public get password1() { return this.passForm.get('password.password1'); }
  public get password2() { return this.passForm.get('password.password2'); }

  public get name() { return this.accountForm.get('name'); }
  public get email() { return this.accountForm.get('email'); }
  public get cellPhone() { return this.accountForm.get('cellPhone'); }
  public get pocName() { return this.accountForm.get('pocName'); }

  public OnSubmitAccount() {
    this.department.Department = this.name.value;
    this.department.ChallengerRegistrationData.Email = this.email.value;
    this.department.ChallengerRegistrationData.PocPhone = this.cellPhone.value;
    this.department.ChallengerRegistrationData.PocFirstName = this.pocName.value.substr(0,this.pocName.value.indexOf(' '));
    this.department.ChallengerRegistrationData.PocLastName = this.pocName.value.substr(this.pocName.value.indexOf(' ')+1);
    
    if (this.changePass) {
      this.dataLoaded = false;
      this.usersService.UpdateDepartment(this.department).subscribe(
        data => {
        },
        error => {
          this.dataLoaded = true;
          this.snackBar.open("We were unable to update the user information.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        },
        () => this.usersService.UpdateDepartmentPassword(this.department,this.password1.value).subscribe(
          data => {
            this.dataLoaded = true;

            this.snackBar.open("Your password was changed successfully.", "Close", {duration: 2000,panelClass: ['snackbar-color']});

            this.accountDialogRef.close(this.department);
          },
          error => {
            this.dataLoaded = true;
            this.snackBar.open("The entered Old Password is incorrect.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
          })
        );        
    } else {
      this.dataLoaded = false;
      this.usersService.UpdateDepartment(this.department).subscribe(
        data => {
          this.dataLoaded = true;

          this.accountDialogRef.close(this.department);
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
