import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../Components/login/login.component';
import { SignupComponent } from '../Components/signup/signup.component';
import { ParticipantRegistrationComponent } from '../Components/participant-registration/participant-registration.component';
import { ParticipantProfileComponent } from '../Components/participant-profile/participant-profile.component';
import { ChallengeOwnerProfileComponent } from '../Components/challenge-owner-profile/challenge-owner-profile.component';
import { ChallengerRegistrationComponent } from '../Components/challenger-registration/challenger-registration.component';
import { ChallengeOwnerCreateDepartmentFormComponent } from '../Components/challenge-owner-create-department-form/challenge-owner-create-department-form.component';
import { ContestProfileComponent } from '../Components/contest-profile/contest-profile.component';
import { ContractProfileComponent } from '../Components/contract-profile/contract-profile.component';
import { LandingComponent } from '../Components/landing/landing.component';
import { SearchComponent } from '../Components/search/search.component';
import { ParticipantProfileEditComponent } from '../Components/participant-profile-edit/participant-profile-edit.component';
import { ChallengeOwnerProfileEditComponent } from '../Components/challenge-owner-profile-edit/challenge-owner-profile-edit.component';
import { ChallengeOwnerProfileAboutEditComponent } from '../Components/challenge-owner-profile-about-edit/challenge-owner-profile-about-edit.component';
import { ChallengeOwnerAccountEditComponent } from '../Components/challenge-owner-account-edit/challenge-owner-account-edit.component';
import { ParticipantProfileAboutEditComponent } from '../Components/participant-profile-about-edit/participant-profile-about-edit.component';
import { ParticipantAccountEditComponent } from '../Components/participant-account-edit/participant-account-edit.component';
import { ChallengeCreateFormComponent } from '../Components/challenge-create-form/challenge-create-form.component';
import { ContestProfileEditComponent } from '../Components/contest-profile-edit/contest-profile-edit.component';
import { ContestProfileAboutEditComponent } from '../Components/contest-profile-about-edit/contest-profile-about-edit.component';
import { ContestProfileSponsorEditComponent } from '../Components/contest-profile-sponsor-edit/contest-profile-sponsor-edit.component';
import { ContestWinnerSelectionComponent } from '../Components/contest-winner-selection/contest-winner-selection.component';
import { ContractTeamSelectionComponent } from '../Components/contract-team-selection/contract-team-selection.component';
import { ContractProfileEditComponent } from '../Components/contract-profile-edit/contract-profile-edit.component';
import { ContractProfileAboutEditComponent } from '../Components/contract-profile-about-edit/contract-profile-about-edit.component';
import { ContractProfileSponsorEditComponent } from '../Components/contract-profile-sponsor-edit/contract-profile-sponsor-edit.component';
import { ChallengeOwnerDashboardComponent } from '../Components/challenge-owner-dashboard/challenge-owner-dashboard.component';
import { ParticipantDashboardComponent } from '../Components/participant-dashboard/participant-dashboard.component';
import { ChallengeOwnerChallengesComponent } from '../Components/challenge-owner-challenges/challenge-owner-challenges.component';
import { ParticipantChallengesComponent } from '../Components/participant-challenges/participant-challenges.component';
import { ImageUploaderComponent } from '../Components/image-uploader/image-uploader.component';
import { OrganizationComponent } from '../Components/organization/organization.component';
import { TeamsComponent } from '../Components/teams/teams.component';
import { SubmitComponent } from '../Components/submit/submit.component';
import { OrganizationEditFormComponent } from '../Components/organization-edit-form/organization-edit-form.component';
import { ConfirmDeleteFormComponent } from '../Components/confirm-delete-form/confirm-delete-form.component';
import { ReportComponent } from '../Components/report/report.component';
import { ContestAwardSubmissionFormComponent } from '../Components/contest-award-submission-form/contest-award-submission-form.component';
import { ContestSubmissionProfileComponent } from '../Components/contest-submission-profile/contest-submission-profile.component';
import { ContractApplicationProfileComponent } from '../Components/contract-application-profile/contract-application-profile.component';
import { ContractAwardSubmissionFormComponent } from '../Components/contract-award-submission-form/contract-award-submission-form.component';
import { ContractApplicationProfileEditComponent } from '../Components/contract-application-profile-edit/contract-application-profile-edit.component';
import { ContestSubmissionProfileEditComponent } from '../Components/contest-submission-profile-edit/contest-submission-profile-edit.component';
import { ParticipantSubmissionsComponent } from '../Components/participant-submissions/participant-submissions.component';
import { NoWinnersNoticeComponent } from '../Components/no-winners-notice/no-winners-notice.component';
import { ParticipantContractsComponent } from '../Components/participant-contracts/participant-contracts.component';
import { ParticipantContestsComponent } from '../Components/participant-contests/participant-contests.component';
import { TeamEditComponent } from '../Components/team-edit/team-edit.component';
import { TeamCreationComponent } from '../Components/team-creation/team-creation.component';

const routes: Routes = [ 
  
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'signup', component: SignupComponent },
  { path: 'participant-registration', component: ParticipantRegistrationComponent },
  { path: 'participant-registration/:id', component: ParticipantRegistrationComponent },
  { path: 'challenger-registration', component: ChallengerRegistrationComponent },
  { path: 'upload-image', component: ImageUploaderComponent },
  { path: 'submit', component: SubmitComponent },
  { path: 'no-winners', component: NoWinnersNoticeComponent },
  
  { path: 'profile/org/:id', component: ChallengeOwnerProfileComponent },
  { path: 'owner/challenges/:id', component: ChallengeOwnerChallengesComponent},
  { path: 'profile/org/:id/challenge-creation', component: ChallengeCreateFormComponent },
  { path: 'profile/org/:id/edit', component: ChallengeOwnerProfileEditComponent },
  { path: 'profile/org/:id/edit/about', component: ChallengeOwnerProfileAboutEditComponent },
  { path: 'profile/org/:id/account', component: ChallengeOwnerAccountEditComponent },
  { path: 'organization/dashboard', component: ChallengeOwnerDashboardComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'organization/create-department', component: ChallengeOwnerCreateDepartmentFormComponent },
  { path: 'organization/edit', component: OrganizationEditFormComponent },
  
  { path: 'profile/:id', component: ParticipantProfileComponent },
  { path: 'participant/challenges/:id', component: ParticipantChallengesComponent },
  { path: 'participant/contests/:id', component: ParticipantContestsComponent },
  { path: 'participant/contracts/:id', component: ParticipantContractsComponent },
  { path: 'participant/submissions/:id', component: ParticipantSubmissionsComponent },
  { path: 'profile/edit/:id', component: ParticipantProfileEditComponent },
  { path: 'profile/edit/:id/about', component: ParticipantProfileAboutEditComponent },
  { path: 'profile/:id/account', component: ParticipantAccountEditComponent },
  { path: 'participant/dashboard', component: ParticipantDashboardComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/create', component: TeamCreationComponent },
  { path: 'teams/edit', component: TeamEditComponent },

  { path: 'contest/:id', component: ContestProfileComponent },
  { path: 'contest/select-winner/:id', component: ContestWinnerSelectionComponent },
  { path: 'contest/award-submission/:id', component: ContestAwardSubmissionFormComponent },
  { path: 'contest/:id/edit', component: ContestProfileEditComponent },
  { path: 'contest/:id/edit/about', component: ContestProfileAboutEditComponent },
  { path: 'contest/:id/edit/sponsor', component: ContestProfileSponsorEditComponent },

  { path: 'contract/:id', component: ContractProfileComponent },
  { path: 'contract/select-team/:id', component: ContractTeamSelectionComponent },
  { path: 'contract/award-submission/:id',component: ContractAwardSubmissionFormComponent },
  { path: 'contract/:id/edit', component: ContractProfileEditComponent },
  { path: 'contract/:id/edit/about', component: ContractProfileAboutEditComponent },
  { path: 'contract/:id/edit/sponsor', component: ContractProfileSponsorEditComponent },

  { path: 'submission/:id', component: ContestSubmissionProfileComponent },
  { path: 'submission/:id/edit', component: ContestSubmissionProfileEditComponent },
  { path: 'application/:id', component: ContractApplicationProfileComponent },
  { path: 'application/:id/edit', component: ContractApplicationProfileEditComponent },

  { path: 'search', component: SearchComponent },
  { path: 'confirm', component: ConfirmDeleteFormComponent },
  { path: 'report', component: ReportComponent },

  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })], 
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
