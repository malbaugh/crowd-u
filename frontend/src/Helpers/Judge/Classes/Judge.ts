import { IJudge } from '../Interfaces/IJudge';

export class Judge implements IJudge {
    private name: string;
    private description: string;
    private photo: string;
    private linkedin: string;
    private id: number;

    constructor(name: string, photo: string, linkedin: string) {
        this.name = name;
        this.photo = photo;
        this.linkedin = linkedin;
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

    public get LinkedIn(): string {
        return this.linkedin;
    }
    public set LinkedIn (value: string) {
        this.linkedin = value;
    }

    public get Id(): number {
        return this.id;
    }
    public set Id (value: number) {
        this.id = value;
    }

}