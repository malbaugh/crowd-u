import { ISponsor } from '../Interfaces/ISponsor';

export class Sponsor implements ISponsor {
    private onPlatform: boolean;
    private connectedId: number;
    private name: string;    
    private photo: string;
    private website: string;
    private id: number;

    constructor(name: string, photo: string, website: string) {
        this.name = name;
        this.photo = photo;
        this.website = website;
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

    public get Website(): string {
        return this.website;
    }
    public set Website (value: string) {
        this.website = value;
    }

    public get Id(): number {
        return this.id;
    }
    public set Id (value: number) {
        this.id = value;
    }

    public get OnPlatform(): boolean {
        return this.onPlatform;
    }
    public set OnPlatform (value: boolean) {
        this.onPlatform = value;
    }

    public get ConnectedId(): number {
        return this.connectedId;
    }
    public set ConnectedId (value: number) {
        this.connectedId = value;
    }
}