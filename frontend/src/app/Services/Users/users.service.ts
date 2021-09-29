import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URL } from '../../../Data/Information/Enviroment';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ParticipantRegistrationData } from 'src/Helpers/Registration/Classes/ParticipantRegistrationData';
import { ParticipantProfileData } from 'src/Helpers/ProfileData/Classes/ParticipantProfileData';
import { ChallengerRegistrationData } from 'src/Helpers/Registration/Classes/ChallengerRegistrationData';
import { ChallengeOwnerProfileData } from 'src/Helpers/ProfileData/Classes/ChallengeOwnerProfileData';
import { map } from 'rxjs/operators';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { Submission } from 'src/Helpers/Document/Classes/Submission';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private participantUser: ParticipantUser;
  private challengeUser: ChallengeUser;
  private challengeUsers: ChallengeUser[] = [];
  private participantUsers: ParticipantUser[] = [];
  private team: Team;
  private memberTeam: Team;
  private teams: Team[];
  private memberTeams: Team[];
  private concentrations: string[] = [];
  private majors: string[] = [];
  private industries: string[] = [];
  private universities: string[] = [];
  private informationData;
  private teamData;
  private params: HttpParams;

  constructor(private http: HttpClient) { }

  // DELETE
  public Delete(id: number) {
    return this.http.delete(`${API_URL}/users/${id}`);
  }

  public UnfollowChallenge(challengeId: number, followerId: number) {
    return this.http.delete(`${API_URL}/user-${followerId}/unfollow/challenge-${challengeId}`);
  }

  public UnregisterFromChallenge(challengeId: number, userId: number) {
    return this.http.delete(`${API_URL}/user-${userId}/unregister/challenge-${challengeId}`)
  }

  public UnfollowUser(userId: number, followerId: number) {
    return this.http.delete(`${API_URL}/user-${followerId}/unfollow/user-${userId}`);
  }

  public UnfavoriteSubmission(submissionId: number, followerId: number) {
    return this.http.delete(`${API_URL}/user-${followerId}/unfavorite/submission-${submissionId}`);
  }

  public DeleteTeamByName(name: string) {
    return this.http.delete(`${API_URL}/team-${name}/delete`);
  }

  public DeleteDepartment(department: ChallengeUser) {
    return this.http.delete(`${API_URL}/departments/${department.UserRegistrationData.Username}/delete`);
  }

  public DeleteSubmission(submission: Submission) {
    return this.http.delete(`${API_URL}/submission-${submission.Id}/delete`);
  }

  // GET
  public GetFollowingStatistics(id: number) {
    return this.http.get(`${API_URL}/user-${id}/following-statistics`)
    .pipe(map(response => {
      return response;
    }));
  }
  
  public SearchParticipantUsers(
    query?: string, 
    major?: string, 
    educationStatus?: string, 
    travelAvailability?: string, 
    university?: string, 
    city?: string,
    state?: string,
    concentrations?: string[]) 
  {
    
    this.params = new HttpParams();

    if (query) { this.params = this.params.append('query', query); }
    if (major) { this.params = this.params.append('major', major); }
    if (educationStatus) { this.params = this.params.append('educationStatus', educationStatus); }
    if (travelAvailability) { this.params = this.params.append('travelAvailability', travelAvailability); }
    if (university) { this.params = this.params.append('university', university); }
    if (city) { this.params = this.params.append('city', city); }
    if (state) { this.params = this.params.append('state', state); }
    if (concentrations) {
      if (concentrations[0]) { this.params = this.params.append('concentration1', concentrations[0]); }
      if (concentrations[1]) { this.params = this.params.append('concentration2', concentrations[1]); }
      if (concentrations[2]) { this.params = this.params.append('concentration3', concentrations[2]); }
    }

    return this.http.get(`${API_URL}/participant-users/search`, { params: this.params })
    .pipe(map(response => {
      return this.HttpResponseToParticipantUser(response);
    }));
  }

  public SearchChallengeUsers(
    query?: string, 
    industry?: string, 
    city?: string,
    state?: string) 
  {
    
    this.params = new HttpParams();

    if (query) { this.params = this.params.append('query', query); }
    if (industry) { this.params = this.params.append('industry', industry); }
    if (city) { this.params = this.params.append('city', city); }
    if (state) { this.params = this.params.append('state', state); }
    
    return this.http.get(`${API_URL}/challenge-users/search`, { params: this.params })
    .pipe(map(response => {
      return this.HttpResponseToChallengeUser(response);
    }));
  }

  public IsUserFollowingChallenge(challengeId: number, followerId: number) {
    return this.http.get(`${API_URL}/user-${followerId}/following/challenge-${challengeId}`)
    .pipe(map(response => {
      return response;
    }));
  }

  public HasUserRegisteredForChallenge(challengeId: number, userId: number) {
    return this.http.get(`${API_URL}/user-${userId}/registered/challenge-${challengeId}`)
    .pipe(map(response => {
      return response;
    }))
  }

  public IsUserFollowingUser(userId: number, followerId: number) {
    return this.http.get(`${API_URL}/user-${followerId}/following/user-${userId}`)
    .pipe(map(response => {
      return response;
    }));
  }

  public HasUserFavoritedSubmission(submissionId: number, followerId: number) {
    return this.http.get(`${API_URL}/user-${followerId}/favoriting/submission-${submissionId}`)
    .pipe(map(response => {
      return response;
    }));
  }
  // TODO: remove username from URL in the request
  public GetTeamsByUsername(username: string) {
    return this.http.get(`${API_URL}/teams/${username}`)
    .pipe(map(response => { 
      return this.HttpResponseToTeam(response);
    }));
  }

  public GetAllParticipantUsers() {
    return this.http.get(`${API_URL}/participant-users`)
    .pipe(map(response => { 
      return this.HttpResponseToParticipantUser(response);
    }));
  }

  public GetAllChallengeUsers() {
    return this.http.get(`${API_URL}/challenge-users`)
    .pipe(map(response => { 
      return this.HttpResponseToChallengeUser(response);
    }));
  }
  // TODO: remove username from URL in the request
  public GetByChallengerUsername(username: string) {
    return this.http.get(`${API_URL}/users/${username}`)
    .pipe(map(response => { 
      return this.HttpResponseToChallengeUser([response[0]])[0];
    }));
  }
  // TODO: remove username from URL in the request
  public GetByParticipantUsername(username: string) {
    return this.http.get(`${API_URL}/users/${username}`)
    .pipe(map(response => { 
      return this.HttpResponseToParticipantUser([response[0]])[0];
    }));
  }

  public GetDepartments(user: ChallengeUser) {
    var userId;
    if (user.OrganizationLead==true) {
      userId = user.UserId;
    } else {
      userId = user.LeaderId;
    }
    
    return this.http.get(`${API_URL}/departments/lead-${userId}`)
    .pipe(map(response => {
      return this.HttpResponseToChallengeUser(response);
    }));
  }

  public GetData() {
    return this.http.get(`${API_URL}/data`)
    .pipe(map(response => {
      return this.HttpResponseToData(response);
    }));
  }

  // PUT
  // TODO: remove username from URL in the request
  public UpdateParticipantUser(user: ParticipantUser) {
    return this.http.put<any>(`${API_URL}/participant-users/update/${user.UserRegistrationData.Username}`, JSON.stringify({"registration": user.ParticipantRegistrationData, "profile": user.ParticipantProfileData}));
  }
  // TODO: remove username from URL in the request
  public UpdateChallengeUser(user: ChallengeUser) {
    return this.http.put<any>(`${API_URL}/challenge-users/update/${user.UserRegistrationData.Username}`, JSON.stringify({"registration": user.ChallengerRegistrationData, "profile": user.ChallengeOwnerProfileData}));
  }
  // TODO: remove username from URL in the request
  public UpdateParticipantUserPassword(oldPassword:string, newPassword:string, username:string) {
    return this.http.put<any>(`${API_URL}/users/update/${username}/password`, JSON.stringify({"old_password": oldPassword, "new_password": newPassword}))
    .pipe(map(response => { 
      return response['token'];
    }));
  }
  // TODO: remove username from URL in the request
  public UpdateChallengeUserPassword(oldPassword:string, newPassword:string, username:string) {
    return this.http.put<any>(`${API_URL}/users/update/${username}/password`, JSON.stringify({"old_password": oldPassword, "new_password": newPassword}))
    .pipe(map(response => { 
      return response['token'];
    }));
  }
  // TODO: remove username from URL in the request
  public UpdateProfileImage(username: string, image: string) {
    return this.http.put<any>(`${API_URL}/users/${username}/photo`,JSON.stringify({"photo": image}))
    .pipe(map(response => {
      return response['photo'];
    }));
  }
  // TODO: remove username from URL in the request
  public UpdateDepartment(department: ChallengeUser) {
    return this.http.put(`${API_URL}/departments/update/${department.UserRegistrationData.Username}`, JSON.stringify({"department": department}));
  }
  // TODO: remove username from URL in the request
  public UpdateDepartmentPassword(department: ChallengeUser, password: string) {
    return this.http.put(`${API_URL}/departments/update/${department.UserRegistrationData.Username}/password`, JSON.stringify({"department": department, "password":password}));
  }

  public LeaveTeamById(teamId: number, username: string, members: string[]) {
    return this.http.put(`${API_URL}/leave/team-${teamId}`, JSON.stringify({"username": username, "members": members}));
  }

  public SubmitFilesToContestAsTeam(submission: Submission) {
    return this.http.put(`${API_URL}/submit/contest-${submission.ChallengeId}/team-${submission.TeamId}`,JSON.stringify(submission));
  }

  public SubmitFilesToContractAsTeam(submission: Submission) {
    return this.http.put(`${API_URL}/submit/contract-${submission.ChallengeId}/team-${submission.TeamId}`,JSON.stringify(submission));
  }

  public SubmitFilesToContest(submission: Submission) {
    return this.http.put(`${API_URL}/submit/contest-${submission.ChallengeId}/user-${submission.FollowerId}`,JSON.stringify(submission));
  }
  
  public SubmitFilesToContract(submission: Submission) {
    return this.http.put(`${API_URL}/submit/contract-${submission.ChallengeId}/user-${submission.FollowerId}`,JSON.stringify(submission));
  }

  // POST

  public InitializeChallengeSubmission(challengeId: number, userId: number, challengeType: string, teamId?: number) {
    var team;
    if (teamId) { team = teamId; }
    else { team = false; }

    return this.http.post(`${API_URL}/initialize-challenge-submission`,JSON.stringify({'challenge_id': challengeId, 'user_id': userId, 'challenge_type': challengeType,'team_id': team}))
    .pipe(map(response => {
      return response['id'];
    }));
  }

  public FollowChallenge(challengeId: number, followerId: number) {
    return this.http.post(`${API_URL}/follow/challenge-${challengeId}`,JSON.stringify({"follower_id": followerId}));
  }

  public RegisterForChallenge(challengeId: number, userId: number) {
    return this.http.post(`${API_URL}/register/challenge-${challengeId}`,JSON.stringify({"user_id": userId}));
  }

  public FollowUser(userId: number, followerId: number) {
    return this.http.post(`${API_URL}/follow/user-${userId}`,JSON.stringify({"follower_id": followerId}));
  }

  public FavoriteSubmission(submissionId: number, followerId: number) {
    return this.http.post(`${API_URL}/favorite/submission-${submissionId}`,JSON.stringify({"follower_id": followerId}));
  }

  public RegisterParticipantUser(user: ParticipantUser, image: string) {
    return this.http.post(`${API_URL}/participant-users/register`,JSON.stringify({"registration": user.ParticipantRegistrationData, "profile": user.ParticipantProfileData, "photo": image}));
  }

  public RegisterChallengeUser(user: ChallengeUser, image: string) {
    return this.http.post(`${API_URL}/challenge-users/register`,JSON.stringify({"registration": user.ChallengerRegistrationData, "profile": user.ChallengeOwnerProfileData, "photo": image}));
  }

  public CreateNewTeam(teamLeader: ParticipantUser, members: string[], name: string) {
    return this.http.post(`${API_URL}/team/register`,JSON.stringify({'leader':teamLeader.ParticipantRegistrationData.Username, 'members':members, 'name': name}));
  }

  public CreateDepartment(department: ChallengeUser, departmentLead: ChallengeUser) {
    return this.http.post(`${API_URL}/department/register`,JSON.stringify({ 'name': department.Department, 'registration': department.ChallengerRegistrationData, 'profile':department.ChallengeOwnerProfileData, 'leaderId': departmentLead.UserId }));
  }

  public CreateIndustry(industry: string) {
    return this.http.post(`${API_URL}/data/industry`, JSON.stringify({'industry':industry}));
  }

  public CreateConcentration(concentration: string) {
    return this.http.post(`${API_URL}/data/concentration`, JSON.stringify({'concentration':concentration}));
  }

  public CreateUniversity(university: string) {
    return this.http.post(`${API_URL}/data/university`, JSON.stringify({'university':university}));
  }
  
  public CreateMajor(major: string) {
    return this.http.post(`${API_URL}/data/major`, JSON.stringify({'major':major}));
  }

  public ReportIssue(issue: string, email: string) {
    return this.http.post(`${API_URL}/report`, JSON.stringify({'issue':issue, 'email':email}));
  }

  // Gets a user response from the backend and turns it into a user object
  public HttpResponseToParticipantUser(data: any): ParticipantUser[] {
    this.participantUsers = [];
    for (var i = 0; i != (Object.keys(data).length); i++) {
      if (data[i].email != undefined) {
        this.participantUser = new ParticipantUser(new ParticipantRegistrationData(
          data[i].first_name.concat(" ").concat(data[i].last_name),
          data[i].username,
          data[i].email,
          data[i].university,
          "",
          new Date()
        ));

        this.participantUser.ParticipantProfileData = new ParticipantProfileData(
          data[i].participant_profile_data[0].phone,
          data[i].participant_profile_data[0].address,
          data[i].participant_profile_data[0].city,
          data[i].participant_profile_data[0].state,
          data[i].participant_profile_data[0].postal_code,
          data[i].participant_profile_data[0].education_status,
          data[i].participant_profile_data[0].enrollment_status,
          data[i].participant_profile_data[0].major,
          data[i].participant_profile_data[0].travel_availability,
          data[i].participant_profile_data[0].concentration,
          data[i].participant_profile_data[0].description,
          data[i].participant_profile_data[0].about,
          data[i].participant_profile_data[0].linkedin,
          data[i].participant_profile_data[0].photo,
          data[i].participant_profile_data[0].website
        );

        this.participantUser.ParticipantProfileData.Banner = data[i].participant_profile_data[0].banner;
        this.participantUser.UserId = data[i].parent_id;
        this.participantUser.CreatedAt = new Date(data[i].created_at);
        this.participantUser.UpdatedAt = new Date(data[i].updated_at);
        this.participantUser.LastUpdatedBy = data[i].last_updated_by;
        
        this.participantUsers[i] = this.participantUser;
      } 
      
      else {
        this.participantUser = new ParticipantUser(new ParticipantRegistrationData(
          data[i].first_name.concat(" ").concat(data[i].last_name),
          data[i].username,
          "",
          data[i].university,
          "",
          new Date()
        ));

        this.participantUser.ParticipantProfileData = new ParticipantProfileData(
          0,
          "",
          data[i].participant_profile_data[0].city,
          data[i].participant_profile_data[0].state,
          data[i].participant_profile_data[0].postal_code,
          data[i].participant_profile_data[0].education_status,
          data[i].participant_profile_data[0].enrollment_status,
          data[i].participant_profile_data[0].major,
          data[i].participant_profile_data[0].travel_availability,
          data[i].participant_profile_data[0].concentration,
          data[i].participant_profile_data[0].description,
          data[i].participant_profile_data[0].about,
          data[i].participant_profile_data[0].linkedin,
          data[i].participant_profile_data[0].photo,
          data[i].participant_profile_data[0].website
        );
        
        this.participantUser.ParticipantProfileData.Banner = data[i].participant_profile_data[0].banner;
        this.participantUser.UserId = data[i].parent_id;
        this.participantUser.CreatedAt = new Date(data[i].created_at);
        this.participantUser.UpdatedAt = new Date(data[i].updated_at);
        this.participantUser.LastUpdatedBy = data[i].last_updated_by;

        this.participantUsers[i] = this.participantUser;
      }
    }
    return this.participantUsers;
  }

  public HttpResponseToChallengeUser(data: any): ChallengeUser[] {
    this.challengeUsers = [];
    for (var i = 0; i != Object.keys(data).length; i++) {
      if (data[i].email != undefined) {
        this.challengeUser = new ChallengeUser(new ChallengerRegistrationData(
          data[i].first_name.concat(" ").concat(data[i].last_name),
          data[i].poc_first_name.concat(" ").concat(data[i].poc_last_name),
          data[i].poc_phone,
          data[i].username,
          "",
          data[i].email
        ));

        this.challengeUser.ChallengeOwnerProfileData = new ChallengeOwnerProfileData(
          data[i].challenge_owner_profile_data[0].address,
          data[i].challenge_owner_profile_data[0].city,
          data[i].challenge_owner_profile_data[0].state,
          data[i].challenge_owner_profile_data[0].postal_code,
          data[i].challenge_owner_profile_data[0].description,
          data[i].challenge_owner_profile_data[0].about,
          data[i].challenge_owner_profile_data[0].linkedin,
          data[i].challenge_owner_profile_data[0].photo,
          data[i].challenge_owner_profile_data[0].website,
          data[i].challenge_owner_profile_data[0].industry
        );

        this.challengeUser.ChallengeOwnerProfileData.Banner = data[i].challenge_owner_profile_data[0].banner;
        this.challengeUser.UserId = data[i].parent_id;
        this.challengeUser.CreatedAt = new Date(data[i].created_at);
        this.challengeUser.UpdatedAt = new Date(data[i].updated_at);
        this.challengeUser.LastUpdatedBy = data[i].last_updated_by;
        this.challengeUser.OrganizationLead = data[i].org_lead;
        this.challengeUser.Department = data[i].department;
        this.challengeUser.LeaderId = data[i].lead_id;
        
        this.challengeUsers[i] = this.challengeUser;
      } 
      
      else {
        this.challengeUser = new ChallengeUser(new ChallengerRegistrationData(
          data[i].first_name.concat(" ").concat(data[i].last_name),
          "",
          0,
          data[i].username,
          "",
          ""
        ));

        this.challengeUser.ChallengeOwnerProfileData = new ChallengeOwnerProfileData(
          data[i].challenge_owner_profile_data[0].address,
          data[i].challenge_owner_profile_data[0].city,
          data[i].challenge_owner_profile_data[0].state,
          data[i].challenge_owner_profile_data[0].postal_code,
          data[i].challenge_owner_profile_data[0].description,
          data[i].challenge_owner_profile_data[0].about,
          data[i].challenge_owner_profile_data[0].linkedin,
          data[i].challenge_owner_profile_data[0].photo,
          data[i].challenge_owner_profile_data[0].website,
          data[i].challenge_owner_profile_data[0].industry
        );
        
        this.challengeUser.ChallengeOwnerProfileData.Banner = data[i].challenge_owner_profile_data[0].banner;
        this.challengeUser.UserId = data[i].parent_id;
        this.challengeUser.CreatedAt = new Date(data[i].created_at);
        this.challengeUser.UpdatedAt = new Date(data[i].updated_at);
        this.challengeUser.LastUpdatedBy = data[i].last_updated_by;
        this.challengeUser.OrganizationLead = data[i].org_lead;
        this.challengeUser.Department = data[i].department;
        this.challengeUser.LeaderId = data[i].lead_id;

        this.challengeUsers[i] = this.challengeUser;
      }
    }
    return this.challengeUsers;
  }

  public HttpResponseToData(response: any): any {
    this.informationData = [];

    this.concentrations = [];
    this.majors = [];
    this.universities = [];
    this.industries = [];

    for (var i=0; i != Object.keys(response['concentrations']).length; i++) {
      this.concentrations[i] = response['concentrations'][i]['concentration'];
    }

    for (var i=0; i != Object.keys(response['majors']).length; i++) {
      this.majors[i] = response['majors'][i]['major'];
    }

    for (var i=0; i != Object.keys(response['universities']).length; i++) {
      this.universities[i] = response['universities'][i]['university'];
    }

    for (var i=0; i != Object.keys(response['industries']).length; i++) {
      this.industries[i] = response['industries'][i]['industry'];
    }

    this.informationData['concentrations'] = this.concentrations;
    this.informationData['majors'] = this.majors;
    this.informationData['universities'] = this.universities;
    this.informationData['industries'] = this.industries;

    return this.informationData;

  }

  // Turns the stored stringified User Object back into a User Object
  public StoredUserToCurrentUser(object: any): any {
    if (object.participantRegistrationData != undefined) {
      this.participantUser = new ParticipantUser(new ParticipantRegistrationData(
        object.participantRegistrationData.firstName.concat(" ").concat(object.participantRegistrationData.lastName),
        object.participantRegistrationData.username,
        object.participantRegistrationData.email,
        object.participantRegistrationData.university,
        object.participantRegistrationData.password,
        new Date()
      ));

      this.participantUser.ParticipantProfileData = new ParticipantProfileData(
        object.participantProfileData.phone,
        object.participantProfileData.address,
        object.participantProfileData.city,
        object.participantProfileData.state,
        object.participantProfileData.postalCode,
        object.participantProfileData.educationStatus,
        object.participantProfileData.enrollmentStatus,
        object.participantProfileData.major,
        object.participantProfileData.travelAvailability,
        object.participantProfileData.concentration,
        object.participantProfileData.description,
        object.participantProfileData.about,
        object.participantProfileData.linkedin,
        object.participantProfileData.photo,
        object.participantProfileData.website
      );
      
      this.participantUser.ParticipantProfileData.Banner = object.participantProfileData.banner;
      this.participantUser.Token = object.token;
      this.participantUser.UserId = object.userId;
      this.participantUser.CreatedAt = object.createdAt;
      this.participantUser.UpdatedAt = object.updatedAt;
      this.participantUser.LastUpdatedBy = object.lastUpdatedBy;

      return this.participantUser;
    }

    else if (object.challengerRegistrationData != undefined) {
      this.challengeUser = new ChallengeUser(new ChallengerRegistrationData(
        object.challengerRegistrationData.firstName.concat(" ").concat(object.challengerRegistrationData.lastName),
        object.challengerRegistrationData.pocFirstName.concat(" ").concat(object.challengerRegistrationData.pocLastName),
        object.challengerRegistrationData.pocPhone,
        object.challengerRegistrationData.username,
        object.challengerRegistrationData.password,
        object.challengerRegistrationData.email
      ));

      this.challengeUser.ChallengeOwnerProfileData = new ChallengeOwnerProfileData(
        object.challengeOwnerProfileData.address,
        object.challengeOwnerProfileData.city,
        object.challengeOwnerProfileData.state,
        object.challengeOwnerProfileData.postalCode,
        object.challengeOwnerProfileData.description,
        object.challengeOwnerProfileData.about,
        object.challengeOwnerProfileData.linkedin,
        object.challengeOwnerProfileData.photo,
        object.challengeOwnerProfileData.website,
        object.challengeOwnerProfileData.industry
      );

      this.challengeUser.ChallengeOwnerProfileData.Banner = object.challengeOwnerProfileData.banner;
      this.challengeUser.Token = object.token;
      this.challengeUser.UserId = object.userId;
      this.challengeUser.CreatedAt = object.createdAt;
      this.challengeUser.UpdatedAt = object.updatedAt;
      this.challengeUser.LastUpdatedBy = object.lastUpdatedBy;
      this.challengeUser.Department = object.department;
      this.challengeUser.OrganizationLead = object.organizationLead;
      this.challengeUser.LeaderId = object.leaderId;

      return this.challengeUser;
    }

    else {
      return false;
    }
  }

  public HttpResponseToTeam(data): Team[] {
    this.teamData = [];

    this.memberTeams = [];
    this.teams = [];

    for (var i = 0; i != (Object.keys(data['teams']).length); i++) {
      this.team = new Team(data['teams'][i].name, data['teams'][i].leader, data['teams'][i].members);

      this.team.Id = data['teams'][i].id;
      this.team.Challenges = data['teams'][i].challenges;
      this.team.CreatedAt = new Date(data['teams'][i].created_at);
      this.team.LastUpdatedBy = data['teams'][i].last_updated_by;
      this.team.UpdatedAt = new Date(data['teams'][i].updated_at);

      this.teams[i] = this.team;
    }

    for (var i = 0; i != (Object.keys(data['member_teams']).length); i++) {
      this.memberTeam = new Team(data['member_teams'][i].name, data['member_teams'][i].leader, data['member_teams'][i].members);

      this.memberTeam.Id = data['member_teams'][i].id;
      this.memberTeam.Challenges = data['member_teams'][i].challenges;
      this.memberTeam.CreatedAt = new Date(data['member_teams'][i].created_at);
      this.memberTeam.LastUpdatedBy = data['member_teams'][i].last_updated_by;
      this.memberTeam.UpdatedAt = new Date(data['member_teams'][i].updated_at);

      this.memberTeams[i] = this.memberTeam;
    }

    this.teamData['teams'] = this.teams;
    this.teamData['memberTeams'] = this.memberTeams;

    return this.teamData;
  }
}
