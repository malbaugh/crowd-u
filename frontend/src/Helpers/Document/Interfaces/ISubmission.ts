import { Team } from 'src/Helpers/Team/Classes/Team';
import { ParticipantUser } from 'src/Helpers/Users/Classes/ParticipantUser';

export interface ISubmission {
    Id: number;
    SubmittedFiles: string[];
    SubmittedFileNames: string[];
    Members: string[];
    TeamName: string;
    Photo: string;
    Name: string;
    Description: string;
    About: string;
    Winner: boolean;
    WinnerType: string;
    FollowerId: number;
    TeamId: number;
    ChallengeId: number;
    Submitted: boolean;
    ChallengeType: string;
}