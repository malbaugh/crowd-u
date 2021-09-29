import { ITeam } from '../Interfaces/ITeam';

export class Team implements ITeam {
    private id: number;
    private name: string;
    private leader: string;
    private members: string[];
    private challenges: string[];
    private updatedAt: Date;
    private createdAt: Date;
    private lastUpdatedBy: string;

    constructor(name, leader, members) {
        this.name = name;
        this.leader = leader;
        this.members = members;
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

    public get Leader(): string {
        return this.leader;
    }
    public set Leader(value: string) {
        this.leader = value;
    }


    public get Members(): string[] {
        return this.members;
    }
    public set Members(value: string[]) {
        this.members = value;
    }

    public get Challenges(): string[] {
        return this.challenges;
    }
    public set Challenges(value: string[]) {
        this.challenges = value;
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
}