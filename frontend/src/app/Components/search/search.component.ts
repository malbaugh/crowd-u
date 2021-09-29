import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map, first } from 'rxjs/operators';
import { _filter } from 'src/Data/Information/Filter';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { MatPaginator, MatTabGroup, MatSnackBar } from '@angular/material';
import { IContest } from 'src/Helpers/Challenge/Interfaces/IContest';
import { IContract } from 'src/Helpers/Challenge/Interfaces/IContract';
import { IChallengeUser } from 'src/Helpers/Users/Interfaces/IChallengeUser';
import { IParticipantUser } from 'src/Helpers/Users/Interfaces/IParticipantUser';
import { SelectedTab } from './SelectedTab';
import { ENSTATUSES } from 'src/Data/Information/EnrollmentStatus';
import { EDSTATUSES } from 'src/Data/Information/EducationStatus';
import { TRAVEL } from 'src/Data/Information/TravelAvailability';
import { UsersService } from 'src/app/Services/Users/users.service';
import { AutocompleteGroup } from 'src/Data/Information/AutocompleteGroups';
import { STATES } from 'src/Data/Information/States';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  // Search
  public searchForm: FormGroup;
  public currentTabIndex: SelectedTab = 0;

  // Filters
  public filterForm: FormGroup;
  public industries: string[];
  public concentrations: string[];
  public majors: string[];
  public universities: string[];
  public statuses = ENSTATUSES;
  public edStatuses = EDSTATUSES;
  public availabilities = TRAVEL;
  public states = STATES;
  // Contest Tab
  public allContests: IContest[];
  public pageContests: IContest[];
  public selectedContest: Contest;
  // Contract Tab
  public allContracts: IContract[];
  public pageContracts: IContract[];
  public selectedContract: Contract;
  // Organization Tab
  public allChallengers: IChallengeUser[];
  public pageChallengers: IChallengeUser[];
  public selectedChallenger: ChallengeUser;
  // Student Tab
  public allUsers: IParticipantUser[];
  public pageUsers: IParticipantUser[];
  public selectedUser: ParticipantUser;
  // Paginators
  public pageIndex: number;
  public length: number;
  public pageSize1 = 10;
  public pageSize2 = 10;
  public pageSize3 = 10;
  public pageSize4 = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage1 = 0;
  public currentPage2 = 0;
  public currentPage3 = 0;
  public currentPage4 = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Tabs
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  public dataLoaded1: boolean = false;
  public dataLoaded2: boolean = false;
  public dataLoaded3: boolean = false;
  public dataLoaded4: boolean = false;

  public loaded1: boolean;
  public loaded2: boolean;
  public loaded3: boolean;
  public loaded4: boolean;

  constructor(
    public route: ActivatedRoute,
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
    this.filterForm = this.fb.group({
      start: [''],
      close: [''],
      award: this.fb.group({
        min: [''],
        max: [''] }),
      major: [''],
      educationStatus: [''],
      travelAvailability: [''],
      university: [''],
      industry: [''],
      city: [''],
      state: [''],
      concentrationOne: [''],
      concentrationTwo: [''],
      concentrationThree: ['']
    });

    this.searchForm = this.fb.group({
      search: ['']
    });

    this.usersService.GetData().subscribe(
      data => {
        this.concentrations = data['concentrations'];
        this.industries = data['industries'];
        this.universities = data['universities'];
        this.majors = data['majors'];
        if (this.currentUser.UserSearch != null) {
          // Populates the lists initially
          this.contestIterator(this.currentUser.UserSearch);
          this.contractIterator(this.currentUser.UserSearch);
          this.organizationIterator(this.currentUser.UserSearch);
          this.studentIterator(this.currentUser.UserSearch);
          this.searchForm.get('search').setValue(this.currentUser.UserSearch);
          this.currentUser.UserSearch = null;
        } else {
          // Populates the lists initially
          this.contestIterator();
          this.contractIterator();
          this.organizationIterator();
          this.studentIterator();
        }
        
      },
      error => {
        
      }
    )
  }

  public OnSearchSubmit() {
    if (this.currentTabIndex == 0) {
      this.contestIterator(
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
      this.contractIterator(
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
      this.studentIterator(
        this.searchForm.get('search').value,
        this.filterForm.get('major').value,
        this.filterForm.get('educationStatus').value,
        this.filterForm.get('travelAvailability').value,
        this.filterForm.get('university').value,
        this.filterForm.get('city').value,
        this.filterForm.get('state').value,
        [
          this.filterForm.get('concentrationOne').value,
          this.filterForm.get('concentrationTwo').value,
          this.filterForm.get('concentrationThree').value,
        ]);
    }

    else if (this.currentTabIndex == 3) {
      this.organizationIterator(
        this.searchForm.get('search').value,
        this.filterForm.get('industry').value,
        this.filterForm.get('city').value,
        this.filterForm.get('state').value,
      );
    }
  }


  public TabChanged(event) {
    this.currentTabIndex = event.index;
    this.OnSearchSubmit();
  }

  public onSelect(item: any) {
    if (item instanceof ParticipantUser) {
      this.router.navigate(["/profile/",item.UserRegistrationData.Username]);
    }
    
    else if (item instanceof ChallengeUser) {
      this.router.navigate(["/profile/org/",item.UserRegistrationData.Username]);
    }
    
    else if (item instanceof Contest) {
      this.router.navigate(["/contest/",item.ContestData.Id]);
    }
    
    else if (item instanceof Contract) {
      this.router.navigate(["/contract/",item.ContractData.Id]);
    }
  }

  public GetContests(event: any) {
    this.currentPage1 = event.pageIndex;
    this.pageSize1 = event.pageSize;
    this.contestIterator();
  }

  public GetContracts(event: any) {
    this.currentPage2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.contractIterator();
  }

  public GetStudents(event: any) {
    this.currentPage3 = event.pageIndex;
    this.pageSize3 = event.pageSize;
    this.studentIterator();
  }

  public GetOrganizations(event: any) {
    this.currentPage4 = event.pageIndex;
    this.pageSize4 = event.pageSize;
    this.organizationIterator();
  }

  public contestIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end1 = (this.currentPage1 + 1) * this.pageSize1;
    const start1 = this.currentPage1 * this.pageSize1;

    this.loaded1 = false;
    this.challengesService.SearchContests(query,false,undefined,undefined,undefined,undefined,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allContests = data;
        this.dataLoaded1 = true;
        this.loaded1 = true;
        const part1 = data.slice(start1,end1);
        this.pageContests = part1;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public contractIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end2 = (this.currentPage2 + 1) * this.pageSize2;
    const start2 = this.currentPage2 * this.pageSize2;

    this.loaded2 = false;
    this.challengesService.SearchContracts(query,false,undefined,undefined,undefined,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allContracts = data;
        this.dataLoaded2 = true;
        this.loaded2 = true;
        const part2 = data.slice(start2,end2);
        this.pageContracts = part2;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public studentIterator(query?: string,major?:string,educationStatus?:string,travelAvailability?:string,university?:string,city?:string,state?:string,concentrations?:string[]) {
    const end3 = (this.currentPage3 + 1) * this.pageSize3;
    const start3 = this.currentPage3 * this.pageSize3;

    this.loaded3 = false;
    this.usersService.SearchParticipantUsers(query,major,educationStatus,travelAvailability,university,city,state,concentrations).subscribe(
      data => {
        this.allUsers = data;
        this.dataLoaded3 = true;
        this.loaded3 = true;
        const part3 = data.slice(start3,end3);
        this.pageUsers = part3;
      },
      error => {
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        this.dataLoaded3 = true;
        this.loaded3 = true;
      });
  }

  public organizationIterator(query?:string, industry?:string, city?:string, state?:string) {
    const end4 = (this.currentPage4 + 1) * this.pageSize4;
    const start4 = this.currentPage4 * this.pageSize4;

    this.loaded4 = false;
    this.usersService.SearchChallengeUsers(query,industry,city,state).subscribe(
      data => {
        this.allChallengers = data;
        this.dataLoaded4 = true;
        this.loaded4 = true;
        const part4 = data.slice(start4,end4);
        this.pageChallengers = part4;
      },
      error => {
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        this.dataLoaded4 = true;
        this.loaded4 = true;
      });
  }

  public OnSeeChallenges(challenger: ChallengeUser) {
    this.router.navigate(['/owner/challenges/',challenger.ChallengerRegistrationData.Username+'_ongoing']);
  }

  public OnResetFilters() {
    this.filterForm.reset();
    this.OnSearchSubmit();
  }
}
