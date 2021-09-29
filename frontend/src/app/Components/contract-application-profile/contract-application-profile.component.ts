import { Component, OnInit } from '@angular/core';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { Observable, range } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ContractApplicationProfileEditComponent } from '../contract-application-profile-edit/contract-application-profile-edit.component';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';

@Component({
  selector: 'app-contract-application-profile',
  templateUrl: './contract-application-profile.component.html',
  styleUrls: ['./contract-application-profile.component.css']
})
export class ContractApplicationProfileComponent implements OnInit {

  public dataLoaded: boolean = false;
  public submission: Submission;
  public mySubmission: boolean = false;
  public myContract: boolean = false;
  public contract: Contract;
  public contracts: Contract[] = [];
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
        if (this.submission.ChallengeType == "contract") {
          this.challengesService.GetContractById(this.submission.ChallengeId).subscribe(
            data => {
              this.contract = data;
              this.contracts.push(this.contract);
  
              if (this.contract.ContractData.OwnerUsername == this.currentUser.CurrentUserValue.UserRegistrationData.Username) {
                this.myContract = true;
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
          this.router.navigate(['/submission/',this.submission.Id]);
        }
      },
      error => {
        this.dataLoaded = true;
        this.snackBar.open("This application is confidential.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
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

    this.usersService.SubmitFilesToContract(this.submission).subscribe(
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

    this.usersService.SubmitFilesToContractAsTeam(this.submission).subscribe(
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
    let editDialogRef = this.dialog.open(ContractApplicationProfileEditComponent, {
      data: this.submission
    });
  }

  public OnSeeContract() {
    this.router.navigate(['/contract/',this.contract.ContractData.Id]);
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
        this.contract.ContractData.Photo = data;
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
              this.snackBar.open("Application Deleted", "Close", {duration: 5000,panelClass: ['snackbar-color']});
              this.router.navigate(['/contract/',this.contract.ContractData.Id]);
            },
            error => {
              this.dataLoaded = true;
            }, 
          );
        }
      }
    );
  }
}
