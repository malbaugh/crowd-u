import { RegistrationData } from '../Classes/RegistrationData';

export interface IParticipantRegistrationData extends RegistrationData {

    FirstName: string;
    LastName: string;
    DateOfBirth: Date;
    University: string;
    
}
