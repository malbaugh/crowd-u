import { Component } from '@angular/core';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { MatDialog } from '@angular/material';
import { ParticipantAccountEditComponent } from '../participant-account-edit/participant-account-edit.component';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ChallengeOwnerAccountEditComponent } from '../challenge-owner-account-edit/challenge-owner-account-edit.component';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  public partUser: ParticipantUser;
  public challUser: ChallengeUser;
  public searchForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public currentUser: CurrentUserService,
    public fb: FormBuilder) {   }

  ngOnInit() { 
    this.searchForm = this.fb.group({search: ['']});
  }

  public ChallengerTest(user: any) {
    return user instanceof ChallengeUser;
  }
  public ParticipantTest(user: any) {
    return user instanceof ParticipantUser;
  }

  public OnSearchSubmit() {
    this.currentUser.UserSearch = this.searchForm.get('search').value;
    this.searchForm.reset();
    this.router.navigate(['/search/']);
  }

  public OnChallengerProfile() {
    this.router.navigate(['/profile/org/', this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
  }
  public OnChallengerOrganization() {
    this.router.navigate(['/organization/']);
  }
  public OnChallengerHome() {
    this.router.navigate(['/organization/dashboard']);
  }
  public OnChallengerChallenges() {
    this.router.navigate(['/owner/challenges/',this.currentUser.CurrentUserValue.UserRegistrationData.Username+'_ongoing']);
  }
  public OnChallengerAccountSettings() {
    if (this.currentUser.CurrentUserValue instanceof ChallengeUser) {
      this.challUser = this.currentUser.CurrentUserValue;
      const accountDialogRef = this.dialog.open(ChallengeOwnerAccountEditComponent, {
        data: this.challUser
      });
    }
  }
  public OnChallengerLogout() {
    this.currentUser.Logout();
    this.router.navigate(['/']);
  }

  public OnParticipantProfile() {
    this.router.navigate(['/profile/', this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
  }
  public OnParticipantTeams() {
    this.router.navigate(['/teams/']);
  }
  public OnParticipantHome() {
    this.router.navigate(['/participant/dashboard']);
  }
  public OnParticipantContests() {
    this.router.navigate(['/participant/contests/',this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
  }
  public OnParticipantContracts() {
    this.router.navigate(['/participant/contracts/',this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
  }
  public OnParticipantGetSubmissions() {
    this.router.navigate(['/participant/submissions/',this.currentUser.CurrentUserValue.UserRegistrationData.Username]);
  }
  public OnParticipantAccountSettings() {
    if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
      this.partUser = this.currentUser.CurrentUserValue;
      const accountDialogRef = this.dialog.open(ParticipantAccountEditComponent, {
        data: this.partUser
      });      
    }
  }
  public OnParticipantLogout() {
    this.currentUser.Logout();
    this.router.navigate(['/']);
  }

  public OnLogin() {
    let loginDialogRef = this.dialog.open(LoginComponent);
  }
  public OnRegister() {
    let signupDialogRef = this.dialog.open(SignupComponent);
  }
  public OnHome() {
    this.router.navigate(['/']);
  }
  public OnReport() {
    let reportRef = this.dialog.open(ReportComponent);
  }
}