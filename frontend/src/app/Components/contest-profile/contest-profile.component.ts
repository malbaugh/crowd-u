import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { ContestProfileAboutEditComponent } from '../contest-profile-about-edit/contest-profile-about-edit.component';
import { ContestProfileEditComponent } from '../contest-profile-edit/contest-profile-edit.component';
import { Router } from '@angular/router';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { first, concatMap, map } from 'rxjs/operators';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { Observable, range } from 'rxjs';
import { SubmitComponent } from '../submit/submit.component';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';
import { Submission } from 'src/Helpers/Document/Classes/Submission';

@Component({
  selector: 'app-contest-profile',
  templateUrl: './contest-profile.component.html',
  styleUrls: ['./contest-profile.component.css']
})
export class ContestProfileComponent implements OnInit {
  
  public contest: Contest;
  public myChallenge: boolean;
  public following: boolean;
  public participant: boolean = false;
  public dataLoaded: boolean = false;
  public registered: boolean = false;
  public image: string = null;
  public files: string[] = [];
  public filenames: string[] = [];
  public submitted: boolean = false;
  public allSubmissions: Submission[];
  public followerCount: number;
  public registrationCount: number;
  public submissionCount: number;

  constructor(
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public challengesService: ChallengesService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService) {
      this.currentUser.UserLocation = "/challenge";
     }

  ngOnInit() {
    this.dataLoaded = false;
    this.challengesService.GetContestById(+this.router.url.split("/")[2]).subscribe(
      data => {
        this.contest = data;
        if (this.currentUser.CurrentUserValue) {
          if (this.currentUser.CurrentUserValue.UserRegistrationData.Username == this.contest.ContestData.OwnerUsername) {
            if ((this.contest.ContestData.Completed == true) && (this.contest.ContestData.WinnerSelected == false)) {
              this.router.navigate(['/contest/select-winner/',this.contest.ContestData.Id]);
            }
            
            this.myChallenge = true;
            this.participant = false;
          } 
          
          else if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
            this.myChallenge = false;
            this.participant = true;

            this.usersService.IsUserFollowingChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
              data => {
                this.following = data['following'];
                this.submitted = data['submitted'];
              },
              error => {
                this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                this.router.navigate(['/']);
              },
              () => this.usersService.HasUserRegisteredForChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
                data => {
                  this.registered = data['registered'];
                },
                error => {
                  this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                  this.router.navigate(['/']);
                }
              )
            );
          }
        } 
        
        else {
          this.myChallenge = false;
          this.participant = false;
        }
      },
      error => {
        this.snackBar.open("No contest found for this URL.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        this.router.navigate(['/']);
      },
      () => this.challengesService.GetChallengeWinners(this.contest.ContestData.Id).subscribe(
        data => {
          this.allSubmissions = data;
        }, error => {},
        () => this.challengesService.GetNumberFollowingAndSubmittedToChallenge(this.contest.ContestData.Id).subscribe(
          data => {
            this.followerCount = data['follower_count'];
            this.submissionCount = data['submission_count'];
          }, error => {},
          () => this.challengesService.GetNumberRegisteredForChallenge(this.contest.ContestData.Id).subscribe(
            data => {
              this.registrationCount = data;
              this.dataLoaded = true;
            }, error => {},
          )
        )
      )
    );
  }

  public OnInitializeSubmission() {
    let submitDialogRef = this.dialog.open(SubmitComponent);

    submitDialogRef.afterClosed().subscribe(
      data => {
        if (data == undefined) {

        } 
        else if (data['teamed'] == false) {
          this.usersService.InitializeChallengeSubmission(this.contest.ContestData.Id,this.currentUser.CurrentUserValue.UserId,'contest').subscribe(
            data => {
              this.router.navigate(['/submission/',data]);
            },
            error => {
              this.dataLoaded = true;
              this.snackBar.open("Something went wrong", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
          );
        } 
        else if (data['teamed'] == true) {
          this.usersService.InitializeChallengeSubmission(this.contest.ContestData.Id,this.currentUser.CurrentUserValue.UserId,'contest',data['team'].Id).subscribe(
            data => {

              this.router.navigate(['/submission/',data]);
            },
            error => {
              this.dataLoaded = true;
              this.snackBar.open("Something went wrong", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
          );
        } 
        else {

        }
      },
      error => {
      }
    );
  }

  public OnFollow() {
    this.usersService.FollowChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.following = true;
        this.followerCount = this.followerCount + 1;
      },
      error => {
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }
  public OnUnfollow() {
    this.usersService.UnfollowChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.following = false;
        this.followerCount = this.followerCount - 1;
      },
      error => {
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnRegister() {
    if (this.contest.ContestData.UserLimit == -1) {
      this.usersService.RegisterForChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
        data => {
          this.registered = true;
          this.registrationCount = this.registrationCount + 1;
          if (this.following == true) {
            this.OnUnfollow();
          }
        },
        error => {
          this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        }
      );
    }
    else {
      this.challengesService.GetNumberRegisteredForChallenge(this.contest.ContestData.Id).subscribe(
        data => {
          this.registrationCount = data;
          if (this.registrationCount < this.contest.ContestData.UserLimit) {
            this.usersService.RegisterForChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
              data => {
                this.registered = true;
                this.registrationCount = this.registrationCount + 1;
                if (this.following == true) {
                  this.OnUnfollow();
                }
              },
              error => {
                this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              }
            );
          }
          else {
            this.snackBar.open("Sorry, there are no more spots available.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          }
        }, error => {});
    }
  }

  public OnUnregister() {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to unregister from this event? There may no longer be an opening available should you change your mind later.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.usersService.UnregisterFromChallenge(this.contest.ContestData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
            data => {
              this.registered = false;
              this.registrationCount = this.registrationCount - 1;
            },
            error => {
              this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
          );
        }
      }
    );
  }

  public OnEdit() {
    let editDialogRef = this.dialog.open(ContestProfileEditComponent, {
      data: this.contest
    });
  }

  public OnEditAbout() {
    let editAboutDialogRef = this.dialog.open(ContestProfileAboutEditComponent, {
      data: this.contest
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
    this.challengesService.UpdateChallengeImage(+this.router.url.split("/")[2],image).subscribe(
      data => {
        this.contest.ContestData.Photo = data;
        this.dataLoaded = true; 
        // location.reload();
      },
      error => {
        this.dataLoaded = true; 
      });
  }

  public OnSeeOwnerProfile() {
    this.router.navigate(['/profile/org/',this.contest.ContestData.OwnerUsername]);
  }

  public OnCloseChallenge() {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to close this contest? You will not be able to undo this.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.challengesService.CloseContest(this.contest).subscribe(
            data => {
              if (data == true) {
                this.router.navigate(['/contest/select-winner/',this.contest.ContestData.Id]);
              }

              else {
                this.snackBar.open("Something went wrong.", "Close", {duration: 3000, panelClass: ['snackbar-color']});
                location.reload();
              }
              
            },
            error => {
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            });
        }
      });
  }

  public OnSeeSubmission(submission: Submission) {   
    this.router.navigate(['/submission/',submission.Id]);
  }
  public OnSeeSubmitterProfile(submission: Submission) {
    this.router.navigate(['/profile/',submission.Members[0]]);
  }

  public OnGenerateRegistrationLink() {
    var link: string = "https://crowd-u.com/participant-registration/challenge-id-"+this.contest.ContestData.Id.toString();
    
    this.snackBar.open(link, "Dismiss",{panelClass: ['snackbar-color']});
  }
}
