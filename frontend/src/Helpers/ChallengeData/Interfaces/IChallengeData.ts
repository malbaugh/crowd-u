import { IOwnerChallengeUser } from 'src/Helpers/Users/Interfaces/IOwnerChallengeUser';
import { ISponsor } from 'src/Helpers/Sponsor/Interfaces/ISponsor';

export interface IChallengeData {
    Id: number;
    Name: string;
    Photo: string;
    Banner: string;
    OwnerUsername: string;
    PrizeTotal: number;
    Description: string;
    About: string;
    Concentrations: string[];
    BronzeSponsors: number[];
    SilverSponsors: number[];
    GoldSponsors: number[];
    RegisterDate: Date;
    IsConfidential: boolean;
    NdaPath: string;
    ContractPath: string;
    UpdatedAt: Date;
    CreatedAt: Date;
    LastUpdatedBy: string;
    Approved: Boolean;
    Completed: boolean;
    WinnerSelected: boolean;
    Eligibility: string;
    Requirements: string;
    Judges: number[];
    JudgingCriteria: string;
    Rules: string;
    Resources: string;
    Prizes: string;
    Virtual: boolean;
    UserLimit: number;
}