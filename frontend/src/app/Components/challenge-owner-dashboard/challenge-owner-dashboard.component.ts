import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { ChallengeCreateFormComponent } from '../challenge-create-form/challenge-create-form.component';

@Component({
  selector: 'app-challenge-owner-dashboard',
  templateUrl: './challenge-owner-dashboard.component.html',
  styleUrls: ['./challenge-owner-dashboard.component.css']
})
export class ChallengeOwnerDashboardComponent implements OnInit {

  public openChallengesData;
  public completeChallengesData;

  public openChallengesDataDepartments;
  public completeChallengesDataDepartments;

  public openChallengesOptions = {
    legend: { position: 'bottom', alignment: 'center' },
    backgroundColor: { fill:'transparent' }
  };

  public completeChallengesOptions = {
    legend: { position: 'bottom', alignment: 'center' },
    backgroundColor: { fill:'transparent' }
  };

   public spendingData = [
        ["08/18",  5736],
        ["",  2233],
        ["10/18",  4889],
        ["",  9870],
        ["12/18",  1233],
        ["",  212],
        ["02/19",  4556],
        ["",  11002],
        ["04/19",  30345],
        ["",  9802],
        ["06/19",  3500],
        ["",  2345]
   ];

   public spendingOptions = {   
      hAxis: {
      },
      vAxis:{
         title: 'Your Spending (USD)',
         textStyle:{italic: false}
      },
    pointSize:10,
    legend: 'none',
    backgroundColor: { fill:'transparent' }
   };

  public dContests: Contest[] = [];
  public dContracts: Contract[] = [];
  public dContestsComplete: Contest[] = [];
  public dContractsComplete: Contract[] = [];

  public contests: Contest[] = [];
  public contracts: Contract[] = [];
  public contestsComplete: Contest[] = [];
  public contractsComplete: Contract[] = [];

  public user: ChallengeUser;

  public dataLoaded: boolean = false;
  
  constructor(
    public router: Router,
    public currentUser: CurrentUserService,
    public snackBar: MatSnackBar,
    public challengesService: ChallengesService,
    public usersService: UsersService,
    public dialog: MatDialog
  ) { 
    this.currentUser.UserLocation = "/dashboard";
  }

  ngOnInit() {
    if(this.currentUser.CurrentUserValue instanceof ChallengeUser) {
      this.user = this.currentUser.CurrentUserValue;

      this.challengesService.GetChallengesByOwner(this.user.ChallengerRegistrationData.Username).subscribe(
        data => {
          this.dContests = data['departments_contests'];
          this.dContracts = data['departments_contracts'];
          this.dContestsComplete = data['departments_closed_contests'];
          this.dContractsComplete = data['departments_closed_contracts'];

          this.contests = data['contests'];
          this.contracts = data['contracts'];
          this.contestsComplete = data['closed_contests'];
          this.contractsComplete = data['closed_contracts'];

          this.completeChallengesData = [['Contests', data['closed_contests'].length], ['Contracts', data['closed_contracts'].length]];
          this.openChallengesData = [['Contests', data['contests'].length], ['Contracts', data['contracts'].length]];

          this.completeChallengesDataDepartments = [['Contests', data['departments_closed_contests'].length], ['Contracts', data['departments_closed_contracts'].length]];
          this.openChallengesDataDepartments = [['Contests', data['departments_contests'].length], ['Contracts', data['departments_contracts'].length]];

          this.dataLoaded = true;
        },
        error => {
          this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          this.router.navigate(['/']);
        }
      );
    } else {
      this.router.navigate(['/']);
    }
  }

  public OnSeeChallenges() {
    this.router.navigate(['/owner/challenges/',this.user.UserRegistrationData.Username+'_ongoing']);
  }

  public OnSeeClosedChallenges() {
    this.router.navigate(['/owner/challenges/',this.user.UserRegistrationData.Username+'_closed']);
  }

  public OnCreateChallenge() {
    let challengeDialogForm = this.dialog.open(ChallengeCreateFormComponent);
  }
}
