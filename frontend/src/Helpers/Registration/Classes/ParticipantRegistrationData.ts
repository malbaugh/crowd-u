import { IParticipantRegistrationData } from '../Interfaces/IParticipantRegistrationData';
import { RegistrationData } from './RegistrationData';

export class ParticipantRegistrationData extends RegistrationData implements IParticipantRegistrationData {    
    private dateOfBirth: Date;
    private university: string;

    public get DateOfBirth(): Date {
        return this.dateOfBirth;
    }
    public set DateOfBirth (value: Date) {
        this.dateOfBirth = value;
    }

    public get University(): string {
        return this.university;
    }
    public set University (value: string) {
        this.university = value;
    }

    constructor(name:string, username:string,  email:string, university:string, password:string, dateOfBirth:Date) {
        super(name,email,password,username);
        this.DateOfBirth = dateOfBirth; 
        this.University = university;
    }
}
