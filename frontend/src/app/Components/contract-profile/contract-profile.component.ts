import { Component, OnInit } from '@angular/core';
import { ContractProfileAboutEditComponent } from '../contract-profile-about-edit/contract-profile-about-edit.component';
import { ContractProfileEditComponent } from '../contract-profile-edit/contract-profile-edit.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { Router } from '@angular/router';
import { first, concatMap, map } from 'rxjs/operators';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { Observable, range } from 'rxjs';
import { SubmitComponent } from '../submit/submit.component';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';

@Component({
  selector: 'app-contract-profile',
  templateUrl: './contract-profile.component.html',
  styleUrls: ['./contract-profile.component.css']
})
export class ContractProfileComponent implements OnInit {

  public contract: Contract;
  public myChallenge: boolean;
  public following: boolean;
  public participant: boolean = false;
  public dataLoaded: boolean = false;
  public registered: boolean = false;
  public image: string = null;
  public files: string[] = [];
  public filenames: string[] = [];
  public applied: boolean = false;
  public followerCount: number;
  public applicationCount: number;
  
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
    this.challengesService.GetContractById(+this.router.url.split("/")[2]).subscribe(
      data => {
        this.contract = data;
        if (this.currentUser.CurrentUserValue) {
          if (this.currentUser.CurrentUserValue.UserRegistrationData.Username == this.contract.ContractData.OwnerUsername) {
            if ((this.contract.ContractData.Completed == true) && (this.contract.ContractData.WinnerSelected == false)) {
              this.router.navigate(['/contract/select-team/',this.contract.ContractData.Id]);
            }
            this.myChallenge = true;
            this.participant = false;
          } 
          
          else if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
            this.myChallenge = false;
            this.participant = true;

            this.usersService.IsUserFollowingChallenge(this.contract.ContractData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
              data => {
                this.following = data['following'];
                this.applied = data['submitted'];
              },
              error => {
                this.snackBar.open("Somthing went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                this.router.navigate(['/']);
              });              
          }
        } 
        
        else {
          this.myChallenge = false;
          this.participant = false;
        }
      },
      error => {
        this.snackBar.open("No contract found for this URL.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        this.router.navigate(['/']);
      },
      () => this.challengesService.GetNumberFollowingAndSubmittedToChallenge(this.contract.ContractData.Id).subscribe(
        data => {
          this.followerCount = data['follower_count'];
          this.applicationCount = data['submission_count'];
          this.dataLoaded = true;
        }, error => {}
      )
    );
  }

  public OnInitializeSubmission() {
    if (this.contract.ContractData.UserLimit == -1) {
      let submitDialogRef = this.dialog.open(SubmitComponent);

      submitDialogRef.afterClosed().subscribe(
        data => {
          if (data == undefined) {} 
          else if (data['teamed'] == false) {
            this.usersService.InitializeChallengeSubmission(this.contract.ContractData.Id,this.currentUser.CurrentUserValue.UserId,'contract').subscribe(
              data => {
                this.router.navigate(['/application/',data]);
              },
              error => {
                this.dataLoaded = true;
                this.snackBar.open("Something went wrong", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              }
            );
          } 
          else if (data['teamed'] == true) {
            this.usersService.InitializeChallengeSubmission(this.contract.ContractData.Id,this.currentUser.CurrentUserValue.UserId,'contract',data['team'].Id).subscribe(
              data => {

                this.router.navigate(['/application/',data]);
              },
              error => {
                this.dataLoaded = true;
                this.snackBar.open("Something went wrong", "Close", {duration: 3000,panelClass: ['snackbar-color']});
              }
            );
          } 
          else {}
        },
        error => {
        }
      );
    }
    
    else {
      this.challengesService.GetNumberFollowingAndSubmittedToChallenge(this.contract.ContractData.Id).subscribe(
        data => {
          this.applicationCount = data['submission_count'];
          if (this.applicationCount < this.contract.ContractData.UserLimit) {
            let submitDialogRef = this.dialog.open(SubmitComponent);

            submitDialogRef.afterClosed().subscribe(
              data => {
                if (data == undefined) {} 
                else if (data['teamed'] == false) {
                  this.usersService.InitializeChallengeSubmission(this.contract.ContractData.Id,this.currentUser.CurrentUserValue.UserId,'contract').subscribe(
                    data => {
                      this.router.navigate(['/application/',data]);
                    },
                    error => {
                      this.dataLoaded = true;
                      this.snackBar.open("Something went wrong", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                    }
                  );
                } 
                else if (data['teamed'] == true) {
                  this.usersService.InitializeChallengeSubmission(this.contract.ContractData.Id,this.currentUser.CurrentUserValue.UserId,'contract',data['team'].Id).subscribe(
                    data => {

                      this.router.navigate(['/application/',data]);
                    },
                    error => {
                      this.dataLoaded = true;
                      this.snackBar.open("Something went wrong", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                    }
                  );
                } 
                else {}
              },
              error => {
              }
            );
          }
          else {
            this.snackBar.open("Sorry, there are no more spots available.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          }
        }, error => {});
    }
  }

  public OnFollow() {
    this.usersService.FollowChallenge(this.contract.ContractData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.dataLoaded = true;
        this.following= true;
      },
      error => {
        this.dataLoaded = true;
        this.following = false;
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnUnfollow() {
    this.usersService.UnfollowChallenge(this.contract.ContractData.Id, this.currentUser.CurrentUserValue.UserId).subscribe(
      data => {
        this.dataLoaded = true;
        this.following = false;
      },
      error => {
        this.dataLoaded = true;
        this.following = true;
        this.snackBar.open("Your credentials are invalid.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
      });
  }

  public OnEdit() {
    let editDialogRef = this.dialog.open(ContractProfileEditComponent, {
      data: this.contract
    });
  }

  public OnEditAbout() {
    let editAboutDialogRef = this.dialog.open(ContractProfileAboutEditComponent, {
      data: this.contract
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
        this.contract.ContractData.Photo = data;
        this.dataLoaded = true; 
        // location.reload();
      },
      error => {
        this.dataLoaded = true; 
      });
  }

  public OnSeeOwnerProfile() {
    this.router.navigate(['/profile/org/',this.contract.ContractData.OwnerUsername]);
  }

  public OnCloseChallenge() {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to close this challenge? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.challengesService.CloseContract(this.contract).subscribe(
            data => {
              if (data == true) {
                this.router.navigate(['/contract/select-team/',this.contract.ContractData.Id]);
              }

              else {
                this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                location.reload();
              }
              
            },
            error => {
              this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            });
        }
      });
  }
}
