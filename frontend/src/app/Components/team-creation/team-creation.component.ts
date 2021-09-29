import { Component, OnInit } from '@angular/core';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengesService } from 'src/app/Services/Challenges/challenges.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-team-creation',
  templateUrl: './team-creation.component.html',
  styleUrls: ['./team-creation.component.css']
})
export class TeamCreationComponent implements OnInit {

  public user: ParticipantUser;
  public dataLoaded: boolean = false;
  public newMemberForm: FormGroup;
  public newTeamForm: FormGroup;
  public teams: Team[] = [];
  public memberTeams: Team[] = [];
  public newTeam: ParticipantUser[] = [];
  public teamUsernames: string[] = [];
  public newMember: ParticipantUser;
  public searchedParticipants: ParticipantUser[] = [];
  public userGroupOptions: Observable<string[]>;
  public searchedValues: string[] = [];

  constructor(
    public teamRef: MatDialogRef<TeamCreationComponent>,
    public router: Router,
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public snackBar: MatSnackBar,
    public challengesService: ChallengesService,
    public usersService: UsersService,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
      this.user = this.currentUser.CurrentUserValue;
    }
    else {
      this.router.navigate(['/']);
    }
    this.newMemberForm = this.fb.group({
      newMember: ['', [Validators.required]]
    });

    this.newTeamForm = this.fb.group({
      teamName: ['', [Validators.required]]
    });

    this.userGroupOptions = this.newMemberForm.get('newMember')!.valueChanges.pipe(startWith(''),map(value => this._filterGroupUser(value)));

    this.usersService.GetAllParticipantUsers().subscribe(
      users => {
        this.searchedParticipants = users;
        var i = 0;
        
        for (let user of this.searchedParticipants){
          if (user.ParticipantRegistrationData.Username != this.user.ParticipantRegistrationData.Username) {
            this.searchedValues[i] = user.ParticipantRegistrationData.FirstName+" "+user.ParticipantRegistrationData.LastName+" ("+user.ParticipantRegistrationData.Username+")";
            i++;
          }
        }
        
        this.newTeam.push(this.user);
      }, error => {
        this.router.navigate(['/']);
      },
      () => this.usersService.GetTeamsByUsername(this.currentUser.CurrentUserValue.UserRegistrationData.Username).subscribe(
        data => {
          this.teams = data['teams'];
          this.memberTeams = data['memberTeams'];
          this.dataLoaded = true;
        },
        error => {
          this.dataLoaded = true;
          this.router.navigate(['/']);
        }
      )
    );
  }

  public _filterGroupUser(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.searchedValues.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }

    return this.searchedValues;
  }

  public OnAddNewMember(form: NgForm) {
    this.newMember = this.searchedParticipants.filter(item => item.ParticipantRegistrationData.Username == this.newMemberForm.get('newMember').value.split('(')[1].split(')')[0])[0];
    form.resetForm();
    
    if (this.FindUser(this.newTeam, this.newMember) == this.newMember) {
      this.snackBar.open("You already added this person to your team.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
    } 
    
    else {
      this.newTeam.push(this.newMember);
    }
  }

  public OnSubmitTeam(form: NgForm) {
    if (this.newTeam.length > 1) {
      for (let user of this.newTeam) {
        this.teamUsernames.push(user.ParticipantRegistrationData.Username);
      }
      this.usersService.CreateNewTeam(this.user, this.teamUsernames, this.newTeamForm.get('teamName').value).subscribe(
        data => {
          this.newTeam = [];
          this.teamUsernames = [];

          this.teams.push(new Team(this.newTeamForm.get('teamName').value,this.user.ParticipantRegistrationData.Username,this.teamUsernames));
          
          this.snackBar.open("Team successfully created.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          this.teamRef.close(this.teams);
        },
        error => {
          this.snackBar.open("Something went wrong.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
          this.dataLoaded = true;
        }
      );
    }
  }

  public FindUser(users: ParticipantUser[], user: ParticipantUser) {
    return users.find( ({ ParticipantRegistrationData }) => ParticipantRegistrationData === user.ParticipantRegistrationData);
  }

  public OnRemoveFromTeam(member: ParticipantUser) {
    var i = this.newTeam.indexOf(member);
    
    if (i !== -1) {
      this.newTeam.splice(i,1);
    }
  }

  public OnSeeProfile(member: ParticipantUser) {
    this.router.navigate(['/profile/', member.UserRegistrationData.Username]);
  }

  public OnExit() {
    this.teamRef.close();
  }
}
