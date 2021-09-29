import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first, startWith, map } from 'rxjs/operators';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contest-profile-edit',
  templateUrl: './contest-profile-edit.component.html',
  styleUrls: ['./contest-profile-edit.component.css']
})
export class ContestProfileEditComponent implements OnInit {

  public headerForm: FormGroup;
  public ngZone: NgZone;
  public concentrations: string[];
  public dataLoaded: boolean = false;
  public user: ChallengeUser;
  public concentrationGroupOptions1: Observable<string[]>;
  public concentrationGroupOptions2: Observable<string[]>;
  public concentrationGroupOptions3: Observable<string[]>;
  public userLimitQuantity: number;
  public limitUsers: boolean = false;
  
  constructor(
    public fb: FormBuilder,
    public editDialogRef: MatDialogRef<ContestProfileEditComponent>,
    public challengesService: ChallengesService,
    public currentUser: CurrentUserService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public contest: Contest
  ) { }

  ngOnInit() {

    if ((this.currentUser.CurrentUserValue instanceof ChallengeUser) && (this.currentUser.CurrentUserValue.ChallengerRegistrationData.Username == this.contest.ContestData.OwnerUsername)) {
      this.user = this.currentUser.CurrentUserValue;
      this.headerForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        concentration: this.fb.group({
          concentration1: ['', [Validators.required]],
          concentration2: [''],
          concentration3: ['']}),
        submitDate: ['', [Validators.required]],
        registerDate: ['', [Validators.required]],
        userLimit: ['']
      });

      this.name.setValue(this.contest.ContestData.Name);
      this.description.setValue(this.contest.ContestData.Description);
      this.submitDate.setValue(this.contest.ContestData.SubmitDate);
      this.registerDate.setValue(this.contest.ContestData.RegisterDate);
      this.concentration1.setValue(this.contest.ContestData.Concentrations[0]);
      this.concentration2.setValue(this.contest.ContestData.Concentrations[1]);
      this.concentration3.setValue(this.contest.ContestData.Concentrations[2]);

      if (this.contest.ContestData.UserLimit == -1) {
        this.limitUsers = false;
      }
      else {
        this.limitUsers = true;
        this.userLimit.setValue(this.contest.ContestData.UserLimit);
      }

      this.concentrationGroupOptions1 = this.headerForm.get('concentration.concentration1')!.valueChanges.pipe(startWith(''),map(value => this._filterConcentrations(value)));
      
      this.concentrationGroupOptions2 = this.headerForm.get('concentration.concentration2')!.valueChanges.pipe(startWith(''),map(value => this._filterConcentrations(value)));

      this.concentrationGroupOptions3 = this.headerForm.get('concentration.concentration3')!.valueChanges.pipe(startWith(''),map(value => this._filterConcentrations(value)));
        
      this.usersService.GetData().subscribe(
        data => {
          this.concentrations = data['concentrations'];
          this.dataLoaded = true;
        },
        error => {
          this.dataLoaded = true;
        }
      );
    } 
    
    else {
      this.snackBar.open("You do not have permission to edit this contest.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
      this.editDialogRef.close();
      this.router.navigate(['/']);
    }
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public _filterConcentrations(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.concentrations.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.concentrations;
  }
  
  public get name() { return this.headerForm.get('name'); }  
  public get description() { return this.headerForm.get('description'); }
  public get submitDate() { return this.headerForm.get('submitDate'); }
  public get registerDate() { return this.headerForm.get('registerDate'); }
  public get concentration1() { return this.headerForm.get('concentration.concentration1'); }
  public get concentration2() { return this.headerForm.get('concentration.concentration2'); }
  public get concentration3() { return this.headerForm.get('concentration.concentration3'); }
  public get userLimit() { return this.headerForm.get('userLimit'); }

  public OnSubmitHeader() {
    if (this.limitUsers) {
      this.contest.ContestData.UserLimit = this.userLimit.value;
    }
    else {
      this.contest.ContestData.UserLimit = -1;
    }

    this.contest.ContestData.Name = this.name.value;
    this.contest.ContestData.Description = this.description.value;
    this.contest.ContestData.SubmitDate = this.submitDate.value;
    this.contest.ContestData.RegisterDate = this.registerDate.value;
    this.contest.ContestData.Concentrations[0] = this.concentration1.value;
    this.contest.ContestData.Concentrations[1] = this.concentration2.value;
    this.contest.ContestData.Concentrations[2] = this.concentration3.value;

    this.dataLoaded = false;
    this.challengesService.UpdateContest(this.contest).subscribe(
      data => {
        
      },
      error => {},
      () => this.usersService.CreateConcentration(this.concentration1.value).subscribe(
        () => this.usersService.CreateConcentration(this.concentration2.value).subscribe(
          () => this.usersService.CreateConcentration(this.concentration3.value).subscribe(
            data => {
              this.dataLoaded = true;
              this.editDialogRef.close(this.contest);
            },
            error => {
              this.dataLoaded = true;
              this.editDialogRef.close(this.contest);
            }
          )
        )
      )
    );
  }

  public OnExit() {
    this.editDialogRef.close();
  }

}
