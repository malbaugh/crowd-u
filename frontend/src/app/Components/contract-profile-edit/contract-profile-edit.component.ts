import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { take, first, startWith, map } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-contract-profile-edit',
  templateUrl: './contract-profile-edit.component.html',
  styleUrls: ['./contract-profile-edit.component.css']
})
export class ContractProfileEditComponent implements OnInit {

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
    public editDialogRef: MatDialogRef<ContractProfileEditComponent>,
    public challengesService: ChallengesService,
    public currentUser: CurrentUserService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public contract: Contract
  ) { }

  ngOnInit() {

    if ((this.currentUser.CurrentUserValue instanceof ChallengeUser) && (this.currentUser.CurrentUserValue.ChallengerRegistrationData.Username == this.contract.ContractData.OwnerUsername)) {
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

      this.name.setValue(this.contract.ContractData.Name);
      this.description.setValue(this.contract.ContractData.Description);
      this.submitDate.setValue(this.contract.ContractData.SubmitDate);
      this.registerDate.setValue(this.contract.ContractData.RegisterDate);
      this.concentration1.setValue(this.contract.ContractData.Concentrations[0]);
      this.concentration2.setValue(this.contract.ContractData.Concentrations[1]);
      this.concentration3.setValue(this.contract.ContractData.Concentrations[2]);

      if (this.contract.ContractData.UserLimit == -1) {
        this.limitUsers = false;
      }
      else {
        this.limitUsers = true;
        this.userLimit.setValue(this.contract.ContractData.UserLimit);
      }

      this.concentrationGroupOptions1 = this.headerForm.get('concentration.concentration1')!.valueChanges
        .pipe(startWith(''),map(value => this._filterConcentrations(value)));
      
      this.concentrationGroupOptions2 = this.headerForm.get('concentration.concentration2')!.valueChanges
        .pipe(startWith(''),map(value => this._filterConcentrations(value)));

      this.concentrationGroupOptions3 = this.headerForm.get('concentration.concentration3')!.valueChanges
        .pipe(startWith(''),map(value => this._filterConcentrations(value)));
        
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
      this.contract.ContractData.UserLimit = this.userLimit.value;
    }
    else {
      this.contract.ContractData.UserLimit = -1;
    }

    this.contract.ContractData.Name = this.name.value;
    this.contract.ContractData.Description = this.description.value;
    this.contract.ContractData.SubmitDate = this.submitDate.value;
    this.contract.ContractData.RegisterDate = this.registerDate.value;
    this.contract.ContractData.Concentrations[0] = this.concentration1.value;
    this.contract.ContractData.Concentrations[1] = this.concentration2.value;
    this.contract.ContractData.Concentrations[2] = this.concentration3.value;
    
    this.dataLoaded = false;
    this.challengesService.UpdateContract(this.contract).subscribe(
      data => {},
      error => {},
      () => this.usersService.CreateConcentration(this.concentration1.value).subscribe(
        () => this.usersService.CreateConcentration(this.concentration2.value).subscribe(
          () => this.usersService.CreateConcentration(this.concentration3.value).subscribe(
            data => {
              this.dataLoaded = true;
              this.editDialogRef.close(this.contract);
            },
            error => {
              this.dataLoaded = true;
              this.editDialogRef.close(this.contract);
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
