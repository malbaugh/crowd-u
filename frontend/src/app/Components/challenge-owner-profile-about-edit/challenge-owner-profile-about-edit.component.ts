import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-challenge-owner-profile-about-edit',
  templateUrl: './challenge-owner-profile-about-edit.component.html',
  styleUrls: ['./challenge-owner-profile-about-edit.component.css']
})
export class ChallengeOwnerProfileAboutEditComponent implements OnInit {

  public aboutForm: FormGroup;
  public ngZone: NgZone;
  public dataLoaded: boolean;
  
  constructor(
    public fb: FormBuilder,
    public editAboutDialogRef: MatDialogRef<ChallengeOwnerProfileAboutEditComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: ChallengeUser,
    public snackBar: MatSnackBar,
    public currentUser: CurrentUserService,
    public usersService: UsersService
  ) {}

  ngOnInit() {
    this.aboutForm = this.fb.group({
      about: [''],
      website: ['']
    });
    
    this.about.setValue(this.currUser.ChallengeOwnerProfileData.About);
    this.website.setValue(this.currUser.ChallengeOwnerProfileData.Website);

    this.dataLoaded = true;
  }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get about() { return this.aboutForm.get('about'); }
  public get website() { return this.aboutForm.get('website'); }

  public OnSubmitAbout() {
    this.currUser.ChallengeOwnerProfileData.About = this.about.value;

    if (this.website.value != "") {
      var link1 = this.website.value.split("://");
      var web: string;
      if (link1.length == 1) {
        web = "https://" + this.website.value;
      } else {
        web = this.website.value;
      }
    } else {
      web = "";
    }
    this.currUser.ChallengeOwnerProfileData.Website = web;

    this.dataLoaded = false;
    this.usersService.UpdateChallengeUser(this.currUser).subscribe(
      data => {
        this.dataLoaded = true;
        this.currentUser.SetCurrentUser(this.currUser);
        this.editAboutDialogRef.close(this.currUser);
      },
      error => {
        this.dataLoaded = true;
      });
  }

  public OnExit() {
    this.editAboutDialogRef.close();
  }
}
