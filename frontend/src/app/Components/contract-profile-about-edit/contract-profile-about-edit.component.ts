import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { take, first } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-contract-profile-about-edit',
  templateUrl: './contract-profile-about-edit.component.html',
  styleUrls: ['./contract-profile-about-edit.component.css']
})
export class ContractProfileAboutEditComponent implements OnInit {

  public form: FormGroup;
  public ngZone: NgZone;
  public dataLoaded: boolean = false;
  public user: ChallengeUser;
  
  constructor(
    public fb: FormBuilder,
    public editAboutDialogRef: MatDialogRef<ContractProfileAboutEditComponent>,
    public challengesService: ChallengesService,
    public currentUser: CurrentUserService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public contract: Contract
  ) {}

  ngOnInit() {
    if ((this.currentUser.CurrentUserValue instanceof ChallengeUser) && (this.currentUser.CurrentUserValue.ChallengerRegistrationData.Username == this.contract.ContractData.OwnerUsername)) {
      this.form = this.fb.group({
        about: ['', [Validators.required]],
        prizes: [''],
        eligibility: [''],
        rules: [''],
        requirements: [''],
        criteria: [''],
        judges: [''],
        sponsors: [''],
        resources: ['']
      });

      this.about.setValue(this.contract.ContractData.About);
      this.prizes.setValue(this.contract.ContractData.Prizes);
      this.eligibility.setValue(this.contract.ContractData.Eligibility);
      this.rules.setValue(this.contract.ContractData.Rules);
      this.requirements.setValue(this.contract.ContractData.Requirements);
      this.criteria.setValue(this.contract.ContractData.JudgingCriteria);
      //this.judges.setValue(this.contract.ContractData.Judges);
      //this.sponsors.setValue(this.contract.ContractData.Sponsors);
      this.resources.setValue(this.contract.ContractData.Resources);

      this.dataLoaded = true;
    } 
    
    else {
      this.snackBar.open("You do not have permission to edit this contest.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
      this.editAboutDialogRef.close();
      this.router.navigate(['/']);
    }
  }

  public get about() { return this.form.get('about'); }
  public get prizes() { return this.form.get('prizes'); }
  public get eligibility() { return this.form.get('eligibility'); }
  public get rules() { return this.form.get('rules'); }
  public get requirements() { return this.form.get('requirements'); }
  public get criteria() { return this.form.get('criteria'); }
  public get judges() { return this.form.get('judges'); }
  public get sponsors() { return this.form.get('sponsors'); }
  public get resources() { return this.form.get('resources'); }

  public OnSubmit() {
    this.contract.ContractData.About = this.about.value;
    this.contract.ContractData.Prizes = this.prizes.value;
    this.contract.ContractData.Eligibility = this.eligibility.value;
    this.contract.ContractData.Rules = this.rules.value;
    this.contract.ContractData.Requirements = this.requirements.value;
    this.contract.ContractData.JudgingCriteria = this.criteria.value;
    // this.contract.ContractData.Judges = this.judges.value;
    // this.contract.ContractData.Sponsors = this.sponsors.value;
    this.contract.ContractData.Resources = this.resources.value;
    
    this.dataLoaded = false;
    this.challengesService.UpdateContract(this.contract).subscribe(
      data => {
        this.dataLoaded = true;
        this.editAboutDialogRef.close(this.contract);
      },
      error => {
        this.dataLoaded = true;
      });
  }

  public OnExit() {
    this.editAboutDialogRef.close();
  }
}
