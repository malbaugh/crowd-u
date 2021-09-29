import { IChallengeData } from '../Interfaces/IChallengeData';
import { ISponsor } from 'src/Helpers/Sponsor/Interfaces/ISponsor';
import { IChallengeCreateData } from '../Interfaces/IChallengeCreateData';

export class ChallengeData implements IChallengeData {
    
    private banner: string;
    private eligibility: string;
    private requirements: string;
    private judges: number[];
    private judgingCriteria: string;
    private rules: string;
    private resources: string;
    private prizes: string;
    private virtual: boolean;
    private approved: boolean;
    private id: number;    
    private name: string;
    private photo: string;
    private ownerUsername: string;
    private prizeTotal: number;
    private description: string;
    private about: string;
    private concentrations: string[];
    private bronzeSponsors: number[];
    private silverSponsors: number[];
    private goldSponsors: number[];
    private registerDate: Date;
    private submitDate: Date;
    private isConfidential: boolean;
    private ndaPath: string;
    private contractPath: string;
    private updatedAt: Date;
    private createdAt: Date;
    private lastUpdatedBy: string;
    private completed: boolean;
    private winnerSelected: boolean;
    private userLimit: number;

    constructor(challengeCreateData: IChallengeCreateData) {
        this.name = challengeCreateData.Name;
        this.ownerUsername = challengeCreateData.OwnerUsername;
        this.description = challengeCreateData.Description;
        this.about = challengeCreateData.About;
        this.concentrations = challengeCreateData.Concentrations;
        this.registerDate = challengeCreateData.StartDate;
        this.submitDate = challengeCreateData.EndDate;
        this.isConfidential = challengeCreateData.IsConfidential;
        this.prizeTotal = challengeCreateData.PrizeTotal;
        this.photo = challengeCreateData.Photo;
        this.userLimit = challengeCreateData.UserLimit;
    }

    public get Id(): number {
        return this.id;
    }
    public set Id(value: number) {
        this.id = value;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    public get OwnerUsername(): string {
        return this.ownerUsername;
    }
    public set OwnerUsername(value: string) {
        this.ownerUsername = value;
    }

    public get Photo(): string {
        return this.photo;
    }
    public set Photo(value: string) {
        this.photo = value;
    }

    public get Banner(): string {
        return this.banner;
    }
    public set Banner (value: string) {
        this.banner = value;
    }

    public get Eligibility(): string {
        return this.eligibility;
    }
    public set Eligibility (value: string) {
        this.eligibility = value;
    }

    public get Requirements(): string {
        return this.requirements;
    }
    public set Requirements (value: string) {
        this.requirements = value;
    }

    public get Judges(): number[] {
        return this.judges;
    }
    public set Judges (value: number[]) {
        this.judges = value;
    }

    public get JudgingCriteria(): string {
        return this.judgingCriteria;
    }
    public set JudgingCriteria (value: string) {
        this.judgingCriteria = value;
    }

    public get Rules(): string {
        return this.rules;
    }
    public set Rules (value: string) {
        this.rules = value;
    }

    public get Resources(): string {
        return this.resources;
    }
    public set Resources (value: string) {
        this.resources = value;
    }

    public get Prizes(): string {
        return this.prizes;
    }
    public set Prizes (value: string) {
        this.prizes = value;
    }

    public get Virtual(): boolean {
        return this.virtual;
    }
    public set Virtual (value: boolean) {
        this.virtual = value;
    }

    public get PrizeTotal(): number {
        return this.prizeTotal;
    }
    public set PrizeTotal(value: number) {
        this.prizeTotal = value;
    }

    public get Description(): string {
        return this.description;
    }
    public set Description(value: string) {
        this.description = value;
    }

    public get Concentrations(): string[] {
        return this.concentrations;
    }
    public set Concentrations(value: string[]) {
        this.concentrations = value;
    }

    public get BronzeSponsors(): number[] {
        return this.bronzeSponsors;
    }
    public set BronzeSponsors(value: number[]) {
        this.bronzeSponsors = value;
    }

    public get SilverSponsors(): number[] {
        return this.silverSponsors;
    }
    public set SilverSponsors(value: number[]) {
        this.silverSponsors = value;
    }

    public get GoldSponsors(): number[] {
        return this.goldSponsors;
    }
    public set GoldSponsors(value: number[]) {
        this.goldSponsors = value;
    }

    public get RegisterDate(): Date {
        return this.registerDate;
    }
    public set RegisterDate(value: Date) {
        this.registerDate = value;
    }

    public get SubmitDate(): Date {
        return this.submitDate;
    }
    public set SubmitDate(value: Date) {
        this.submitDate = value;
    }
    
    public get IsConfidential(): boolean {
        return this.isConfidential;
    }
    public set IsConfidential(value: boolean) {
        this.isConfidential = value;
    }

    public get NdaPath(): string {
        return this.ndaPath;
    }
    public set NdaPath(value: string) {
        this.ndaPath = value;
    }

    public get ContractPath(): string {
        return this.contractPath;
    }
    public set ContractPath(value: string) {
        this.contractPath = value;
    }
    
    public get About(): string {
        return this.about;
    }
    public set About(value: string) {
        this.about = value;
    }
    public get UpdatedAt(): Date {
        return this.updatedAt;
    }
    public set UpdatedAt (value: Date) {
        this.updatedAt = value;
    }

    public get CreatedAt(): Date {
        return this.createdAt;
    }
    public set CreatedAt (value: Date) {
        this.createdAt = value;
    }

    public get LastUpdatedBy(): string {
        return this.lastUpdatedBy;
    }
    public set LastUpdatedBy (value: string) {
        this.lastUpdatedBy = value;
    }

    public get Approved(): boolean {
        return this.approved;
    }
    public set Approved (value: boolean) {
        this.approved = value;
    }

    public get Completed(): boolean {
        return this.completed;
    }
    public set Completed (value: boolean) {
        this.completed = value;
    }

    public get WinnerSelected(): boolean {
        return this.winnerSelected;
    }
    public set WinnerSelected (value: boolean) {
        this.winnerSelected = value;
    }
    public get UserLimit(): number {
        return this.userLimit;
    }
    public set UserLimit(value: number) {
        this.userLimit = value;
    }
}