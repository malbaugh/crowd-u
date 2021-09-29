import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { PasswordValidation } from 'src/Helpers/Validators/Password';
import { ChallengerRegistrationData } from 'src/Helpers/Registration/Classes/ChallengerRegistrationData';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-challenge-owner-create-department-form',
  templateUrl: './challenge-owner-create-department-form.component.html',
  styleUrls: ['./challenge-owner-create-department-form.component.css']
})
export class ChallengeOwnerCreateDepartmentFormComponent implements OnInit {

  public departmentCreateForm: FormGroup;
  public challengerRegData: ChallengerRegistrationData;
  public department: ChallengeUser;
  public dataLoaded: boolean = false;
  public hide = true;
  public hide2 = true;
  public phone: string;

  constructor(
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public usersService: UsersService,
    public departmentRef: MatDialogRef<ChallengeOwnerCreateDepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public user: ChallengeUser,
    public snackBar: MatSnackBar
    ) {}

  ngOnInit() {

    this.departmentCreateForm = this.fb.group({
      name: ['', [Validators.required]],
      pocNameFirst: ['', [Validators.required]],
      pocNameLast: ['', [Validators.required]],
      cellPhone: this.fb.group({
        country: ['', [Validators.maxLength(2), Validators.pattern('[0-9]+')]],
        area: this.validateMinMax(3, 3),
        prefix: this.validateMinMax(3, 3),
        line: this.validateMinMax(4, 4)
      }),
      username: ['', [Validators.required]],
      password: this.fb.group({
        password1: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        password2: ['', [Validators.required]]},
        { validator: PasswordValidation.MatchPassword.bind(this) }),
      email: ['', [Validators.required, Validators.email]]
    });

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

  public get name() { return this.departmentCreateForm.get('name'); }
  public get pocNameFirst() { return this.departmentCreateForm.get('pocNameFirst'); }
  public get pocNameLast() { return this.departmentCreateForm.get('pocNameLast'); }
  public get country() { return this.departmentCreateForm.get('cellPhone.country'); }
  public get area() { return this.departmentCreateForm.get('cellPhone.area'); }
  public get prefix() { return this.departmentCreateForm.get('cellPhone.prefix'); }
  public get line() { return this.departmentCreateForm.get('cellPhone.line'); }
  public get username() { return this.departmentCreateForm.get('username'); }
  public get password() { return this.departmentCreateForm.get('password'); }
  public get password1() { return this.departmentCreateForm.get('password.password1'); }
  public get password2() { return this.departmentCreateForm.get('password.password2'); }
  public get email() { return this.departmentCreateForm.get('email'); }

  public OnCreateDepartment(): void {
    this.phone = this.country.value + this.area.value + this.prefix.value + this.line.value;

    this.challengerRegData = new ChallengerRegistrationData(
      this.user.ChallengerRegistrationData.FirstName.concat(" ").concat(this.user.ChallengerRegistrationData.LastName),
      this.pocNameFirst.value.concat(" ").concat(this.pocNameLast.value),
      +this.phone,
      this.username.value,
      this.password2.value,
      this.email.value
    );
    
    this.department = new ChallengeUser(this.challengerRegData);
    this.department.ChallengeOwnerProfileData = this.user.ChallengeOwnerProfileData;
    this.department.Department = this.name.value;
    
    this.dataLoaded = false;
    this.usersService.CreateDepartment(this.department, this.user).subscribe(
      data => {
        this.dataLoaded = true;
        this.departmentRef.close(this.department);
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  public OnExit() {
    this.departmentRef.close();
  }
}
