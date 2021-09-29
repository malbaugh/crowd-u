import { Component, OnInit, NgZone, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-contest-submission-profile-edit',
  templateUrl: './contest-submission-profile-edit.component.html',
  styleUrls: ['./contest-submission-profile-edit.component.css']
})
export class ContestSubmissionProfileEditComponent implements OnInit {

  public form: FormGroup;
  public ngZone: NgZone;
  public dataLoaded: boolean;
  
  constructor(
    public fb: FormBuilder,
    public editDialogRef: MatDialogRef<ContestSubmissionProfileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public submission: Submission,
    public snackBar: MatSnackBar,
    public usersService: UsersService,
    public challengesService: ChallengesService,
    public currentUser: CurrentUserService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      about: ['']
    });

    this.name.setValue(this.submission.Name);
    this.description.setValue(this.submission.Description);
    this.about.setValue(this.submission.About);

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get name() { return this.form.get('name'); }
  public get description() { return this.form.get('description'); }
  public get about() { return this.form.get('about'); }

  public OnSubmit() {
    this.submission.Name = this.name.value;
    this.submission.Description = this.description.value;
    this.submission.About = this.about.value;

    this.dataLoaded = false;
    this.challengesService.UpdateSubmission(this.submission).subscribe(
      data => {
        this.dataLoaded = true;
        this.editDialogRef.close(this.submission);
      },
      error => {
        this.dataLoaded = true;
      });
  }

  public OnExit() {
    this.editDialogRef.close();
  }
}
