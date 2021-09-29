import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first } from 'rxjs/operators';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-contest-profile-about-edit',
  templateUrl: './contest-profile-about-edit.component.html',
  styleUrls: ['./contest-profile-about-edit.component.css']
})
export class ContestProfileAboutEditComponent implements OnInit {

  public form: FormGroup;
  public ngZone: NgZone;
  public dataLoaded: boolean = false;
  public user: ChallengeUser;
  
  constructor(
    public fb: FormBuilder,
    public editAboutDialogRef: MatDialogRef<ContestProfileAboutEditComponent>,
    public challengesService: ChallengesService,
    public currentUser: CurrentUserService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public contest: Contest
  ) {}
  
  ngOnInit() {
    if ((this.currentUser.CurrentUserValue instanceof ChallengeUser) && (this.currentUser.CurrentUserValue.ChallengerRegistrationData.Username == this.contest.ContestData.OwnerUsername)) {
      this.user = this.currentUser.CurrentUserValue;
      
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

      this.about.setValue(this.contest.ContestData.About);
      this.prizes.setValue(this.contest.ContestData.Prizes);
      this.eligibility.setValue(this.contest.ContestData.Eligibility);
      this.rules.setValue(this.contest.ContestData.Rules);
      this.requirements.setValue(this.contest.ContestData.Requirements);
      this.criteria.setValue(this.contest.ContestData.JudgingCriteria);
      //this.judges.setValue(this.contest.ContestData.Judges);
      //this.sponsors.setValue(this.contest.ContestData.Sponsors);
      this.resources.setValue(this.contest.ContestData.Resources);

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
    this.contest.ContestData.About = this.about.value;
    this.contest.ContestData.Prizes = this.prizes.value;
    this.contest.ContestData.Eligibility = this.eligibility.value;
    this.contest.ContestData.Rules = this.rules.value;
    this.contest.ContestData.Requirements = this.requirements.value;
    this.contest.ContestData.JudgingCriteria = this.criteria.value;
    // this.contest.ContestData.Judges = this.judges.value;
    // this.contest.ContestData.Sponsors = this.sponsors.value;
    this.contest.ContestData.Resources = this.resources.value;

    this.dataLoaded = false;
    this.challengesService.UpdateContest(this.contest).subscribe(
      data => {
        this.dataLoaded = true;
        this.editAboutDialogRef.close(this.contest);
      },
      error => {
        this.dataLoaded = true;
      });
  }

  public OnExit() {
    this.editAboutDialogRef.close();
  }
}
