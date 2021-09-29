import { IChallengerRegistrationData } from '../Interfaces/IChallengerRegistrationData';
import { RegistrationData } from './RegistrationData';

export class ChallengerRegistrationData extends RegistrationData implements IChallengerRegistrationData {
    
    private pocFirstName: string;
    private pocLastName: string;
    private pocPhone: number;

    public get PocFirstName(): string {
        return this.pocFirstName;
    }
    public set PocFirstName (value: string) {
        this.pocFirstName = value;
    }

    public get PocLastName(): string {
        return this.pocLastName;
    }
    public set PocLastName (value: string) {
        this.pocLastName = value;
    }

    public get PocPhone(): number {
        return this.pocPhone;
    }
    public set PocPhone (value: number) {
        this.pocPhone = value;
    }
    
    constructor(company:string, pocName:string, pocPhone:number, username:string,  password:string, email:string) {
        super(company,email,password,username);
        this.PocFirstName = pocName.substr(0,pocName.indexOf(' '))
        this.PocLastName = pocName.substr(pocName.indexOf(' ')+1);
        this.PocPhone = pocPhone;
    }
}
