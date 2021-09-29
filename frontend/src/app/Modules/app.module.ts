// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// COMPONENETS
import { AppComponent } from '../Components/app/app.component';
import { LoginComponent } from '../Components/login/login.component';
import { SignupComponent } from '../Components/signup/signup.component';
import { ParticipantRegistrationComponent } from '../Components/participant-registration/participant-registration.component';
import { ChallengerRegistrationComponent } from '../Components/challenger-registration/challenger-registration.component';
import { ChallengeOwnerProfileComponent } from '../Components/challenge-owner-profile/challenge-owner-profile.component';
import { ParticipantProfileComponent } from '../Components/participant-profile/participant-profile.component';
import { ChallengeOwnerChallengesComponent } from '../Components/challenge-owner-challenges/challenge-owner-challenges.component';
import { ParticipantChallengesComponent } from '../Components/participant-challenges/participant-challenges.component';
import { ImageUploaderComponent } from '../Components/image-uploader/image-uploader.component';
import { ChallengeCreateFormComponent } from '../Components/challenge-create-form/challenge-create-form.component';
import { LandingComponent } from '../Components/landing/landing.component';
import { SearchComponent } from '../Components/search/search.component';
import { LandingSearchComponent } from '../Components/landing-search/landing-search.component';
import { ContractProfileComponent } from '../Components/contract-profile/contract-profile.component';
import { ContractProfileEditComponent } from '../Components/contract-profile-edit/contract-profile-edit.component';
import { ContractProfileAboutEditComponent } from '../Components/contract-profile-about-edit/contract-profile-about-edit.component';
import { ContractProfileSponsorEditComponent } from '../Components/contract-profile-sponsor-edit/contract-profile-sponsor-edit.component';
import { ContestAwardSubmissionFormComponent } from '../Components/contest-award-submission-form/contest-award-submission-form.component';
import { ContestProfileComponent } from '../Components/contest-profile/contest-profile.component';
import { ContestProfileEditComponent } from '../Components/contest-profile-edit/contest-profile-edit.component';
import { ContestProfileAboutEditComponent } from '../Components/contest-profile-about-edit/contest-profile-about-edit.component';
import { ContestProfileSponsorEditComponent } from '../Components/contest-profile-sponsor-edit/contest-profile-sponsor-edit.component';
import { ChallengeOwnerProfileEditComponent } from '../Components/challenge-owner-profile-edit/challenge-owner-profile-edit.component';
import { ParticipantProfileEditComponent } from '../Components/participant-profile-edit/participant-profile-edit.component';
import { ChallengeOwnerProfileAboutEditComponent } from '../Components/challenge-owner-profile-about-edit/challenge-owner-profile-about-edit.component';
import { ChallengeOwnerAccountEditComponent } from '../Components/challenge-owner-account-edit/challenge-owner-account-edit.component';
import { ParticipantProfileAboutEditComponent } from '../Components/participant-profile-about-edit/participant-profile-about-edit.component';
import { ParticipantAccountEditComponent } from '../Components/participant-account-edit/participant-account-edit.component';
import { ChallengeOwnerDashboardComponent } from '../Components/challenge-owner-dashboard/challenge-owner-dashboard.component';
import { ParticipantDashboardComponent } from '../Components/participant-dashboard/participant-dashboard.component';
import { OrganizationComponent } from '../Components/organization/organization.component';
import { TeamsComponent } from '../Components/teams/teams.component';
import { SubmitComponent } from '../Components/submit/submit.component';
import { ChallengeOwnerCreateDepartmentFormComponent } from '../Components/challenge-owner-create-department-form/challenge-owner-create-department-form.component';
import { OrganizationEditFormComponent } from '../Components/organization-edit-form/organization-edit-form.component';
import { ConfirmDeleteFormComponent } from '../Components/confirm-delete-form/confirm-delete-form.component';
import { ReportComponent } from '../Components/report/report.component';
import { ContestWinnerSelectionComponent } from '../Components/contest-winner-selection/contest-winner-selection.component';
import { ContractTeamSelectionComponent } from '../Components/contract-team-selection/contract-team-selection.component';
import { ContestSubmissionProfileComponent } from '../Components/contest-submission-profile/contest-submission-profile.component';
import { ContractApplicationProfileComponent } from '../Components/contract-application-profile/contract-application-profile.component';
import { ContractAwardSubmissionFormComponent } from '../Components/contract-award-submission-form/contract-award-submission-form.component';
import { ContractApplicationProfileEditComponent } from '../Components/contract-application-profile-edit/contract-application-profile-edit.component';
import { ContestSubmissionProfileEditComponent } from '../Components/contest-submission-profile-edit/contest-submission-profile-edit.component';
import { ParticipantSubmissionsComponent } from '../Components/participant-submissions/participant-submissions.component';
import { NoWinnersNoticeComponent } from '../Components/no-winners-notice/no-winners-notice.component';
import { ParticipantContestsComponent } from '../Components/participant-contests/participant-contests.component';
import { ParticipantContractsComponent } from '../Components/participant-contracts/participant-contracts.component';
import { TeamCreationComponent } from '../Components/team-creation/team-creation.component';
import { TeamEditComponent } from '../Components/team-edit/team-edit.component';

// MODULES
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { QuillModule } from 'ngx-quill';


// SERVICES
import { JwtInterceptor } from 'src/app/Services/Interceptors/jwt.interceptor';
import { ErrorInterceptor } from 'src/app/Services/Interceptors/error.interceptor';
import { UsersService } from '../Services/Users/users.service';
import { CurrentUserService } from '../Services/CurrentUser/current-user.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ParticipantRegistrationComponent,
    ChallengerRegistrationComponent,
    ChallengeOwnerProfileComponent,
    ChallengeOwnerChallengesComponent,
    ChallengeOwnerCreateDepartmentFormComponent,
    ChallengeOwnerDashboardComponent,
    ChallengeOwnerAccountEditComponent,
    ChallengeOwnerProfileAboutEditComponent,
    ConfirmDeleteFormComponent,
    ContestAwardSubmissionFormComponent,
    ContestProfileComponent,
    ContestProfileEditComponent,
    ContestProfileAboutEditComponent,
    ContestProfileSponsorEditComponent,
    ContestWinnerSelectionComponent,
    ContestSubmissionProfileComponent,
    ContestSubmissionProfileEditComponent,
    ContractApplicationProfileComponent,
    ContractApplicationProfileEditComponent,
    ContractAwardSubmissionFormComponent,
    ContractProfileComponent,
    ContractProfileEditComponent,
    ContractProfileAboutEditComponent,
    ContractProfileSponsorEditComponent,
    ContractTeamSelectionComponent,
    ImageUploaderComponent,
    NoWinnersNoticeComponent,
    OrganizationComponent,
    OrganizationEditFormComponent,
    ParticipantProfileComponent,
    ParticipantProfileAboutEditComponent,
    ParticipantContestsComponent,
    ParticipantContractsComponent,
    ParticipantChallengesComponent,
    ParticipantDashboardComponent,
    ParticipantAccountEditComponent,
    ChallengeCreateFormComponent,
    LandingComponent,
    SearchComponent,
    LandingSearchComponent,
    ChallengeOwnerProfileEditComponent,
    ParticipantProfileEditComponent,
    ParticipantSubmissionsComponent,
    TeamsComponent,
    TeamCreationComponent,
    TeamEditComponent,
    SubmitComponent, 
    ReportComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ImageCropperModule,
    MatFileUploadModule,
    FormsModule,
    GoogleChartsModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    QuillModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },   
    CurrentUserService,
    UsersService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }