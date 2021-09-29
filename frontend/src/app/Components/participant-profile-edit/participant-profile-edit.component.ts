import { Component, NgZone, ViewChild, OnInit, Inject } from '@angular/core';
import { ParticipantUser } from '../../../Helpers/Users/Classes/ParticipantUser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take, startWith, map, first } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { _filter } from 'src/Data/Information/Filter';
import { EDSTATUSES } from 'src/Data/Information/EducationStatus';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { STATES } from 'src/Data/Information/States';
import { AutocompleteGroup } from 'src/Data/Information/AutocompleteGroups';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-participant-profile-edit',
  templateUrl: './participant-profile-edit.component.html',
  styleUrls: ['./participant-profile-edit.component.css']
})
export class ParticipantProfileEditComponent implements OnInit {

  public headerForm: FormGroup;
  public majorGroupOptions: Observable<string[]>;
  public universityGroupOptions: Observable<string[]>;
  public concentrationGroupOptions1: Observable<string[]>;
  public concentrationGroupOptions2: Observable<string[]>;
  public concentrationGroupOptions3: Observable<string[]>;
  public majors: string[];
  public edStatuses = EDSTATUSES;
  public concentrations: string[];
  public universities: string[];
  public stateGroups = STATES;
  public selection: string;
  public dataLoaded: boolean;
  
  constructor(
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public ngZone: NgZone,
    public editDialogRef: MatDialogRef<ParticipantProfileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: ParticipantUser,
    public snackBar: MatSnackBar,
    public currentUser: CurrentUserService,
    public usersService: UsersService
  ) {}

  ngOnInit() {
    this.headerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      major: [''],
      university: ['', [Validators.required]],
      educationStatus: [''],
      location: this.fb.group({
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        postalCode: ['']}),
      concentration: this.fb.group({
        concentrationOne: [''],
        concentrationTwo: [''],
        concentrationThree: ['']}),
      linkedIn: [''] 
    });

    this.firstName.setValue(this.currUser.ParticipantRegistrationData.FirstName);
    this.lastName.setValue(this.currUser.ParticipantRegistrationData.LastName);
    this.major.setValue(this.currUser.ParticipantProfileData.Major);
    this.university.setValue(this.currUser.ParticipantRegistrationData.University);
    this.educationStatus.setValue(this.currUser.ParticipantProfileData.EducationStatus);

    if (this.currUser.ParticipantProfileData.Address.substr(0,this.currUser.ParticipantProfileData.Address.indexOf(', ')) == "") {
      this.addressTwo.setValue("");
      this.addressOne.setValue(this.currUser.ParticipantProfileData.Address.substr(this.currUser.ParticipantProfileData.Address.indexOf(', ')+1));
    } 
    
    else {
      this.addressTwo.setValue(this.currUser.ParticipantProfileData.Address.substr(this.currUser.ParticipantProfileData.Address.indexOf(', ')+1));
      this.addressOne.setValue(this.currUser.ParticipantProfileData.Address.substr(0,this.currUser.ParticipantProfileData.Address.indexOf(', ')));
    }

    this.city.setValue(this.currUser.ParticipantProfileData.City);
    this.state.setValue(this.currUser.ParticipantProfileData.State);
    this.postalCode.setValue(this.currUser.ParticipantProfileData.PostalCode);
    this.concentrationOne.setValue(this.currUser.ParticipantProfileData.Concentration[0]);
    this.concentrationTwo.setValue(this.currUser.ParticipantProfileData.Concentration[1]);
    this.concentrationThree.setValue(this.currUser.ParticipantProfileData.Concentration[2]);
    this.linkedIn.setValue(this.currUser.ParticipantProfileData.LinkedIn);
    
    this.majorGroupOptions = this.headerForm.get('major')!.valueChanges
      .pipe(startWith(''),map(value => this._filterMajors(value)));

    this.universityGroupOptions = this.headerForm.get('university')!.valueChanges
      .pipe(startWith(''),map(value => this._filterUniversities(value)));

    this.concentrationGroupOptions1 = this.headerForm.get('concentration.concentrationOne')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));
    
    this.concentrationGroupOptions2 = this.headerForm.get('concentration.concentrationTwo')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.concentrationGroupOptions3 = this.headerForm.get('concentration.concentrationThree')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.stateGroupOptions = this.headerForm.get('location.state')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroupState(value)));

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

  public stateGroupOptions: Observable<AutocompleteGroup[]>;
  public _filterGroupState(value: string): AutocompleteGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({parent: group.parent, name: _filter(group.name, value)}))
        .filter(group => group.name.length > 0);
    }
    return this.stateGroups;
  }

  // Getters so we can get each control for error messages in form
  public get firstName() { return this.headerForm.get('firstName'); }
  public get lastName() { return this.headerForm.get('lastName'); }
  public get university() { return this.headerForm.get('university'); }
  public get addressOne() { return this.headerForm.get('location.addressOne'); }
  public get addressTwo() { return this.headerForm.get('location.addressTwo'); }
  public get city() { return this.headerForm.get('location.city'); }
  public get state() { return this.headerForm.get('location.state'); }
  public get postalCode() { return this.headerForm.get('location.postalCode'); }
  public get major() { return this.headerForm.get('major'); }
  public get educationStatus() { return this.headerForm.get('educationStatus'); }
  public get concentrationOne() { return this.headerForm.get('concentration.concentrationOne'); }
  public get concentrationTwo() { return this.headerForm.get('concentration.concentrationTwo'); }
  public get concentrationThree() { return this.headerForm.get('concentration.concentrationThree'); }
  public get linkedIn() { return this.headerForm.get('linkedIn'); }

  public OnSubmitHeader() {
    this.currUser.ParticipantRegistrationData.FirstName = this.firstName.value;
    this.currUser.ParticipantRegistrationData.LastName = this.lastName.value;
    this.currUser.ParticipantProfileData.Major = this.major.value;
    this.currUser.ParticipantRegistrationData.University = this.university.value;
    this.currUser.ParticipantProfileData.EducationStatus = this.educationStatus.value;

    if (this.addressTwo.value == "") {
      this.currUser.ParticipantProfileData.Address = this.addressOne.value;
    } 
    
    else {
      this.currUser.ParticipantProfileData.Address = this.addressOne.value.concat(', ').concat(this.addressTwo.value);
    }

    this.currUser.ParticipantProfileData.City = this.city.value;
    this.currUser.ParticipantProfileData.State = this.state.value;
    this.currUser.ParticipantProfileData.PostalCode = this.postalCode.value;
    this.currUser.ParticipantProfileData.Concentration[0] = this.concentrationOne.value;
    this.currUser.ParticipantProfileData.Concentration[1] = this.concentrationTwo.value;
    this.currUser.ParticipantProfileData.Concentration[2] = this.concentrationThree.value;

    if (this.linkedIn.value != "") {
      var link = this.linkedIn.value.split("://");
      if (link.length == 1) {
        this.currUser.ParticipantProfileData.LinkedIn = "https://" + this.linkedIn.value;
      } else {
        this.currUser.ParticipantProfileData.LinkedIn = this.linkedIn.value;
      }
    } else {
      this.currUser.ParticipantProfileData.LinkedIn = "";
    }
    this.dataLoaded = false;
    this.usersService.UpdateParticipantUser(this.currUser).subscribe(
      data => {
      
      },
      error => {},
      () => this.usersService.CreateConcentration(this.concentrationOne.value).subscribe(
        () => this.usersService.CreateConcentration(this.concentrationTwo.value).subscribe(
          () => this.usersService.CreateConcentration(this.concentrationThree.value).subscribe(
            () => this.usersService.CreateMajor(this.major.value).subscribe(
              () => this.usersService.CreateUniversity(this.university.value).subscribe(
                data => {
                  this.dataLoaded = true;
                  this.currentUser.SetCurrentUser(this.currUser);
                  this.editDialogRef.close(this.currUser);
                },
                error => {
                  this.dataLoaded = true;
                  this.currentUser.SetCurrentUser(this.currUser);
                  this.editDialogRef.close(this.currUser);
                }
              )
            )
          )
        )
      )
    );
  }

  public OnExit() {
    this.editDialogRef.close();
  }
}
