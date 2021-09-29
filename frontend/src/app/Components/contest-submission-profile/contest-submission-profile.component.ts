import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/Services/Users/users.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { Observable, range } from 'rxjs';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ContestSubmissionProfileEditComponent } from '../contest-submission-profile-edit/contest-submission-profile-edit.component';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-contest-submission-profile',
  templateUrl: './contest-submission-profile.component.html',
  styleUrls: ['./contest-submission-profile.component.css']
})
export class ContestSubmissionProfileComponent implements OnInit {

  public dataLoaded: boolean = false;
  public submission: Submission;
  public mySubmission: boolean = false;
  public myContest: boolean = false;
  public contest: Contest;
  public contests: Contest[] = [];
  public members: ParticipantUser[] = [];
  public image: string = null;
  public files: string[] = [];
  public filenames: string[] = [];
  public favorited: boolean;
  public favoriteCount: number;
  
  constructor(
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public challengesService: ChallengesService,
    public router: Router,
    public snackBar: MatSnackBar,
    public usersService: UsersService) { 
    this.currentUser.UserLocation = "/submission"
  }

  ngOnInit() {
    this.challengesService.GetSubmissionById(+this.router.url.split("/")[2]).subscribe(
      data => {
        this.submission = data[0];
        if (this.submission.ChallengeType == "contest") {
          this.challengesService.GetContestById(this.submission.ChallengeId).subscribe(
            data => {
              this.contest = data;
              this.contests.push(this.contest);
  
              if (this.contest.ContestData.OwnerUsername == this.currentUser.CurrentUserValue.UserRegistrationData.Username) {
                this.myContest = true;
              }
              
              else if (this.submission.FollowerId == this.currentUser.CurrentUserValue.UserId) {
                this.mySubmission = true;
              }
  
              for (var i=0; i != (this.submission.Members.length); i++) {
                this.usersService.GetByParticipantUsername(this.submission.Members[i]).subscribe(
                  data => {
                    this.members.push(data);
                  }
                )
              }
  
              this.usersService.HasUserFavoritedSubmission(this.submission.Id,this.currentUser.CurrentUserValue.UserId).subscribe(
                data => {
                  this.favorited = data['favorited'];
                  
                  this.challengesService.GetSubmissionFavoriteStatistics(this.submission.Id).subscribe(
                    data => {
                      this.favoriteCount = data['favorites'];
                      this.dataLoaded = true;
                    }
                  );
                },
                error => {
                  this.dataLoaded = true;
                  this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                  this.router.navigate(['/']);
                });
            }
          );
        }

        else {
          this.dataLoaded = true;
          this.router.navigate(['/application/',this.submission.Id]);
        }
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("This submission is confidential.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        this.router.navigate(['/']);
      }
    );
  }

  public SubmitFiles(items:FileList) {
    if(items && items.length > 0) {
      
      if (this.submission.TeamId) {
        range(0, items.length).pipe(
          concatMap(i => {
            this.filenames[i] = items[i].name;
            return this.ReadFile(items[i]).pipe(map(file =>
              ({ file, i })
            ));
          })
        ).subscribe(result => {
          this.files[result.i] = result.file;
          if (result.i == items.length-1) {
            this.SendFilesAsTeam();
          }
        });
      }

      else {
        range(0, items.length).pipe(
          concatMap(i => {
            this.filenames[i] = items[i].name;
            return this.ReadFile(items[i]).pipe(map(file =>
              ({ file, i })
            ));
          })
        ).subscribe(result => {
          this.files[result.i] = result.file;
          if (result.i == items.length-1) {
            this.SendFilesAsIndividual();
          }
        });
      }
    }
  }
  
  public ReadFile(file: File): Observable<string> {
    return new Observable(obs => {
      let reader = new FileReader();
      reader.onload = () => {
        obs.next(reader.result.toString().split(",")[1]);
        obs.complete();
      }
      reader.readAsDataURL(file);
    });
  }

  public SendFilesAsIndividual() {
    this.dataLoaded = false;

    this.submission.SubmittedFileNames = this.filenames;
    this.submission.SubmittedFiles = this.files;

    this.usersService.SubmitFilesToContest(this.submission).subscribe(
      data => {
        this.dataLoaded = true;
        this.snackBar.open("Your submission was successful!", "Close", {duration: 5000,panelClass: ['snackbar-color']});
        this.router.navigate(['/search/']);
      },
      error => {
        this.dataLoaded = true;
      });
  }

  public SendFilesAsTeam() {
    this.dataLoaded = false;

    this.submission.SubmittedFileNames = this.filenames;
    this.submission.SubmittedFiles = this.files;

    this.usersService.SubmitFilesToContestAsTeam(this.submission).subscribe(
      data => {
        this.dataLoaded = true;
        this.snackBar.open("Your submission was successful!", "Close", {duration: 5000,panelClass: ['snackbar-color']});
        this.router.navigate(['/search/']);
      },
      error => {
        this.dataLoaded = true;
      });
  }

  public OnEdit() {
    let editDialogRef = this.dialog.open(ContestSubmissionProfileEditComponent, {
      data: this.submission
    });
  }

  public OnSeeContest() {
    this.router.navigate(['/contest/',this.contest.ContestData.Id]);
  }

  public OnSeeProfile(member: ParticipantUser) {
    this.router.navigate(['/profile/',member.UserRegistrationData.Username]);
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
        }
      );
    }
  }

  public UploadProfileImage(image: string) {
    this.dataLoaded = false;
    this.challengesService.UpdateSubmissionImage(this.submission.Id,image).subscribe(
      data => {
        this.contest.ContestData.Photo = data;
        this.dataLoaded = true; 
        location.reload();
      },
      error => {
        this.dataLoaded = true; 
      });
  }

  public OnDeleteSubmission() {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to delete this submission? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.dataLoaded = false;

          this.usersService.DeleteSubmission(this.submission).subscribe(
            data => {
              this.dataLoaded = true;
              this.snackBar.open("Submission Deleted", "Close", {duration: 5000,panelClass: ['snackbar-color']});
              this.router.navigate(['/contest/',this.contest.ContestData.Id]);
            },
            error => {
              this.dataLoaded = true;
            }, 
          );
        }
      }
    );
  }

  public OnFavorite() {
    this.usersService.FavoriteSubmission(this.submission.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.favorited = true;
      },
      error => {
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnUnfavorite() {
    this.usersService.UnfavoriteSubmission(this.submission.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.favorited = false;
      },
      error => {
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }
}
