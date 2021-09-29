import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Router } from '@angular/router';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { MatSnackBar } from '@angular/material';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-participant-dashboard',
  templateUrl: './participant-dashboard.component.html',
  styleUrls: ['./participant-dashboard.component.css']
})
export class ParticipantDashboardComponent implements OnInit {

  public openChallengesData;
  public completeChallengesData;

  public openChallengesOptions = {
    legend: { position: 'bottom', alignment: 'center' },
    backgroundColor: { fill:'transparent' }
  };
  
  public completeChallengesOptions = {
    legend: { position: 'bottom', alignment: 'center' },
    backgroundColor: { fill:'transparent' }
  };

   public earningsData = [
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

   public earningsOptions = {   
      hAxis: {
      },
      vAxis:{
         title: 'Your Earnings (USD)',
         textStyle:{italic: false}
      },
    pointSize:10,
    legend: 'none',
    backgroundColor: { fill:'transparent' }
   };

  public user: ParticipantUser;

  public contests: Contest[] = [];
  public contracts: Contract[] = [];
  public contestsComplete: Contest[] = [];
  public contractsComplete: Contract[] = [];

  public dataLoaded: boolean = false;
  
  constructor(
    public router: Router,
    public currentUser: CurrentUserService,
    public snackBar: MatSnackBar,
    public challengesService: ChallengesService,
    public usersService: UsersService
  ) { 
    this.currentUser.UserLocation = "/dashboard";
  }

  ngOnInit() {
    if(this.currentUser.CurrentUserValue instanceof ParticipantUser) {
      this.user = this.currentUser.CurrentUserValue;
      this.challengesService.GetCompletedChallengesByFollower(this.user.UserId).subscribe(
        data => {
          this.contestsComplete = data['contests'];
          this.contractsComplete = data['contracts'];
          this.completeChallengesData = [['Contests', data['contests'].length], ['Contracts', data['contracts'].length]];
        },
        error => {
          this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          this.router.navigate(['/']);
        },
        () => this.challengesService.GetChallengesByFollower(this.user.UserId).subscribe(
          data => {
            this.contests = data['contests'];
            this.contracts = data['contracts'];
            this.openChallengesData = [['Contests', data['contests'].length], ['Contracts', data['contracts'].length]];
            this.dataLoaded = true;
          },
          error => {
            this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            this.router.navigate(['/']);
          }
        )
      );
    } 
    
    else {
      this.router.navigate(['/']);
    }
  }

  public OnSeeChallenges() {
    this.router.navigate(['/participant/challenges/',this.user.UserRegistrationData.Username+'_following']);
  }
  
  public OnSeeCompletedChallenges() {
    this.router.navigate(['/participant/challenges/',this.user.UserRegistrationData.Username+'_completed']);
  }

}
