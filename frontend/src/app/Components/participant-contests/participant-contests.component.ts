import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { first } from 'rxjs/operators';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { MatSnackBar, MatTabGroup, MatPaginator } from '@angular/material';
import { IContest } from 'src/Helpers/Challenge/Interfaces/IContest';
import { SelectedTab } from 'src/app/Components/participant-challenges/SelectedTab';
import { IContract } from 'src/Helpers/Challenge/Interfaces/IContract';

@Component({
  selector: 'app-participant-contests',
  templateUrl: './participant-contests.component.html',
  styleUrls: ['./participant-contests.component.css']
})
export class ParticipantContestsComponent implements OnInit {

  // Search
  public searchForm: FormGroup;
  public currentTabIndex: SelectedTab = 0;
  // Filters
  public filterForm: FormGroup;
  public concentrations: string[];
  // Contest Tab
  public allFollowedContests: IContest[];
  public pageFollowedContests: IContest[];
  public allRegisteredContests: IContest[];
  public pageRegisteredContests: IContest[];
  public allCompletedContests: IContest[];
  public pageCompletedContests: IContest[];
  public selectedContest: Contest;
  // Paginators
  public pageIndex: number;
  public length: number;
  public pageSize1 = 10;
  public pageSize2 = 10;
  public pageSize3 = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage1 = 0;
  public currentPage2 = 0;
  public currentPage3 = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Tabs
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public username: string;
  public header: string = "";
  public submitted: boolean;
  public user: ParticipantUser;
  public dataLoaded1: boolean = false;
  public dataLoaded2: boolean = false;
  public dataLoaded3: boolean = false;

  public loaded1: boolean;
  public loaded2: boolean;
  public loaded3: boolean;

  constructor(
    public activeRoute: ActivatedRoute,
    public fb: FormBuilder,
    public router: Router,
    public usersService: UsersService, 
    public challengesService: ChallengesService,
    public snackBar: MatSnackBar,
    public currentUser: CurrentUserService
  ) 
  {
    this.currentUser.UserLocation = "/search";
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if ((this.currentUser.CurrentUserValue instanceof ParticipantUser) && (this.currentUser.CurrentUserValue.UserRegistrationData.Username==this.router.url.split("/")[3])) {
        this.username = this.router.url.split("/")[3];

        this.filterForm = this.fb.group({
          start: [''],
          close: [''],
          award: this.fb.group({
            min: [''],
            max: [''] }),
          concentrationOne: [''],
          concentrationTwo: [''],
          concentrationThree: ['']
        });

        this.searchForm = this.fb.group({
          search: ['']
        });

        this.usersService.GetByParticipantUsername(this.username).subscribe(
          data => {
            this.user = <ParticipantUser>data;
            this.header = "Your Contests:";
            
          },
          error => {
            this.snackBar.open("No user found for this URL.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
            this.router.navigate(['/']);
          },
          () => this.usersService.GetData().subscribe(
            data => {
              this.concentrations = data['concentrations'];
              // Populates the lists initially
              this.followedContestIterator();
              this.registeredContestIterator();
              this.completedContestIterator();
            },
            error => {
              
            }
          )
        );
      } else {
        this.snackBar.open("You cannot access this page.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
        this.router.navigate(['/']);
      }
    });
  }

  public OnSearchSubmit() {
    if (this.currentTabIndex == 0) {
      this.followedContestIterator(
        this.searchForm.get('search').value,
        this.filterForm.get('start').value,
        this.filterForm.get('close').value,
        this.filterForm.get('award.min').value,
        this.filterForm.get('award.max').value,
        [
          this.filterForm.get('concentrationOne').value,
          this.filterForm.get('concentrationTwo').value,
          this.filterForm.get('concentrationThree').value,
        ]);
    } 
    
    else if (this.currentTabIndex == 1) {
      this.registeredContestIterator(
        this.searchForm.get('search').value,
        this.filterForm.get('start').value,
        this.filterForm.get('close').value,
        this.filterForm.get('award.min').value,
        this.filterForm.get('award.max').value,
        [
          this.filterForm.get('concentrationOne').value,
          this.filterForm.get('concentrationTwo').value,
          this.filterForm.get('concentrationThree').value,
        ]);
    }
    else if (this.currentTabIndex == 2) {
      this.completedContestIterator(
        this.searchForm.get('search').value,
        this.filterForm.get('start').value,
        this.filterForm.get('close').value,
        this.filterForm.get('award.min').value,
        this.filterForm.get('award.max').value,
        [
          this.filterForm.get('concentrationOne').value,
          this.filterForm.get('concentrationTwo').value,
          this.filterForm.get('concentrationThree').value,
        ]);
    }
  }

  public TabChanged(event) {
    this.currentTabIndex = event.index;
    this.OnSearchSubmit();
  }

  public onSelect(item: any) {
    this.router.navigate(["/contest/",item.ContestData.Id]);
  }

  public GetFollowedContests(event: any) {
    this.currentPage1 = event.pageIndex;
    this.pageSize1 = event.pageSize;
    this.followedContestIterator();
  }

  public GetRegisteredContests(event: any) {
    this.currentPage2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.registeredContestIterator();
  }

  public GetCompletedContests(event: any) {
    this.currentPage3 = event.pageIndex;
    this.pageSize3 = event.pageSize;
    this.completedContestIterator();
  }

  public followedContestIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end1 = (this.currentPage1 + 1) * this.pageSize1;
    const start1 = this.currentPage1 * this.pageSize1;

    this.loaded1 = false;
    this.challengesService.SearchContests(query,undefined,undefined,false,undefined,this.username,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allFollowedContests = data;
        this.dataLoaded1 = true;
        this.loaded1 = true;
        const part1 = data.slice(start1,end1);
        this.pageFollowedContests = part1;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public registeredContestIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end2 = (this.currentPage2 + 1) * this.pageSize2;
    const start2 = this.currentPage1 * this.pageSize2;

    this.loaded2 = false;
    this.challengesService.SearchContests(query,undefined,true,undefined,undefined,this.username,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allRegisteredContests = data;
        this.dataLoaded2 = true;
        this.loaded2 = true;
        const part2 = data.slice(start2,end2);
        this.pageRegisteredContests = part2;
      }, 
      error => {
        this.dataLoaded2 = true;
        this.loaded2 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public completedContestIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end3 = (this.currentPage3 + 1) * this.pageSize3;
    const start3 = this.currentPage3 * this.pageSize3;

    this.loaded3 = false;
    this.challengesService.SearchContests(query,undefined,undefined,true,undefined,this.username,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allCompletedContests = data;
        this.dataLoaded3 = true;
        this.loaded3 = true;
        const part3 = data.slice(start3,end3);
        this.pageCompletedContests = part3;
      }, 
      error => {
        this.dataLoaded3 = true;
        this.loaded3 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnResetFilters() {
    this.filterForm.reset();
    this.OnSearchSubmit();
  }
}
