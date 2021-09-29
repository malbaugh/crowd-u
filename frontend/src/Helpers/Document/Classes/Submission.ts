import { ISubmission } from '../Interfaces/ISubmission';

export class Submission implements ISubmission {
    private id: number;
    private submittedFiles: string[];
    private submittedFileNames: string[];
    private members: string[];
    private teamName: string;
    private photo: string;
    private description: string;
    private about: string;
    private winner: boolean;
    private name: string;
    private winnerType: string;
    private followerId: number;
    private teamId: number;
    private challengeId: number;
    private submitted: boolean;
    private challengeType: string;

    public get Id(): number {
        return this.id;
    }
    public set Id(value: number) {
        this.id = value;
    }

    public get SubmittedFiles(): string[] {
        return this.submittedFiles;
    }
    public set SubmittedFiles (value: string[]) {
        this.submittedFiles = value;
    }

    public get SubmittedFileNames(): string[] {
        return this.submittedFileNames;
    }
    public set SubmittedFileNames (value: string[]) {
        this.submittedFileNames = value;
    }

    public get Members(): string[] {
        return this.members;
    }
    public set Members (value: string[]) {
        this.members = value;
    }

    public get TeamName(): string {
        return this.teamName;
    }
    public set TeamName (value: string) {
        this.teamName = value;
    }

    public get Photo(): string {
        return this.photo;
    }
    public set Photo (value: string) {
        this.photo = value;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name (value: string) {
        this.name = value;
    }

    public get Description(): string {
        return this.description;
    }
    public set Description (value: string) {
        this.description = value;
    }

    public get About(): string {
        return this.about;
    }
    public set About (value: string) {
        this.about = value;
    }

    public get Winner(): boolean {
        return this.winner;
    }
    public set Winner (value: boolean) {
        this.winner = value;
    }

    public get WinnerType(): string {
        return this.winnerType;
    }
    public set WinnerType (value: string) {
        this.winnerType = value;
    }

    public get FollowerId(): number {
        return this.followerId;
    }
    public set FollowerId(value: number) {
        this.followerId = value;
    }

    public get TeamId(): number {
        return this.teamId;
    }
    public set TeamId(value: number) {
        this.teamId = value;
    }

    public get ChallengeId(): number {
        return this.challengeId;
    }
    public set ChallengeId(value: number) {
        this.challengeId = value;
    }

    public get Submitted(): boolean {
        return this.submitted;
    }
    public set Submitted (value: boolean) {
        this.submitted = value;
    }

    public get ChallengeType(): string {
      return this.challengeType;
    }
    public set ChallengeType (value: string) {
      this.challengeType = value;
    }
}