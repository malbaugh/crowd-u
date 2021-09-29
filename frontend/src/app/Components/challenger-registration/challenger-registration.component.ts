import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { IChallengerRegistrationData } from 'src/Helpers/Registration/Interfaces/IChallengerRegistrationData';
import { ChallengerRegistrationData } from 'src/Helpers/Registration/Classes/ChallengerRegistrationData';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { IChallengeOwnerProfileData } from 'src/Helpers/ProfileData/Interfaces/IChallengeOwnerProfileData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeOwnerProfileData } from 'src/Helpers/ProfileData/Classes/ChallengeOwnerProfileData';
import { PasswordValidation } from '../../../Helpers/Validators/Password';
import { take, startWith, map, first } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Observable } from 'rxjs';
import { _filter } from 'src/Data/Information/Filter';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { MatSnackBar, MatStepper, MatDialog } from '@angular/material';
import { STATES } from 'src/Data/Information/States';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-challenger-registration',
  templateUrl: './challenger-registration.component.html',
  styleUrls: ['./challenger-registration.component.css']
})
export class ChallengerRegistrationComponent implements OnInit {

  public industryGroupOptions: Observable<string[]>;
  public regData: IChallengerRegistrationData;  
  public proData: IChallengeOwnerProfileData;
  public user: ChallengeUser;
  public challengerRegForm: FormGroup;
  public profileForm: FormGroup;
  public returnUrl: string;
  public isLinear = true; // Set false for easier debugging
  public hide = true;
  public hide2 = true;
  public phone: string;
  public industries: string[];
  public states = STATES;
  public dataLoaded = false;
  @ViewChild(MatStepper) stepper: MatStepper;
  public address: string;
  public image: string = null;

  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public ngZone: NgZone,
    public currentUser: CurrentUserService,
    public usersService: UsersService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.currentUser.UserLocation = "/registration";
    if (this.currentUser.CurrentUserValue) { 
      this.router.navigate(['/profile/org/', this.currentUser.CurrentUserValue.UserRegistrationData.Username])
    }
  }

  ngOnInit() {
    this.challengerRegForm = this.fb.group({
      company: ['', [Validators.required]],
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
    
    this.profileForm = this.fb.group({
      location: this.fb.group({
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        postalCode: ['']}),
      industry: [''],
      description: [''],
      about: [''],
      linkedIn: [''],
      website: ['']
    });

    this.industryGroupOptions = this.profileForm.get('industry')!.valueChanges.pipe(startWith(''),map(value => this._filterIndustries(value)));

    this.usersService.GetData().subscribe(
      data => {
        this.industries = data['industries'];
        this.dataLoaded = true;
      },
      error => {
        this.dataLoaded = true;
      }
    );
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
  
  public _filterIndustries(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.industries.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.industries;
  }

  public validateMinMax(min, max) {
    return ['', [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  // Convenience getter for easy access to form fields
  public get regForm() { return this.challengerRegForm.controls; }
  public get proForm() { return this.profileForm.controls; }

  // Getters so we can get each control for error messages in form
  public get company() { return this.challengerRegForm.get('company'); }
  public get pocNameFirst() { return this.challengerRegForm.get('pocNameFirst'); }
  public get pocNameLast() { return this.challengerRegForm.get('pocNameLast'); }
  public get country() { return this.challengerRegForm.get('cellPhone.country'); }
  public get area() { return this.challengerRegForm.get('cellPhone.area'); }
  public get prefix() { return this.challengerRegForm.get('cellPhone.prefix'); }
  public get line() { return this.challengerRegForm.get('cellPhone.line'); }
  public get username() { return this.challengerRegForm.get('username'); }
  public get password() { return this.challengerRegForm.get('password'); }
  public get password1() { return this.challengerRegForm.get('password.password1'); }
  public get password2() { return this.challengerRegForm.get('password.password2'); }
  public get email() { return this.challengerRegForm.get('email'); }
  
  public get addressOne() { return this.profileForm.get('location.addressOne'); }
  public get addressTwo() { return this.profileForm.get('location.addressTwo'); }
  public get city() { return this.profileForm.get('location.city'); }
  public get state() { return this.profileForm.get('location.state'); }
  public get postalCode() { return this.profileForm.get('location.postalCode'); }
  public get industry() { return this.profileForm.get('industry'); }
  public get description() { return this.profileForm.get('description'); }
  public get about() { return this.profileForm.get('about'); }
  public get linkedIn() { return this.profileForm.get('linkedIn'); }
  public get website() { return this.profileForm.get('website'); }

  public OnSubmitRegistration() {
    this.phone = this.country.value + this.area.value + this.prefix.value + this.line.value;
    this.regData = new ChallengerRegistrationData(this.company.value,this.pocNameFirst.value.concat(" ").concat(this.pocNameLast.value),+this.phone,this.username.value,this.password1.value,this.email.value);
    this.user = new ChallengeUser(this.regData);
  }

  public OnSubmitProfile() {
    if (this.addressTwo.value == "") {
      this.address = this.addressOne.value;
    } 
    
    else {
      this.address = this.addressOne.value.concat(', ').concat(this.addressTwo.value);
    }

    if (this.website.value != "") {
      var link1 = this.website.value.split("://");
      var web: string;
      if (link1.length == 1) {
        web = "https://" + this.website.value;
      } else {
        web = this.website.value;
      }
    } else {
      web = "";
    }
    
    if (this.linkedIn.value != "") {
      var link2 = this.linkedIn.value.split("://");
      var linkedin: string;
      if (link2.length == 1) {
        linkedin = "https://" + this.linkedIn.value;
      } else {
        linkedin = this.linkedIn.value;
      }
    } else {
      linkedin = "";
    }

    this.proData = new ChallengeOwnerProfileData(this.address, this.city.value, this.state.value, +this.postalCode.value, this.description.value, this.about.value, linkedin, "", web, this.industry.value);
    this.user.ChallengeOwnerProfileData = this.proData;
  }

  public OnAgree() {
    this.dataLoaded = false; 

    if (this.image != null) {
      this.image = this.image.split(",")[1];
    }

    this.usersService.RegisterChallengeUser(this.user, this.image).subscribe(
      () => this.usersService.CreateIndustry(this.industry.value).subscribe(
        () => this.currentUser.Login(this.user.UserRegistrationData.Email, this.user.UserRegistrationData.Password).subscribe(
          data => {
            this.dataLoaded = true;
            this.currentUser.UserLocation = "";
            this.router.navigate(['/organization/dashboard']);
          },
          error => {
            this.dataLoaded = true;
          })
      ));
  }

  public OnSelectImage(event) {
    if (event.target.files && event.target.files[0]) {
      let imageDialog = this.dialog.open(ImageUploaderComponent, {
        data: event
      });

      imageDialog.afterClosed().subscribe(
        data => {
          this.image = data.base64;
        },
        error => {
        }
      );
    }
  }

  public Delete(){
    this.image = null;
  }
}
