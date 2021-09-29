import { IOwnerChallengeUser } from 'src/Helpers/Users/Interfaces/IOwnerChallengeUser';

export interface IChallengeCreateData {
    Name: string;
    About: string;
    Photo: string;
    Description: string;
    Concentrations: string[];
    StartDate: Date;
    EndDate: Date;
    IsConfidential: boolean;
    OwnerUsername: string;
    PrizeTotal: number;
    UserLimit: number;
}