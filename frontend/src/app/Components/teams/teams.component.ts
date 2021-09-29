import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { UsersService } from 'src/app/Services/Users/users.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AutocompleteGroup } from 'src/Data/Information/AutocompleteGroups';
import { startWith, map, filter } from 'rxjs/operators';
import { _filter } from 'src/Data/Information/Filter';
import { AutocompleteSelection } from 'src/Data/Information/Autocomplete';
import { AutocompleteUser } from 'src/Data/Information/AutocompleteUser';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';
import { TeamCreationComponent } from '../team-creation/team-creation.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  
  public user: ParticipantUser;
  public dataLoaded: boolean = false;
  public teams: Team[] = [];
  public memberTeams: Team[] = [];
  public newTeam: ParticipantUser[] = [];
  public teamUsernames: string[] = [];
  public newMember: ParticipantUser;
  public searchedParticipants: ParticipantUser[] = [];
  public userGroupOptions: Observable<string[]>;
  public searchedValues: string[] = [];
  public isTeamed: boolean;
  public isMemberTeamed: boolean;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public snackBar: MatSnackBar,
    public challengesService: ChallengesService,
    public usersService: UsersService,
    public fb: FormBuilder,
  ) { 
    this.currentUser.UserLocation = "/teams";
  }

  ngOnInit() {
    if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
      this.user = this.currentUser.CurrentUserValue;
      this.usersService.GetTeamsByUsername(this.currentUser.CurrentUserValue.UserRegistrationData.Username).subscribe(
        data => {
          this.teams = data['teams'];
          this.memberTeams = data['memberTeams'];

          if (this.teams.length > 0) {
            this.isTeamed = true;
          }
          else {
            this.isTeamed = false;
          }

          if (this.memberTeams.length > 0) {
            this.isMemberTeamed = true;
          }
          else {
            this.isMemberTeamed = false;
          }

          this.dataLoaded = true;
        },
        error => {
          this.dataLoaded = true;
          this.router.navigate(['/']);
        }
      );
    } 
    
    else {
      this.router.navigate(['/']);
    }
  }
  
  public OnDeleteTeam(team: Team) {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to delete this team? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.dataLoaded = false;
          this.usersService.DeleteTeamByName(team.Name).subscribe(
            data => {},
            error => {
              this.dataLoaded = true;
            }, 
            () => this.usersService.GetTeamsByUsername(this.user.ParticipantRegistrationData.Username).subscribe(
              data => {
                this.dataLoaded = true;

                this.teams = data['teams'];
                this.memberTeams = data['memberTeams'];

                if (this.teams.length > 0) {
                  this.isTeamed = true;
                }
                else {
                  this.isTeamed = false;
                }
    
                if (this.memberTeams.length > 0) {
                  this.isMemberTeamed = true;
                }
                else {
                  this.isMemberTeamed = false;
                }
              }, 
              error => {
                this.dataLoaded = true;
              }));
              }
      },
      error => {}
    );
  }

  public OnLeaveTeam(team: Team) {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to leave this team? You cannot undo this action.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.dataLoaded = false;
          this.usersService.LeaveTeamById(team.Id,this.user.ParticipantRegistrationData.Username,team.Members).subscribe(
            data => {},
            error => {
              this.dataLoaded = true;
            }, 
            () => this.usersService.GetTeamsByUsername(this.user.ParticipantRegistrationData.Username).subscribe(
              data => {
                this.dataLoaded = true;

                this.teams = data['teams'];
                this.memberTeams = data['memberTeams'];

                if (this.teams.length > 0) {
                  this.isTeamed = true;
                }
                else {
                  this.isTeamed = false;
                }

                if (this.memberTeams.length > 0) {
                  this.isMemberTeamed = true;
                }
                else {
                  this.isMemberTeamed = false;
                }
              }, 
              error => {
                this.dataLoaded = true;
              }));
              }
            }
          );
  }

  public OnCreateTeam() {
    let teamRef = this.dialog.open(TeamCreationComponent);

    teamRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {
          // this.dataLoaded = false;
          this.usersService.GetTeamsByUsername(this.currentUser.CurrentUserValue.UserRegistrationData.Username).subscribe(
            data => {
              this.teams = data['teams'];
              this.memberTeams = data['memberTeams'];
    
              if (this.teams.length > 0) {
                this.isTeamed = true;
              }
              else {
                this.isTeamed = false;
              }
    
              if (this.memberTeams.length > 0) {
                this.isMemberTeamed = true;
              }
              else {
                this.isMemberTeamed = false;
              }
    
              this.dataLoaded = true;
            },
            error => {
              this.dataLoaded = true;
              this.router.navigate(['/']);
            }
          );
        }
      },
      error => {}
    );
  }
}
