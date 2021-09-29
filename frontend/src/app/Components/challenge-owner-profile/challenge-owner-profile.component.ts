import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChallengerRegistrationData } from 'src/Helpers/Registration/Interfaces/IChallengerRegistrationData';
import { IChallengeOwnerProfileData } from 'src/Helpers/ProfileData/Interfaces/IChallengeOwnerProfileData';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ChallengeOwnerProfileEditComponent } from '../challenge-owner-profile-edit/challenge-owner-profile-edit.component';
import { ChallengeOwnerProfileAboutEditComponent } from '../challenge-owner-profile-about-edit/challenge-owner-profile-about-edit.component';
import { ChallengeCreateFormComponent } from '../challenge-create-form/challenge-create-form.component';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { first } from 'rxjs/operators';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';

@Component({
  selector: 'app-challenge-owner-profile',
  templateUrl: './challenge-owner-profile.component.html',
  styleUrls: ['./challenge-owner-profile.component.css']
})
export class ChallengeOwnerProfileComponent implements OnInit {

  public user: ChallengeUser;
  public myProfile: boolean;
  public creatingChallenge: boolean = false;
  public dataLoaded: boolean = false;
  public image: string;
  public following: boolean;
  public followingCount: number;
  public followerCount: number;
  public loggedIn: boolean;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public usersService: UsersService,
    public snackBar: MatSnackBar,
    public activeRoute: ActivatedRoute) { 
      this.currentUser.UserLocation = "/profile/org";
    }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if ((this.currentUser.CurrentUserValue instanceof ChallengeUser) && (this.currentUser.CurrentUserValue.UserRegistrationData.Username==this.router.url.split("/")[3])) {
        this.myProfile = true;
        this.loggedIn = true;
        this.user = this.currentUser.CurrentUserValue;
        this.usersService.GetFollowingStatistics(this.user.UserId).subscribe(
          data => {
            this.followingCount = data['following'];
            this.followerCount = data['followers'];
            this.dataLoaded = true;
          }
        );
      } 
      
      else if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
        this.myProfile = false;
        this.loggedIn = true;
        this.usersService.GetByChallengerUsername(this.router.url.split("/")[3]).subscribe(
          data => {
            this.user = <ChallengeUser>data;
            
            this.usersService.IsUserFollowingUser(this.user.UserId, this.currentUser.CurrentUserValue.UserId).subscribe(
              data => {
                this.following = data['following'];
                this.usersService.GetFollowingStatistics(this.user.UserId).subscribe(
                  data => {
                    this.followingCount = data['following'];
                    this.followerCount = data['followers'];
                    this.dataLoaded = true;
                  }
                );
              },
              error => {
                this.dataLoaded = true;
                this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                this.router.navigate(['/']);
              });
          },
          error => {
            this.snackBar.open("No user found for this URL.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
            this.router.navigate(['/']);
        });
      }

      else {
        this.myProfile = false;
        this.loggedIn = false;
        this.usersService.GetByChallengerUsername(this.router.url.split("/")[3]).subscribe(
          data => {
            this.user = <ChallengeUser>data;
            
            this.usersService.GetFollowingStatistics(this.user.UserId).subscribe(
              data => {
                this.followingCount = data['following'];
                this.followerCount = data['followers'];
                this.dataLoaded = true;
              },
              error => {
                this.dataLoaded = true;
                this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                this.router.navigate(['/']);
              }
            );
          },
          error => {
            this.snackBar.open("No user found for this URL.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
            this.router.navigate(['/']);
          });
      }
    });
  }

  public EditProfileImage(event) {
    if (event.target.files && event.target.files[0]) {
      let imageDialog = this.dialog.open(ImageUploaderComponent, {
        data: event
      });

      imageDialog.afterClosed().subscribe(
        data => {
          this.image = data.base64.split(",")[1];
          this.UploadProfileImage(this.image);
        },
        error => {
        }
      );
    }
  }
  
  public UploadProfileImage(image: string) {
    this.dataLoaded = false;
    this.usersService.UpdateProfileImage(this.user.UserRegistrationData.Username,image).subscribe(
      data => {
        this.user.ChallengeOwnerProfileData.Photo = data;
        this.currentUser.SetCurrentUser(this.user);
        this.dataLoaded = true; 
        // location.reload();
      },
      error => {
        this.dataLoaded = true; 
      });
  }
  
  public OnEdit() {
    this.user = this.currentUser.CurrentUserValue;
    let editDialogRef = this.dialog.open(ChallengeOwnerProfileEditComponent, {
      data: this.user
    });
  }

  public OnEditAbout() {
    let editAboutDialogRef = this.dialog.open(ChallengeOwnerProfileAboutEditComponent, {
      data: this.user
    });
  }

  public OnCreateChallenge(event) {
    let challengeDialogForm = this.dialog.open(ChallengeCreateFormComponent);
  }

  public OnSeeChallenges() {
    this.router.navigate(['/owner/challenges/',this.router.url.split("/")[3]+'_ongoing']);
  }

  public OnSeeClosedChallenges() {
    this.router.navigate(['/owner/challenges/',this.router.url.split("/")[3]+'_closed']);
  }

  public OnFollow() {
    this.usersService.FollowUser(this.user.UserId, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.following = true;
        this.followerCount = this.followerCount + 1;
      },
      error => {
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });

  }

  public OnUnfollow() {
    this.usersService.UnfollowUser(this.user.UserId, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.following = false;
        this.followerCount = this.followerCount - 1;
      },
      error => {
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }
}
