import { IChallengeCreateData } from '../Interfaces/IChallengeCreateData';
import { IOwnerChallengeUser } from 'src/Helpers/Users/Interfaces/IOwnerChallengeUser';

export class ChallengeCreateData implements IChallengeCreateData {
    private name: string;
    private description: string;
    private about: string;
    private photo: string;
    private concentrations: string[];
    private startDate: Date;
    private endDate: Date;
    private isConfidential: boolean;
    private ownerUsername: string;
    private prizeTotal: number;
    private userLimit: number;

    constructor(name: string, photo: string, description: string, about:string, prizeTotal: number, concentrations: string[], 
        startDate: Date, endDate: Date, isConfidential: boolean, ownerUsername: string, userLimit: number) {        
        this.name = name;
        this.description = description;
        this.about = about;
        this.prizeTotal = prizeTotal;
        this.concentrations = concentrations;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isConfidential = isConfidential;
        this.ownerUsername = ownerUsername;
        this.photo = photo;
        this.userLimit = userLimit;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    public get Description(): string {
        return this.description;
    }
    public set Description(value: string) {
        this.description = value;
    }

    public get About(): string {
        return this.about;
    }
    public set About(value: string) {
        this.about = value;
    }

    public get Photo(): string {
        return this.photo;
    }
    public set Photo(value: string) {
        this.photo = value;
    }

    public get Concentrations(): string[] {
        return this.concentrations;
    }
    public set Concentrations(value: string[]) {
        this.concentrations = value;
    }

    public get StartDate(): Date {
        return this.startDate;
    }
    public set StartDate(value: Date) {
        this.startDate = value;
    }

    public get EndDate(): Date {
        return this.endDate;
    }
    public set EndDate(value: Date) {
        this.endDate = value;
    }
    
    public get IsConfidential(): boolean {
        return this.isConfidential;
    }
    public set IsConfidential(value: boolean) {
        this.isConfidential = value;
    }

    public get OwnerUsername(): string {
        return this.ownerUsername;
    }
    public set OwnerUsername(value: string) {
        this.ownerUsername = value;
    }
    
    public get PrizeTotal(): number {
        return this.prizeTotal;
    }
    public set PrizeTotal(value: number) {
        this.prizeTotal = value;
    }
    public get UserLimit(): number {
        return this.userLimit;
    }
    public set UserLimit(value: number) {
        this.userLimit = value;
    }
}