import { Injectable } from '@angular/core';
import { IContract } from 'src/Helpers/Challenge/Interfaces/IContract';
import { IContest } from 'src/Helpers/Challenge/Interfaces/IContest';
import { IOwnerChallengeUser } from 'src/Helpers/Users/Interfaces/IOwnerChallengeUser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from 'src/Data/Information/Enviroment';
import { Contest } from 'src/Helpers/Challenge/Classes/Contest';
import { Contract } from 'src/Helpers/Challenge/Classes/Contract';
import { map } from 'rxjs/operators';
import { ContestData } from 'src/Helpers/ChallengeData/Classes/ContestData';
import { ChallengeCreateData } from 'src/Helpers/ChallengeData/Classes/ChallengeCreateData';
import { UsersService } from '../Users/users.service';
import { ContractData } from 'src/Helpers/ChallengeData/Classes/ContractData';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';
import { Submission } from 'src/Helpers/Document/Classes/Submission';
import { Team } from 'src/Helpers/Team/Classes/Team';
import { Challenge } from 'src/Helpers/Challenge/Classes/Challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  private contest: Contest;
  private contests: Contest[] = [];
  private contract: Contract;
  private contracts: Contract[] = [];
  private submission: Submission;
  private submissions: Submission[] = [];
  private team: Team;
  private participant: ParticipantUser;
  private user: IOwnerChallengeUser;
  private params: HttpParams;

  constructor(
    private http: HttpClient,
    private usersService: UsersService) { }


  // DELETE

  // GET
  public GetSubmissionFavoriteStatistics(id: number) {
    return this.http.get(`${API_URL}/submission-${id}/favorite-statistics`)
    .pipe(map(response => {
      return response;
    }));
  }

  public GetNumberFollowingAndSubmittedToChallenge(id: number) {
    return this.http.get(`${API_URL}/challenge-${id}/follower-statistics`)
    .pipe(map(response => {
      return response;
    }));
  }

  public GetNumberRegisteredForChallenge(id: number) {
    return this.http.get(`${API_URL}/challenge-${id}/registration-statistics`)
    .pipe(map(response => {
      return response['count'];
    }));
  }

  public GetParticipantSubmissions(id: number, submitted: boolean, challengeType?: string) {
    this.params = new HttpParams();
    this.params = this.params.append('complete', submitted.toString());
    
    if (challengeType) { this.params = this.params.append('challenge_type', challengeType); }

    return this.http.get(`${API_URL}/submissions/user-${id}`, { params: this.params })
    .pipe(map(response => {
      return this.HttpResponseToSubmissions(response);
    }));
  }

  public GetSubmissionById(id: number) {
    return this.http.get(`${API_URL}/submissions/id-${id}`)
    .pipe(map(response => {
      return this.HttpResponseToSubmissions(response);
    }));
  }

  public GetAllSubmissions(id: number) {
    return this.http.get(`${API_URL}/submissions/challenge-${id}`)
    .pipe(map(response => {
      return this.HttpResponseToSubmissions(response);
    }));
  }

  public GetChallengeWinners(id: number) {
    return this.http.get(`${API_URL}/winners/challenge-${id}`)
    .pipe(map(response => {
      return this.HttpResponseToSubmissions(response);
    }));
  }

  public GetAllContests() {
    return this.http.get(`${API_URL}/contests`)
    .pipe(map(response => {
      return this.HttpResponseToContest(response);
    }));
  }
  
  public GetAllContracts() {
    return this.http.get(`${API_URL}/contracts`)
    .pipe(map(response => {
      return this.HttpResponseToContract(response);
    }));
  }

  public SearchContests(
    query?: string, 
    complete?: boolean,
    registered?: boolean,
    submitted?: boolean,
    ownerUsername?: string, 
    followerUsername?: string, 
    prizeMin?: number, 
    prizeMax?: number, 
    startDate?: Date, 
    endDate?: Date, 
    concentrations?: string[]) 
  {
    
    this.params = new HttpParams();

    if (query) { this.params = this.params.append('query', query); }
    if (ownerUsername) { this.params = this.params.append('owner', ownerUsername); }
    if (followerUsername) { this.params = this.params.append('follower', followerUsername); }
    if (prizeMin) { this.params = this.params.append('prizeMin', prizeMin.toString()); }
    if (prizeMax) { this.params = this.params.append('prizeMax', prizeMax.toString()); }
    if (startDate) { this.params = this.params.append('startDate', startDate.toUTCString()); }
    if (endDate) { this.params = this.params.append('endDate', endDate.toUTCString()); }
    if (concentrations) {
      if (concentrations[0]) { this.params = this.params.append('concentration1', concentrations[0]); }
      if (concentrations[1]) { this.params = this.params.append('concentration2', concentrations[1]); }
      if (concentrations[2]) { this.params = this.params.append('concentration3', concentrations[2]); }
    }
    if (complete != undefined) { this.params = this.params.append('complete', complete.toString()); }
    if (submitted != undefined) { this.params = this.params.append('submitted', submitted.toString()); }
    if (registered != undefined) { this.params = this.params.append('registered', registered.toString()); }

    return this.http.get(`${API_URL}/contests/search`, { params: this.params })
    .pipe(map(response => {
      return this.HttpResponseToContest(response);
    }));
  }

  public SearchContracts(
    query?: string, 
    complete?: boolean,
    submitted?: boolean,
    ownerUsername?: string, 
    followerUsername?: string, 
    prizeMin?: number, 
    prizeMax?: number, 
    startDate?: Date, 
    endDate?: Date, 
    concentrations?: string[]) 
  {
    
    this.params = new HttpParams();

    if (query) { this.params = this.params.append('query', query); }
    if (ownerUsername) { this.params = this.params.append('owner', ownerUsername); }
    if (followerUsername) { this.params = this.params.append('follower', followerUsername); }
    if (prizeMin) { this.params = this.params.append('prizeMin', prizeMin.toString()); }
    if (prizeMax) { this.params = this.params.append('prizeMax', prizeMax.toString()); }
    if (startDate) { this.params = this.params.append('startDate', startDate.toUTCString()); }
    if (endDate) { this.params = this.params.append('endDate', endDate.toUTCString()); }
    if (concentrations) {
      if (concentrations[0]) { this.params = this.params.append('concentration1', concentrations[0]); }
      if (concentrations[1]) { this.params = this.params.append('concentration2', concentrations[1]); }
      if (concentrations[2]) { this.params = this.params.append('concentration3', concentrations[2]); }
    }
    if (complete != undefined) { this.params = this.params.append('complete', complete.toString()); }
    if (submitted != undefined) { this.params = this.params.append('submitted', submitted.toString()); }

    return this.http.get(`${API_URL}/contracts/search`, { params: this.params })
    .pipe(map(response => {
      return this.HttpResponseToContract(response);
    }));
  }

  public GetContestById(id: number) {
    return this.http.get(`${API_URL}/challenges/${id}`)
    .pipe(map(response => {
      return this.HttpResponseToContest([response[0]])[0];
    }));
  }

  public GetContractById(id: number) {
    return this.http.get(`${API_URL}/challenges/${id}`)
    .pipe(map(response => { 
      return this.HttpResponseToContract([response[0]])[0];
    }));
  }

  public GetContestsByOwner(username: string) {
    return this.http.get(`${API_URL}/contests/owner-${username}`)
    .pipe(map(response => { 
      return this.HttpResponseToContest(response);
    }));
  }

  public GetClosedContestsByOwner(username: string) {
    return this.http.get(`${API_URL}/contests/owner-${username}/closed`)
    .pipe(map(response => { 
      return this.HttpResponseToContest(response);
    }));
  }

  public GetContractsByOwner(username: string) {
    return this.http.get(`${API_URL}/contracts/owner-${username}`)
    .pipe(map(response => {
      return this.HttpResponseToContract(response);
    }));
  }

  public GetClosedContractsByOwner(username: string) {
    return this.http.get(`${API_URL}/contracts/owner-${username}/closed`)
    .pipe(map(response => {
      return this.HttpResponseToContract(response);
    }));
  }

  public GetChallengesByFollower(id: number) {
    return this.http.get(`${API_URL}/challenges/follower-${id}`)
    .pipe(map(response => { 
      return {'contests': this.HttpResponseToContest(response['contests']), 'contracts': this.HttpResponseToContract(response['contracts'])};
    }));
  }

  public GetChallengesUserIsRegisteredFor(id: number) {
    return this.http.get(`${API_URL}/challenges-registered/user-${id}`)
    .pipe(map(response => { 
      return {'contests': this.HttpResponseToContest(response['contests']), 'contracts': this.HttpResponseToContract(response['contracts'])};
    }));
  }

  public GetChallengesByOwner(username: string) {
    return this.http.get(`${API_URL}/challenges/owner-${username}`)
    .pipe(map(response => { 
      return {'contests': this.HttpResponseToContest(response['contests']), 'contracts': this.HttpResponseToContract(response['contracts']), 'closed_contests': this.HttpResponseToContest(response['closed_contests']), 'closed_contracts': this.HttpResponseToContract(response['closed_contracts']), 'departments_contests': this.HttpResponseToContest(response['departments_contests']), 'departments_contracts': this.HttpResponseToContract(response['departments_contracts']), 'departments_closed_contests': this.HttpResponseToContest(response['departments_closed_contests']), 'departments_closed_contracts': this.HttpResponseToContract(response['departments_closed_contracts'])};
    }));
  }

  public GetCompletedChallengesByFollower(id: number) {
    return this.http.get(`${API_URL}/challenges/follower-${id}/completed`)
    .pipe(map(response => { 
      return {'contests': this.HttpResponseToContest(response['contests']), 'contracts': this.HttpResponseToContract(response['contracts'])};
    }));
  }

  public CloseContest(contest: Contest) {
    return this.http.get<boolean>(`${API_URL}/contest/close/${contest.ContestData.Id}`)
    .pipe(map(response => {
      return response['closed'];
    }));
  }

  public CloseContract(contract: Contract) {
    return this.http.get<boolean>(`${API_URL}/contract/close/${contract.ContractData.Id}`)
    .pipe(map(response => {
      return response['closed'];
    }));
  }

  public CloseChallengeWithoutWinners(challenge: Challenge) {
    return this.http.get<boolean>(`${API_URL}/challenge/close/${challenge.ChallengeData.Id}`)
    .pipe(map(response => {
      return response['closed'];
    }));
  }

  // PUT
  public UpdateContest(challenge: Contest) {
    return this.http.put<any>(`${API_URL}/contest/update/${challenge.ChallengeData.Id}`, JSON.stringify({"contest": challenge.ContestData}));
  }

  public UpdateContract(challenge: Contract) {
    return this.http.put<any>(`${API_URL}/contract/update/${challenge.ChallengeData.Id}`, JSON.stringify({"contract": challenge.ContractData}));
  }

  public UpdateChallengeImage(id: number, image: string) {
    return this.http.put<any>(`${API_URL}/challenges/${id}/photo`,JSON.stringify({"photo": image}))
    .pipe(map(response => {
      return response['photo'];
    }));
  }

  public SelectWinnersOfContest(contest: Contest, submissions: Submission[]) {
    return this.http.put<any>(`${API_URL}/select-winners/contest-${contest.ContestData.Id}`,JSON.stringify(submissions));
  }

  public SelectWinnersOfContract(contract: Contract, submissions: Submission[]) {
    return this.http.put<any>(`${API_URL}/select-winners/contract-${contract.ContractData.Id}`,JSON.stringify(submissions));
  }

  public UpdateSubmissionImage(id: number, image: string) {
    return this.http.put<any>(`${API_URL}/submissions/${id}/photo`,JSON.stringify({"photo": image}))
    .pipe(map(response => {
      return response['photo'];
    }));
  }

  public UpdateSubmission(submission: Submission) {
    return this.http.put<any>(`${API_URL}/submissions/update/${submission.Id}`, JSON.stringify({"submission": submission}));
  }

  // POST
  public CreateContest(contest: IContest) {
    return this.http.post<any>(`${API_URL}/contest/register`,JSON.stringify(contest.ContestData))
      .pipe(map(response => {
        return response['id'];
      }));
  }

  public CreateContract(contract: IContract) {
    return this.http.post<any>(`${API_URL}/contract/register`,JSON.stringify(contract.ContractData))
      .pipe(map(response => {
        return response['id'];
      }));
  }

  // FUNCTIONS
  public HttpResponseToContest(data: any): Contest[] {
    this.contests = [];
    for (var i = 0; i != (Object.keys(data).length); i++) {
      this.contest = new Contest(new ContestData(new ChallengeCreateData(
        data[i].name,
        data[i].photo,
        data[i].description,
        data[i].about,
        data[i].prize_total,
        data[i].concentration,
        new Date(data[i].register_date),
        new Date(data[i].submit_date),
        data[i].is_confidential,
        data[i].owner,
        data[i].user_limit
      )));
      this.contest.ContestData.Id = data[i].parent_id;
      this.contest.ContestData.CreatedAt = new Date(data[i].created_at);
      this.contest.ContestData.UpdatedAt = new Date(data[i].updated_at);
      this.contest.ContestData.LastUpdatedBy = data[i].last_updated_by;
      this.contest.ContestData.Completed = data[i].completed;
      this.contest.ContestData.WinnerSelected = data[i].winner_selected;
      this.contest.ContestData.Banner = data[i].banner;
      this.contest.ContestData.Approved = data[i].approved;
      this.contest.ContestData.Eligibility = data[i].eligibility;
      this.contest.ContestData.Requirements = data[i].requirements;
      this.contest.ContestData.Judges = data[i].judges;
      this.contest.ContestData.JudgingCriteria = data[i].judging_criteria;
      this.contest.ContestData.Rules = data[i].rules;
      this.contest.ContestData.Resources = data[i].resources;
      this.contest.ContestData.Prizes = data[i].prizes;
      this.contest.ContestData.Virtual = data[i].virtual;
      this.contest.ContestData.BronzeSponsors = data[i].bronze_sponsors;
      this.contest.ContestData.SilverSponsors = data[i].silver_sponsors;
      this.contest.ContestData.GoldSponsors = data[i].gold_sponsors;

      this.contests[i] = this.contest; 
    }
    return this.contests;
  }

  public HttpResponseToContract(data: any): Contract[] {
    this.contracts = [];
    for (var i = 0; i != (Object.keys(data).length); i++) {
      this.contract = new Contract(new ContractData(new ChallengeCreateData(
        data[i].name,
        data[i].photo,
        data[i].description,
        data[i].about,
        data[i].prize_total,
        data[i].concentration,
        new Date(data[i].register_date),
        new Date(data[i].submit_date),
        data[i].is_confidential,
        data[i].owner,
        data[i].user_limit
      )));
      this.contract.ContractData.Id = data[i].parent_id;
      this.contract.ContractData.CreatedAt = new Date(data[i].created_at);
      this.contract.ContractData.UpdatedAt = new Date(data[i].updated_at);
      this.contract.ContractData.LastUpdatedBy = data[i].last_updated_by;
      this.contract.ContractData.Completed = data[i].completed;
      this.contract.ContractData.WinnerSelected = data[i].winner_selected;
      this.contract.ContractData.Banner = data[i].banner;
      this.contract.ContractData.Approved = data[i].approved;
      this.contract.ContractData.Eligibility = data[i].eligibility;
      this.contract.ContractData.Requirements = data[i].requirements;
      this.contract.ContractData.Judges = data[i].judges;
      this.contract.ContractData.JudgingCriteria = data[i].judging_criteria;
      this.contract.ContractData.Rules = data[i].rules;
      this.contract.ContractData.Resources = data[i].resources;
      this.contract.ContractData.Prizes = data[i].prizes;
      this.contract.ContractData.Virtual = data[i].virtual;
      this.contract.ContractData.BronzeSponsors = data[i].bronze_sponsors;
      this.contract.ContractData.SilverSponsors = data[i].silver_sponsors;
      this.contract.ContractData.GoldSponsors = data[i].gold_sponsors;

      this.contracts[i] = this.contract; 
    }
    return this.contracts;
  }

  public HttpResponseToSubmissions(data: any): Submission[] {
    this.submissions = [];

    for (var i = 0; i != (Object.keys(data).length); i++) {      
      this.submission = new Submission();
      
      this.submission.Id = data[i].id;
      this.submission.Name = data[i].name;
      this.submission.About = data[i].about;
      this.submission.Description = data[i].description;
      this.submission.TeamName = data[i].team_name;
      this.submission.Winner = data[i].winner;
      this.submission.WinnerType = data[i].winner_type;
      this.submission.Photo = data[i].photo;
      this.submission.Members = data[i].members;
      this.submission.SubmittedFiles = data[i].files;
      this.submission.SubmittedFileNames = data[i].filenames;
      this.submission.FollowerId = data[i].follower_id;
      this.submission.ChallengeId = data[i].challenge_id;
      this.submission.TeamId = data[i].team_id;
      this.submission.Submitted = data[i].submitted;
      this.submission.ChallengeType = data[i].challenge_type;

      this.submissions[i] = this.submission;
    }
    return this.submissions;
  }
}