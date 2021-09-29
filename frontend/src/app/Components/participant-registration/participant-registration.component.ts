import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { IParticipantRegistrationData } from '../../../Helpers/Registration/Interfaces/IParticipantRegistrationData';
import { ParticipantRegistrationData } from '../../../Helpers/Registration/Classes/ParticipantRegistrationData';
import { ParticipantUser } from '../../../Helpers/Users/Classes/ParticipantUser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordValidation } from '../../../Helpers/Validators/Password';
import { ValidateDob } from '../../../Helpers/Validators/OverEighteen';
import { Observable } from 'rxjs';
import { take, startWith, map, first } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { IParticipantProfileData } from 'src/Helpers/ProfileData/Interfaces/IParticipantProfileData';
import { ParticipantProfileData } from 'src/Helpers/ProfileData/Classes/ParticipantProfileData';
import { _filter } from 'src/Data/Information/Filter';
import { ENSTATUSES } from 'src/Data/Information/EnrollmentStatus';
import { EDSTATUSES } from 'src/Data/Information/EducationStatus';
import { TRAVEL } from 'src/Data/Information/TravelAvailability';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { MatSnackBar, MatStepper, MatDialog } from '@angular/material';
import { STATES } from 'src/Data/Information/States';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';

@Component({
  selector: 'app-participant-registration',
  templateUrl: './participant-registration.component.html',
  styleUrls: ['./participant-registration.component.css']
})
export class ParticipantRegistrationComponent implements OnInit {

  public majorGroupOptions: Observable<string[]>;
  public universityGroupOptions: Observable<string[]>;
  public concentrationGroupOptions1: Observable<string[]>;
  public concentrationGroupOptions2: Observable<string[]>;
  public concentrationGroupOptions3: Observable<string[]>;
  public regData: IParticipantRegistrationData;
  public proData: IParticipantProfileData;
  public user: ParticipantUser;
  public participantRegForm: FormGroup;
  public profileForm: FormGroup;
  public returnUrl: string;
  public isLinear = true; // Set false for easier debugging
  public hide = true;
  public hide2 = true;
  public phone: string;
  public statuses = ENSTATUSES;
  public edStatuses = EDSTATUSES;
  public availabilities = TRAVEL;
  public states = STATES;
  public concentrations: string[];
  public universities: string[];
  public majors: string[];
  public registered = false;
  public dataLoaded = false;
  public selection: string;
  @ViewChild(MatStepper) stepper: MatStepper;
  public address: string;
  public image: string = null;
  public contest: Contest;
  public registrationCount: number;

  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public ngZone: NgZone,
    public currentUser: CurrentUserService,
    public usersService: UsersService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public challengesService: ChallengesService,
  ) {
    this.currentUser.UserLocation = "/registration";
    if (this.currentUser.CurrentUserValue) { 
      this.router.navigate(['/profile/', this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
    }
  }

  ngOnInit() {

    if (this.router.url.split("/")[2] != undefined) {
      this.challengesService.GetContestById(+this.router.url.split("/")[2].split("challenge-id-")[1]).subscribe(
        data => {
          this.contest = data;
        }, error => {}
      );
    }

    this.participantRegForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: this.fb.group({
        password1: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        password2: ['', [Validators.required]]},
        { validator: PasswordValidation.MatchPassword.bind(this) }),
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required, ValidateDob]],
      university: ['', [Validators.required]]});
    
    this.profileForm = this.fb.group({
      cellPhone: this.fb.group({
        country: this.validateMinMax(1, 2),
        area: this.validateMinMax(3, 3),
        prefix: this.validateMinMax(3, 3),
        line: this.validateMinMax(4, 4)
      }),
      location: this.fb.group({
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        postalCode: ['']}),
      educationStatus: [''],
      enrollmentStatus: [''],
      major: [''],
      travelAvailability: [''],
      concentration: this.fb.group({
        concentrationOne: [''],
        concentrationTwo: [''],
        concentrationThree: ['']}),
      description: [''],
      about: [''],
      linkedIn: [''],
      website: ['']
    });

    this.majorGroupOptions = this.profileForm.get('major')!.valueChanges
      .pipe(startWith(''),map(value => this._filterMajors(value)));

    this.universityGroupOptions = this.participantRegForm.get('university')!.valueChanges
      .pipe(startWith(''),map(value => this._filterUniversities(value)));

    this.concentrationGroupOptions1 = this.profileForm.get('concentration.concentrationOne')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));
    
    this.concentrationGroupOptions2 = this.profileForm.get('concentration.concentrationTwo')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.concentrationGroupOptions3 = this.profileForm.get('concentration.concentrationThree')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.usersService.GetData().subscribe(
      data => {
        this.concentrations = data['concentrations'];
        this.majors = data['majors'];
        this.universities = data['universities'];

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

  public _filterMajors(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.majors.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.majors;
  }

  public _filterUniversities(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.universities.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.universities;
  }

  public _filterConcentrations(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.concentrations.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.concentrations;
  }

  public validateMinMax(min, max) {
    return ['', [
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  // Convenience getter for easy access to form fields
  public get regForm() { return this.participantRegForm.controls; }
  public get proForm() { return this.profileForm.controls; }

  // Getters so we can get each control for error messages in form
  public get firstName() { return this.participantRegForm.get('firstName'); }
  public get lastName() { return this.participantRegForm.get('lastName'); }
  public get username() { return this.participantRegForm.get('username'); }
  public get password() { return this.participantRegForm.get('password'); }
  public get password1() { return this.participantRegForm.get('password.password1'); }
  public get password2() { return this.participantRegForm.get('password.password2'); }
  public get email() { return this.participantRegForm.get('email'); }
  public get dob() { return this.participantRegForm.get('dob'); }
  public get university() { return this.participantRegForm.get('university'); }

  public get country() { return this.profileForm.get('cellPhone.country'); }
  public get area() { return this.profileForm.get('cellPhone.area'); }
  public get prefix() { return this.profileForm.get('cellPhone.prefix'); }
  public get line() { return this.profileForm.get('cellPhone.line'); }
  public get addressOne() { return this.profileForm.get('location.addressOne'); }
  public get addressTwo() { return this.profileForm.get('location.addressTwo'); }
  public get city() { return this.profileForm.get('location.city'); }
  public get state() { return this.profileForm.get('location.state'); }
  public get postalCode() { return this.profileForm.get('location.postalCode'); }
  public get major() { return this.profileForm.get('major'); }
  public get educationStatus() { return this.profileForm.get('educationStatus'); }
  public get enrollmentStatus() { return this.profileForm.get('enrollmentStatus'); }
  public get travelAvailability() { return this.profileForm.get('travelAvailability'); }
  public get concentrationOne() { return this.profileForm.get('concentration.concentrationOne'); }
  public get concentrationTwo() { return this.profileForm.get('concentration.concentrationTwo'); }
  public get concentrationThree() { return this.profileForm.get('concentration.concentrationThree'); }
  public get description() { return this.profileForm.get('description'); }
  public get about() { return this.profileForm.get('about'); }
  public get linkedIn() { return this.profileForm.get('linkedIn'); }
  public get website() { return this.profileForm.get('website'); }

  public OnSubmitRegistration() {
    this.regData = new ParticipantRegistrationData(this.firstName.value.concat(" ").concat(this.lastName.value),this.username.value,this.email.value,this.university.value,this.password1.value,this.dob.value);
    this.user = new ParticipantUser(this.regData);
  }

  public OnSubmitProfile() {
    this.registered = false;

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

    this.phone = this.country.value + this.area.value + this.prefix.value + this.line.value;
    this.proData = new ParticipantProfileData(+this.phone, this.address, this.city.value, this.state.value, +this.postalCode.value, this.educationStatus.value, this.enrollmentStatus.value, this.major.value, this.travelAvailability.value, [this.concentrationOne.value, this.concentrationTwo.value, this.concentrationThree.value], this.description.value, this.about.value, linkedin, "", web);
    this.user.ParticipantProfileData = this.proData;
  }

  public OnAgree() {
    this.dataLoaded = false;

    if (this.image != null) {
      this.image = this.image.split(",")[1];
    }

    this.usersService.RegisterParticipantUser(this.user, this.image).subscribe(
      () => this.usersService.CreateConcentration(this.concentrationOne.value).subscribe(
        () => this.usersService.CreateConcentration(this.concentrationTwo.value).subscribe(
          () => this.usersService.CreateConcentration(this.concentrationThree.value).subscribe(
            () => this.usersService.CreateMajor(this.major.value).subscribe(
              () => this.usersService.CreateUniversity(this.university.value).subscribe(
                () => this.currentUser.Login(this.user.UserRegistrationData.Email, this.user.UserRegistrationData.Password).subscribe(
                  data => {
                    if (this.router.url.split("/")[2] == undefined) {
                      this.dataLoaded = true;
                      this.currentUser.UserLocation = "";
                      this.router.navigate(['/search/']);
                    }
                    
                    else {
                      if (this.contest.ContestData.UserLimit == -1) {
                        this.usersService.RegisterForChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
                          data => {
                            this.router.navigate(['/contest/',this.contest.ContestData.Id]);
                          },
                          error => {
                            this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                          }
                        );
                      }
                      else {
                        this.challengesService.GetNumberRegisteredForChallenge(this.contest.ContestData.Id).subscribe(
                          data => {
                            this.registrationCount = data;
                            if (this.registrationCount < this.contest.ContestData.UserLimit) {
                              this.usersService.RegisterForChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
                                data => {
                                  this.router.navigate(['/contest/',this.contest.ContestData.Id]);
                                },
                                error => {}
                              );
                            }
                            else {
                              this.snackBar.open("Sorry, there are no more spots available for this contest.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                              this.router.navigate(['/contest/',this.contest.ContestData.Id]);
                            }
                          }, error => {});
                      }
                    }
                  },
                  error => {
                    this.dataLoaded = true;
                  })
                )
              )
            )
          )
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
