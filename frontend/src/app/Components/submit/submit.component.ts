import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { Router } from '@angular/router';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { UsersService } from 'src/app/Services/Users/users.service';
import { Team } from 'src/Helpers/Team/Classes/Team';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {

  public dataLoaded: boolean;
  public type: string = "Individually";
  public user: ParticipantUser;
  public teams: Team[] = [];
  public options: string[] = [];
  public selectedTeam: Team;
  
  constructor(
    public submitDialogRef: MatDialogRef<SubmitComponent>,
    public snackBar: MatSnackBar,
    public currentUser: CurrentUserService,
    public router: Router,
    public usersService: UsersService,
    
  ) {}

  ngOnInit() {   
    this.dataLoaded = false;

    if (this.currentUser.CurrentUserValue instanceof ParticipantUser) {
      this.user = this.currentUser.CurrentUserValue;
      this.usersService.GetTeamsByUsername(this.currentUser.CurrentUserValue.UserRegistrationData.Username).subscribe(
        data => {
          this.teams = data['teams'];

          this.options.push("Individually");
          for (let team of this.teams) {
            this.options.push(team.Name);
          }
          
          this.dataLoaded = true;
        },
        error => {
          this.dataLoaded = true;
          this.router.navigate(['/']);
        });
    } 
    
    else {
      this.submitDialogRef.close();
    }
  }

  public OnSubmit() {
    if (this.type == "Individually") {
      this.submitDialogRef.close({ 'teamed': false, 'team': undefined });
    } else {
      this.selectedTeam = this.teams.filter(item => item.Name == this.type)[0];
      this.submitDialogRef.close({ 'teamed': true, 'team': this.selectedTeam });
    }
  }

  public OnExit() {
    this.submitDialogRef.close();
  }

}
