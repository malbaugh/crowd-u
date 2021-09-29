import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IChallengeCreateData } from 'src/Helpers/ChallengeData/Interfaces/IChallengeCreateData';
import { ChallengeCreateData } from 'src/Helpers/ChallengeData/Classes/ChallengeCreateData';
import { Router, ActivatedRoute } from '@angular/router';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { ContestData } from 'src/Helpers/ChallengeData/Classes/ContestData';
import { ContractData } from 'src/Helpers/ChallengeData/Classes/ContractData';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first, startWith, map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Observable } from 'rxjs';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';

@Component({
  selector: 'app-challenge-create-form',
  templateUrl: './challenge-create-form.component.html',
  styleUrls: ['./challenge-create-form.component.css']
})
export class ChallengeCreateFormComponent implements OnInit {

  public contestCreateForm: FormGroup;
  public contractCreateForm: FormGroup;
  public challengeCreateData: IChallengeCreateData;
  public contractCreateData: IChallengeCreateData;
  public concentrationGroupOptions1: Observable<string[]>;
  public concentrationGroupOptions2: Observable<string[]>;
  public concentrationGroupOptions3: Observable<string[]>;
  public concentrationGroupOptions4: Observable<string[]>;
  public concentrationGroupOptions5: Observable<string[]>;
  public concentrationGroupOptions6: Observable<string[]>;
  public concentrations: string[];
  public ngZone: NgZone;
  public dataLoaded: boolean = false;
  public limitUsers: boolean = false;
  public id: number;
  public currUser: ChallengeUser;
  public userLimitQuantity: number;

  constructor(
    public fb: FormBuilder,
    public challengesService: ChallengesService,
    public route: ActivatedRoute,
    public router: Router,
    public usersService: UsersService,
    public challengeDialogForm: MatDialogRef<ChallengeCreateFormComponent>,
    public currentUser: CurrentUserService,
    public snackBar: MatSnackBar
    ) {}

  @ViewChild('tabs') tabs;

  ngOnInit() {
    this.currUser = this.currentUser.CurrentUserValue;

    this.contestCreateForm = this.fb.group({
      name: ['', [Validators.required]],
      prize: ['', [Validators.required]],
      concentration: this.fb.group({
        concentrationOne: ['', [Validators.required]],
        concentrationTwo: [''],
        concentrationThree: ['']}),
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isConfidential: [''],
      userLimit: ['']
    });

    this.contractCreateForm = this.fb.group({
      name: ['', [Validators.required]],
      prize: ['', [Validators.required]],
      concentration: this.fb.group({
        concentrationOne: ['', [Validators.required]],
        concentrationTwo: [''],
        concentrationThree: ['']}),
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isConfidential: [''],
      userLimit: ['']
    });

    this.concentrationGroupOptions1 = this.contestCreateForm.get('concentration.concentrationOne')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));
    
    this.concentrationGroupOptions2 = this.contestCreateForm.get('concentration.concentrationTwo')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.concentrationGroupOptions3 = this.contestCreateForm.get('concentration.concentrationThree')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.concentrationGroupOptions4 = this.contractCreateForm.get('concentration.concentrationOne')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));
    
    this.concentrationGroupOptions5 = this.contractCreateForm.get('concentration.concentrationTwo')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.concentrationGroupOptions6 = this.contractCreateForm.get('concentration.concentrationThree')!.valueChanges
      .pipe(startWith(''),map(value => this._filterConcentrations(value)));

    this.usersService.GetData()
      .subscribe(
        data => {
          this.concentrations = data['concentrations'];

          this.dataLoaded = true;
        },
        error => {
          this.dataLoaded = true;
        }
      );
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

  public get form1() { return this.contestCreateForm.controls }
  public get form2() { return this.contractCreateForm.controls }

  public get concentrationOne() { return this.contestCreateForm.get('concentration.concentrationOne'); }
  public get concentrationTwo() { return this.contestCreateForm.get('concentration.concentrationTwo'); }
  public get concentrationThree() { return this.contestCreateForm.get('concentration.concentrationThree'); }

  public get concentration1() { return this.contractCreateForm.get('concentration.concentrationOne'); }
  public get concentration2() { return this.contractCreateForm.get('concentration.concentrationTwo'); }
  public get concentration3() { return this.contractCreateForm.get('concentration.concentrationThree'); }

  public OnSubmitContest(event): void {
    if (this.limitUsers) {
      this.userLimitQuantity = this.form1.userLimit.value;
    }
    else {
      this.userLimitQuantity = -1;
    }

    this.challengeCreateData = new ChallengeCreateData(
      this.form1.name.value,
      this.currUser.ChallengeOwnerProfileData.Photo,
      this.form1.description.value,
      "",
      this.form1.prize.value, [
        this.concentrationOne.value,
        this.concentrationTwo.value,
        this.concentrationThree.value],      
      this.form1.startDate.value,
      this.form1.endDate.value,
      (this.form1.isConfidential.value == true),
      this.currUser.UserRegistrationData.Username,
      this.userLimitQuantity
    );
    
    this.dataLoaded = false;
    this.challengesService.CreateContest(new Contest(new ContestData(this.challengeCreateData))).subscribe(
      data => {
        this.id = data;
      },
      error => {},
      () => this.usersService.CreateConcentration(this.concentrationOne.value).subscribe(
        () => this.usersService.CreateConcentration(this.concentrationTwo.value).subscribe(
          () => this.usersService.CreateConcentration(this.concentrationThree.value).subscribe(
            data => {
              this.dataLoaded = true;
              this.router.navigate(['/contest/', this.id]);
              this.challengeDialogForm.close(this.currUser);
            },
            error => {
              this.dataLoaded = true;
              this.router.navigate(['/contest/', this.id]);
              this.challengeDialogForm.close(this.currUser);
            }
          )
        )
      )
    );
  }

  public OnSubmitContract(event): void {
    if (this.limitUsers) {
      this.userLimitQuantity = this.form2.userLimit.value;
    }
    else {
      this.userLimitQuantity = -1;
    }

    this.contractCreateData = new ChallengeCreateData(
      this.form2.name.value,
      this.currUser.ChallengeOwnerProfileData.Photo,
      this.form2.description.value,
      "",
      this.form2.prize.value, [
        this.concentration1.value,
        this.concentration2.value,
        this.concentration3.value],      
      this.form2.startDate.value,
      this.form2.endDate.value,
      (this.form2.isConfidential.value == true),
      this.currUser.UserRegistrationData.Username,
      this.userLimitQuantity
    );

    this.dataLoaded = false;
    this.challengesService.CreateContract(new Contract(new ContractData(this.contractCreateData))).subscribe(
      data => {
        this.id = data;
      },
      error => {},
      () => this.usersService.CreateConcentration(this.concentration1.value).subscribe(
        () => this.usersService.CreateConcentration(this.concentration2.value).subscribe(
          () => this.usersService.CreateConcentration(this.concentration3.value).subscribe(
            data => {
              this.dataLoaded = true;
              this.router.navigate(['/contract/', this.id]);
              this.challengeDialogForm.close(this.currUser);
            },
            error => {
              this.dataLoaded = true;
              this.router.navigate(['/contract/', this.id]);
              this.challengeDialogForm.close(this.currUser);
            }
          )
        )
      )
    );
  }

  public OnExit() {
    this.challengeDialogForm.close();
  }
}
