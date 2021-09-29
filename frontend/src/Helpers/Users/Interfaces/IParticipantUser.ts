import { User } from '../Classes/User';
import { IChallenge } from '../../../Helpers/Challenge/Interfaces/IChallenge';
import { IParticipantProfileData } from 'src/Helpers/ProfileData/Interfaces/IParticipantProfileData';
import { IParticipantRegistrationData } from 'src/Helpers/Registration/Interfaces/IParticipantRegistrationData';

export interface IParticipantUser extends User {
    
    ParticipantRegistrationData: IParticipantRegistrationData;
    ParticipantProfileData: IParticipantProfileData;

    ApplyForChallenge(Challenge: IChallenge): void;
}
