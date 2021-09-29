import { Component, OnInit } from '@angular/core';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { ContestAwardSubmissionFormComponent } from '../contest-award-submission-form/contest-award-submission-form.component';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';
import { NoWinnersNoticeComponent } from 'src/app/Components/no-winners-notice/no-winners-notice.component';

@Component({
  selector: 'app-contest-winner-selection',
  templateUrl: './contest-winner-selection.component.html',
  styleUrls: ['./contest-winner-selection.component.css']
})
export class ContestWinnerSelectionComponent implements OnInit {

  public contest: Contest;
  public dataLoaded: boolean = false;
  public image: string = null;
  public files: string[] = [];
  public filenames: string[] = [];
  public submitted: boolean = false;
  public allSubmissions: Submission[];
  public pageSubmissions: Submission[];
  public selectedSubmission: Submission;
  public currentSelection = [];

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
    this.challengesService.GetContestById(+this.router.url.split("/")[3]).subscribe(
      data => {
        this.contest = data;
        if (this.currentUser.CurrentUserValue) {
          if (this.currentUser.CurrentUserValue.UserRegistrationData.Username == this.contest.ContestData.OwnerUsername) {
            if ((this.contest.ContestData.Completed == true) && (this.contest.ContestData.WinnerSelected == false)) {
              this.challengesService.GetAllSubmissions(this.contest.ContestData.Id).subscribe(
                data => {
                  this.allSubmissions = data;

                  if (this.allSubmissions.length == 0) {
                    this.dataLoaded = true;
                    this.challengesService.CloseChallengeWithoutWinners(this.contest).subscribe(
                      data => {
                        const noWinnersDialogRef = this.dialog.open(NoWinnersNoticeComponent);

                        noWinnersDialogRef.afterClosed().subscribe(
                          data => {
                            this.usersService.ReportIssue(`NO WINNER REPORT: no one applied to this challenge: ${this.contest.ContestData.Id}`,this.currentUser.CurrentUserValue.UserRegistrationData.Username).subscribe(
                              data => {
                                this.router.navigate(['/']);
                              }
                            );
                          });
                      }
                    );
                  }
                  this.dataLoaded = true;
                },
                error => {
                  this.dataLoaded = true;
                }
              );
            }
            else {
              this.router.navigate(['/contest/',this.contest.ContestData.Id]);
            }
          } 
          
          else {
            this.router.navigate(['/contest/',this.contest.ContestData.Id]);
          } 
        }
        else {
          this.router.navigate(['/contest/',this.contest.ContestData.Id]);
        }
      },
      error => {
        this.snackBar.open("No contest found for this URL.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
        this.dataLoaded = true;
        this.router.navigate(['/']);
      });
  }

  public OnDownloadSubmission(submission: Submission) {
    this.snackBar.open("Your download has started. Please wait while we process your request.", "Close", {duration: 5000,panelClass: ['snackbar-color']});

    var zip = new JSZip();
    var count: number = 0;
    var i: number;
    var zipFilename: string;
    var contestName: string = this.contest.ContestData.Name;
    var teamName: string = submission.TeamName;

    for (var j=0; j < contestName.length; j++) {
      contestName = contestName.replace(" ","-");
    }

    for (var k=0; k < teamName.length; k++) {
      teamName = teamName.replace(" ","-");
    }
    
    if (submission.TeamName == "") {
      zipFilename = contestName + "_individual-submission_" + submission.Members[0] + ".zip";
    } else {
      zipFilename = contestName + "_team-submission_" + teamName + ".zip";
    }

    submission.SubmittedFiles.forEach(function(url) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err; 
        }

        i = submission.SubmittedFiles.indexOf(url); // This is important as the .getBinaryContent causes the urls to be pulled out of order
        zip.file(submission.SubmittedFileNames[i], data, {binary:true});

        zip.file(
          "README.txt", 
          "Submission Name: "+submission.Name+"\n"+
          submission.Description+"\n"+
          submission.About
        );

        count++;
        if (count == submission.SubmittedFiles.length) {
          zip.generateAsync({type:'blob'}).then(function(content) {
              saveAs(content, zipFilename);
          });
        }
      });
    });
  }

  public OnDownloadAllSubmissions() {
    this.snackBar.open("Your download has started. Please wait while we process your request.", "Close", {duration: 5000,panelClass: ['snackbar-color']});

    var zip = new JSZip();
    var submissionCount: number = 0;
    var contestName: string = this.contest.ContestData.Name;
    for (var j=0; j < contestName.length; j++) {
      contestName = contestName.replace(" ","-");
    }
    var zipFilename: string = contestName + "_submissions.zip";
    var numberOfSubmissions = this.allSubmissions.length;

    this.allSubmissions.forEach(function(submission) {
      var count: number = 0;
      var i: number;
      var teamName: string = submission.TeamName;
      var folderName: string;

      for (var k=0; k < teamName.length; k++) {
        teamName = teamName.replace(" ","-");
      }
      
      if (submission.TeamName == "") {
        folderName = "individual-submission_" + submission.Members[0] + "/";
      } else {
        folderName = "team-submission_" + teamName + "/";
      }

      submission.SubmittedFiles.forEach(function(url) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            throw err; 
          }

          i = submission.SubmittedFiles.indexOf(url); // This is important as the .getBinaryContent causes the urls to be pulled out of order
          zip.file(folderName + submission.SubmittedFileNames[i], data, {binary:true});

          zip.file(
            folderName + "README.txt", 
            "Submission Name: "+submission.Name+"\n"+
            submission.Description+"\n"+
            submission.About
          );

          count++;
          if (count == submission.SubmittedFiles.length) {
            submissionCount++;
            if (submissionCount == numberOfSubmissions) {
              zip.generateAsync({type:'blob'}).then(function(content) {
                saveAs(content, zipFilename);
              });
            }
          }
        });
      });
    });
  }

  public OnSeeSubmission(submission: Submission) {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'If you leave this page you will lose your progress. Are you sure you want to leave?',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.router.navigate(['/submission/',submission.Id]);
        }
      });
  }

  public OnChooseWinner(submission: Submission) {
    let winnerDialogRef = this.dialog.open(ContestAwardSubmissionFormComponent);

    winnerDialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {
          submission.Winner = true;
          submission.WinnerType = data;

          this.currentSelection.push(submission);
        } else {
          submission.Winner = false;
          submission.WinnerType = "";

          const index = this.currentSelection.indexOf(submission, 0);
          if (index > -1) {
            this.currentSelection.splice(index, 1);
          }
        }
      });
  }

  public OnFinalizeWinners() {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to finalize these submissions as winners? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.challengesService.SelectWinnersOfContest(this.contest,this.currentSelection).subscribe(
            data => { 
              this.router.navigate(['/contest/',this.contest.ContestData.Id]);
            },
            error => {

            });
        }
      });
  }
}
