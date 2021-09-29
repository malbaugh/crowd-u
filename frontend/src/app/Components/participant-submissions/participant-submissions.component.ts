import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatPaginator, MatTabGroup } from '@angular/material';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { SelectedTab } from '../challenge-owner-challenges/SelectedTab';

@Component({
  selector: 'app-participant-submissions',
  templateUrl: './participant-submissions.component.html',
  styleUrls: ['./participant-submissions.component.css']
})
export class ParticipantSubmissionsComponent implements OnInit {

  public currentTabIndex: SelectedTab = 0;
  public allOpenSubmissions: Submission[];
  public pageOpenSubmissions: Submission[];
  public selectedOpenSubmission: Submission;
  // Contract Tab
  public allClosedSubmissions: Submission[];
  public pageClosedSubmissions: Submission[];
  public selectedClosedSubmission: Submission;
  // Paginators
  public pageIndex: number;
  public length: number;
  public pageSize1 = 10;
  public pageSize2 = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage1 = 0;
  public currentPage2 = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Tabs
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public username: string;
  public user: ParticipantUser;
  public dataLoaded1: boolean = false;
  public dataLoaded2: boolean = false;

  public loaded1: boolean;
  public loaded2: boolean;

  constructor(
    public currentUser: CurrentUserService,
    public challengesService: ChallengesService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService
  ) { }

  ngOnInit() {
    if ((this.currentUser.CurrentUserValue instanceof ParticipantUser) && (this.currentUser.CurrentUserValue.UserRegistrationData.Username==this.router.url.split("/")[3])) {
      this.username = this.router.url.split("/")[3];
      this.usersService.GetByParticipantUsername(this.username).subscribe(
        data => {
          this.user = <ParticipantUser>data;
          this.openSubmissionIterator();
          this.closedSubmissionIterator();
        },
        error => {
          this.snackBar.open("No user found for this URL.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
          this.router.navigate(['/']);
        }
      );
    } else {
      this.snackBar.open("You cannot access this page.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
      this.router.navigate(['/']);
    }
  }

  public TabChanged(event) {
    this.currentTabIndex = event.index;
  }

  public GetOpenSubmissions(event: any) {
    this.currentPage1 = event.pageIndex;
    this.pageSize1 = event.pageSize;
    this.openSubmissionIterator();
  }

  public GetClosedSubmissions(event: any) {
    this.currentPage2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.closedSubmissionIterator();
  }

  public openSubmissionIterator() {
    const end1 = (this.currentPage1 + 1) * this.pageSize1;
    const start1 = this.currentPage1 * this.pageSize1;

    this.loaded1 = false;
    this.challengesService.GetParticipantSubmissions(this.user.UserId,false).subscribe(
      data => {
        this.allOpenSubmissions = data;
        this.dataLoaded1 = true;
        this.loaded1 = true;
        const part1 = data.slice(start1,end1);
        this.pageOpenSubmissions = part1;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public closedSubmissionIterator() {
    const end2 = (this.currentPage2 + 1) * this.pageSize2;
    const start2 = this.currentPage2 * this.pageSize2;

    this.loaded2 = false;
    this.challengesService.GetParticipantSubmissions(this.user.UserId,true).subscribe(
      data => {
        this.allClosedSubmissions = data;
        this.dataLoaded2 = true;
        this.loaded2 = true;
        const part2 = data.slice(start2,end2);
        this.pageClosedSubmissions = part2;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnSeeSubmission(submission: Submission) {
    this.router.navigate(['/submission/',submission.Id]);
  }

  public SubmissionType(submission: Submission) {
    if (submission.ChallengeType == 'contest') {
      return 'Contest Submission';
    }
    else {
      return 'Contract Application';
    }
  }
}
