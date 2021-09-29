import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from 'src/Data/Information/Enviroment';
import { map } from 'rxjs/operators';
import { UsersService } from '../Users/users.service';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  
  private currUserSubject: BehaviorSubject<any>;
  private currentUrl: string;
  private currentQuery: string;
  private participantUser: ParticipantUser;
  private challengeUser: ChallengeUser;

  constructor(
    private http: HttpClient,
    private userService: UsersService
  ) { 
      this.currUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    }

  public get CurrentUserValue(): any {
    if (this.currUserSubject.value == null) {
      return false;
    }
    return this.userService.StoredUserToCurrentUser(this.currUserSubject.value);
  }
  public SetCurrentUser(user: any): void {
    this.Logout();
    localStorage.setItem('currentUser',JSON.stringify(user));
    this.currUserSubject.next(user);
  }

  public Login(email: string, password: string) {
    return this.http.post<any>(`${API_URL}/login`, {"email": email, "password": password})
      .pipe(map(response => { 
        if (response[1][0].participant_profile_data != undefined) {
          this.participantUser = this.userService.HttpResponseToParticipantUser([response[1][0]])[0];
          this.participantUser.Token = response[0]['token'];
          this.SetCurrentUser(this.participantUser);
          return this.userService.HttpResponseToParticipantUser([response[1][0]])[0];
        } else if (response[1][0].participant_profile_data == undefined) {
          this.challengeUser = this.userService.HttpResponseToChallengeUser([response[1][0]])[0];
          this.challengeUser.Token = response[0]['token'];
          this.SetCurrentUser(this.challengeUser);
          return this.userService.HttpResponseToChallengeUser([response[1][0]])[0];
        }
      }));
  }

  public Logout(): void {
    localStorage.removeItem('currentUser');
    this.currUserSubject.next(null);
  }

  public set UserLocation(url: string) {
    this.currentUrl = url;
  }

  public get UserLocation(): string {
    return this.currentUrl;
  }

  public set UserSearch(query: string) {
    this.currentQuery = query;
  }
  public get UserSearch(): string {
    return this.currentQuery;
  }
}
