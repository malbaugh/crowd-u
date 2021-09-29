import { Component, OnInit, ViewChild } from '@angular/core';
import { IParticipantRegistrationData } from 'src/Helpers/Registration/Interfaces/IParticipantRegistrationData';
import { IParticipantProfileData } from 'src/Helpers/ProfileData/Interfaces/IParticipantProfileData';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { MatDialog, MatSnackBar, MatPaginator, MatTabGroup } from '@angular/material';
import { ParticipantProfileEditComponent } from '../participant-profile-edit/participant-profile-edit.component';
import { ParticipantProfileAboutEditComponent } from '../participant-profile-about-edit/participant-profile-about-edit.component';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/Services/Users/users.service';
import { User } from 'src/Helpers/Users/Classes/User';
import { first } from 'rxjs/operators';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { SelectedTab } from '../challenge-owner-challenges/SelectedTab';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';

@Component({
  selector: 'app-participant-profile',
  templateUrl: './participant-profile.component.html',
  styleUrls: ['./participant-profile.component.css']
})
export class ParticipantProfileComponent implements OnInit {

  public currentTabIndex: SelectedTab = 0;
  public pageIndex: number;
  public length: number;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100];
  public currentPage = 0;
  public allClosedSubmissions: Submission[];
  public pageClosedSubmissions: Submission[];
  public selectedClosedSubmission: Submission;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public regData: IParticipantRegistrationData;
  public proData: IParticipantProfileData;
  public user: ParticipantUser;
  public myProfile: boolean;
  public uniLogo: string = "";
  public dataLoaded: boolean = false;
  public image: string = null;
  public description: string ="";
  public following: boolean;
  public loaded: boolean;
  public followingCount: number;
  public followerCount: number;
  public loggedIn: boolean;

  constructor(
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public usersService: UsersService,
    public router: Router,
    public snackBar: MatSnackBar,
    public activeRoute: ActivatedRoute,
    public challengesService: ChallengesService) { 
      this.currentUser.UserLocation = "/profile";
    }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if ((this.currentUser.CurrentUserValue instanceof ParticipantUser) && (this.currentUser.CurrentUserValue.UserRegistrationData.Username==this.router.url.split("/")[2])) {
        this.myProfile = true;
        this.loggedIn = true;
        this.user = this.currentUser.CurrentUserValue;
        this.description = this.user.ParticipantProfileData.Major+" | "+this.user.ParticipantRegistrationData.University+" | "+this.user.ParticipantProfileData.EducationStatus;
        
        this.usersService.GetFollowingStatistics(this.user.UserId).subscribe(
          data => {
            this.followingCount = data['following'];
            this.followerCount = data['followers'];
            this.closedSubmissionIterator();
          }
        );
      } 
      
      else if (this.currentUser.CurrentUserValue instanceof ChallengeUser) {
        this.myProfile = false;
        this.loggedIn = true;
        this.dataLoaded = false;
        this.usersService.GetByParticipantUsername(this.router.url.split("/")[2]).subscribe(
          data => {
            this.user = <ParticipantUser>data;
            this.description = this.user.ParticipantProfileData.Major+" | "+this.user.ParticipantRegistrationData.University+" | "+this.user.ParticipantProfileData.EducationStatus;

            this.usersService.IsUserFollowingUser(this.user.UserId, this.currentUser.CurrentUserValue.UserId).subscribe(
              data => {
                this.following = data['following'];

                this.usersService.GetFollowingStatistics(this.user.UserId).subscribe(
                  data => {
                    this.followingCount = data['following'];
                    this.followerCount = data['followers'];
                    this.closedSubmissionIterator();
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
            this.snackBar.open("No user found for this URL.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            this.dataLoaded = true;
            this.router.navigate(['/']);
        });
      }

      else {
        this.myProfile = false;
        this.loggedIn = false;
        this.dataLoaded = false;
        this.usersService.GetByParticipantUsername(this.router.url.split("/")[2]).subscribe(
          data => {
            this.user = <ParticipantUser>data;
            this.description = this.user.ParticipantProfileData.Major+" | "+this.user.ParticipantRegistrationData.University+" | "+this.user.ParticipantProfileData.EducationStatus;

            this.usersService.GetFollowingStatistics(this.user.UserId).subscribe(
              data => {
                this.followingCount = data['following'];
                this.followerCount = data['followers'];
                this.closedSubmissionIterator();
              },
              error => {
                this.dataLoaded = true;
                this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                this.router.navigate(['/']);
              }
            );
          },
          error => {
            this.snackBar.open("No user found for this URL.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            this.dataLoaded = true;
            this.router.navigate(['/']);
        });
      }
    });
  }

  public GetClosedSubmissions(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.closedSubmissionIterator();
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

  public closedSubmissionIterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;

    this.loaded = false;
    this.challengesService.GetParticipantSubmissions(this.user.UserId,true,'contest').subscribe(
      data => {
        this.allClosedSubmissions = data;
        this.dataLoaded = true;
        this.loaded = true;
        const part = data.slice(start,end);
        this.pageClosedSubmissions = part;
      }, 
      error => {
        this.dataLoaded = true;
        this.loaded = true;
        this.snackBar.open("No results found.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnSeeSubmission(submission: Submission) {
    this.router.navigate(['/submission/',submission.Id]);
  }
  
  public UploadProfileImage(image: string) {
    this.dataLoaded = false;
    this.usersService.UpdateProfileImage(this.user.UserRegistrationData.Username,image).subscribe(
      data => {
        this.user.ParticipantProfileData.Photo = data;
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
    const editDialogRef = this.dialog.open(ParticipantProfileEditComponent, {
      data: this.user
    });
  }

  public OnEditAbout() {
    this.user = this.currentUser.CurrentUserValue;
    const editAboutDialogRef = this.dialog.open(ParticipantProfileAboutEditComponent, {
      data: this.user
    });
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
