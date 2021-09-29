import { Component, OnInit, NgZone, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first } from 'rxjs/operators';
import { UsersService } from 'src/app/Services/Users/users.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';

@Component({
  selector: 'app-participant-profile-about-edit',
  templateUrl: './participant-profile-about-edit.component.html',
  styleUrls: ['./participant-profile-about-edit.component.css']
})
export class ParticipantProfileAboutEditComponent implements OnInit {

  public aboutForm: FormGroup;
  public ngZone: NgZone;
  public dataLoaded: boolean;
  
  constructor(
    public fb: FormBuilder,
    public editAboutDialogRef: MatDialogRef<ParticipantProfileAboutEditComponent>,
    @Inject(MAT_DIALOG_DATA) public currUser: ParticipantUser,
    public snackBar: MatSnackBar,
    public currentUser: CurrentUserService,
    public usersService: UsersService
  ) {}

  ngOnInit() {
    this.aboutForm = this.fb.group({
      description: [''],
      about: [''],
      website: ['']
    });
    
    this.description.setValue(this.currUser.ParticipantProfileData.Description);
    this.about.setValue(this.currUser.ParticipantProfileData.About);
    this.website.setValue(this.currUser.ParticipantProfileData.Website);

    this.dataLoaded = true;
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public get description() { return this.aboutForm.get('description'); }
  public get about() { return this.aboutForm.get('about'); }
  public get website() { return this.aboutForm.get('website'); }

  public OnSubmitAbout() {
    this.currUser.ParticipantProfileData.Description = this.description.value;
    this.currUser.ParticipantProfileData.About = this.about.value;
    
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

    this.currUser.ParticipantProfileData.Website = web;

    this.dataLoaded = false;
    this.usersService.UpdateParticipantUser(this.currUser).subscribe(
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
