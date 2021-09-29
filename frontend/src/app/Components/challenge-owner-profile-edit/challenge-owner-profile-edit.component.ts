import { Component, OnInit, Inject } from '@angular/core';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _filter } from 'src/Data/Information/Filter';
import { Observable } from 'rxjs';
import { startWith, map, first } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { STATES } from 'src/Data/Information/States';
import { AutocompleteGroup } from 'src/Data/Information/AutocompleteGroups';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-challenge-owner-profile-edit',
  templateUrl: './challenge-owner-profile-edit.component.html',
  styleUrls: ['./challenge-owner-profile-edit.component.css']
})
export class ChallengeOwnerProfileEditComponent implements OnInit {

  public headerForm: FormGroup;
  public industries: string[];
  public industryGroupOptions: Observable<string[]>;
  public stateGroups = STATES;
  public dataLoaded: boolean;
  
  constructor(
    public fb: FormBuilder,
    public editDialogRef: MatDialogRef<ChallengeOwnerProfileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: ChallengeUser,
    public snackBar: MatSnackBar,
    public currentUser: CurrentUserService,
    public usersService: UsersService
  ) { }

  ngOnInit() {
    this.headerForm = this.fb.group({
      company: ['', [Validators.required]],
      description: [''],
      industry: [''],
      location: this.fb.group({
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        postalCode: ['']}),
      linkedIn: ['']
    });

    this.company.setValue(this.currUser.ChallengerRegistrationData.FirstName.concat(" ").concat(this.currUser.ChallengerRegistrationData.LastName));
    this.description.setValue(this.currUser.ChallengeOwnerProfileData.Description);
    this.industry.setValue(this.currUser.ChallengeOwnerProfileData.Industry);

    if (this.currUser.ChallengeOwnerProfileData.Address.substr(0,this.currUser.ChallengeOwnerProfileData.Address.indexOf(', ')) == "") {
      this.addressTwo.setValue("");
      this.addressOne.setValue(this.currUser.ChallengeOwnerProfileData.Address.substr(this.currUser.ChallengeOwnerProfileData.Address.indexOf(', ')+1));
    } 
    
    else {
      this.addressTwo.setValue(this.currUser.ChallengeOwnerProfileData.Address.substr(this.currUser.ChallengeOwnerProfileData.Address.indexOf(', ')+1));
      this.addressOne.setValue(this.currUser.ChallengeOwnerProfileData.Address.substr(0,this.currUser.ChallengeOwnerProfileData.Address.indexOf(', ')));
    }

    this.city.setValue(this.currUser.ChallengeOwnerProfileData.City);
    this.state.setValue(this.currUser.ChallengeOwnerProfileData.State);
    this.postalCode.setValue(this.currUser.ChallengeOwnerProfileData.PostalCode);
    this.linkedIn.setValue(this.currUser.ChallengeOwnerProfileData.LinkedIn);

    this.industryGroupOptions = this.headerForm.get('industry')!.valueChanges.pipe(startWith(''),map(value => this._filterIndustries(value)));

    this.stateGroupOptions = this.headerForm.get('location.state')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroupState(value)));

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

  public _filterIndustries(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.industries.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.industries;
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

  public get company() { return this.headerForm.get('company'); }  
  public get addressOne() { return this.headerForm.get('location.addressOne'); }
  public get addressTwo() { return this.headerForm.get('location.addressTwo'); }
  public get city() { return this.headerForm.get('location.city'); }
  public get state() { return this.headerForm.get('location.state'); }
  public get postalCode() { return this.headerForm.get('location.postalCode'); }
  public get industry() { return this.headerForm.get('industry'); }
  public get description() { return this.headerForm.get('description'); }
  public get linkedIn() { return this.headerForm.get('linkedIn'); }

  public OnSubmitHeader() {
    this.currUser.ChallengerRegistrationData.FirstName = this.company.value.substr(0,this.company.value.indexOf(' '));
    this.currUser.ChallengerRegistrationData.LastName = this.company.value.substr(this.company.value.indexOf(' ')+1);
    this.currUser.ChallengeOwnerProfileData.Description = this.description.value;
    this.currUser.ChallengeOwnerProfileData.Industry = this.industry.value;

    if (this.addressTwo.value == "") {
      this.currUser.ChallengeOwnerProfileData.Address = this.addressOne.value;
    } else {
      this.currUser.ChallengeOwnerProfileData.Address = this.addressOne.value.concat(', ').concat(this.addressTwo.value);
    }
    
    this.currUser.ChallengeOwnerProfileData.City = this.city.value;
    this.currUser.ChallengeOwnerProfileData.State = this.state.value;
    this.currUser.ChallengeOwnerProfileData.PostalCode = this.postalCode.value;
    
    if (this.linkedIn.value != "") {
      var link = this.linkedIn.value.split("://");
      if (link.length == 1) {
        this.currUser.ChallengeOwnerProfileData.LinkedIn = "https://" + this.linkedIn.value;
      } else {
        this.currUser.ChallengeOwnerProfileData.LinkedIn = this.linkedIn.value;
      }
    } else {
      this.currUser.ChallengeOwnerProfileData.LinkedIn = "";
    }

    this.dataLoaded = false;
    this.usersService.UpdateChallengeUser(this.currUser).subscribe(
      data => {
        
      },
      error => {},
      () => this.usersService.CreateIndustry(this.industry.value).subscribe(
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
      ));
  }

  public OnExit() {
    this.editDialogRef.close();
  }
}
