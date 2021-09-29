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
  selector: 'app-participant-contracts',
  templateUrl: './participant-contracts.component.html',
  styleUrls: ['./participant-contracts.component.css']
})
export class ParticipantContractsComponent implements OnInit {
  // Search
  public searchForm: FormGroup;
  public currentTabIndex: SelectedTab = 0;
  // Filters
  public filterForm: FormGroup;
  public concentrations: string[];
  // Contract Tab
  public allCompletedContracts: IContract[];
  public pageCompletedContracts: IContract[];
  public allFollowedContracts: IContract[];
  public pageFollowedContracts: IContract[];
  public selectedContract: Contract;
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
  public header: string = "";
  public user: ParticipantUser;
  public dataLoaded1: boolean = false;
  public dataLoaded2: boolean = false;

  public loaded1: boolean;
  public loaded2: boolean;

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
            this.header = "Your Contracts:";
          },
          error => {
            this.snackBar.open("No user found for this URL.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
            this.router.navigate(['/']);
          },
          () => this.usersService.GetData().subscribe(
            data => {
              this.concentrations = data['concentrations'];
              // Populates the lists initially
              this.contractFollowedIterator();
              this.contractCompletedIterator();
            },
            error => {}
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
      this.contractFollowedIterator(
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
      this.contractCompletedIterator(
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
    this.router.navigate(["/contract/",item.ContractData.Id]);
  }

  public GetFollowedContracts(event: any) {
    this.currentPage1 = event.pageIndex;
    this.pageSize1 = event.pageSize;
    this.contractFollowedIterator();
  }

  public GetCompletedContracts(event: any) {
    this.currentPage2 = event.pageIndex;
    this.pageSize2 = event.pageSize;
    this.contractCompletedIterator();
  }
  public contractFollowedIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end1 = (this.currentPage1 + 1) * this.pageSize1;
    const start1 = this.currentPage1 * this.pageSize1;

    this.loaded1 = false;
    this.challengesService.SearchContracts(query,undefined,false,undefined,this.username,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allFollowedContracts = data;
        this.dataLoaded1 = true;
        this.loaded1 = true;
        const part1 = data.slice(start1,end1);
        this.pageFollowedContracts = part1;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public contractCompletedIterator(query?: string, startDate?: Date, endDate?: Date, minPrize?: number, maxPrize?: number, concentrations?:string[]) {
    const end2 = (this.currentPage2 + 1) * this.pageSize2;
    const start2 = this.currentPage2 * this.pageSize2;

    this.loaded2 = false;
    this.challengesService.SearchContracts(query,undefined,true,undefined,this.username,minPrize,maxPrize,startDate,endDate,concentrations).subscribe(
      data => {
        this.allCompletedContracts = data;
        this.dataLoaded2 = true;
        this.loaded2 = true;
        const part2 = data.slice(start2,end2);
        this.pageCompletedContracts = part2;
      }, 
      error => {
        this.dataLoaded1 = true;
        this.loaded1 = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnResetFilters() {
    this.filterForm.reset();
    this.OnSearchSubmit();
  }
}
