import { IParticipantUser } from '../Interfaces/IParticipantUser';
import { User } from './User';
import { IChallenge } from '../../Challenge/Interfaces/IChallenge'
import { IParticipantRegistrationData } from 'src/Helpers/Registration/Interfaces/IParticipantRegistrationData';
import { IParticipantProfileData } from 'src/Helpers/ProfileData/Interfaces/IParticipantProfileData';

export class ParticipantUser extends User implements IParticipantUser {
    
    private participantRegistrationData: IParticipantRegistrationData;
    private participantProfileData: IParticipantProfileData;

    constructor(regProData: IParticipantRegistrationData) {
        super(regProData);
        this.participantRegistrationData = regProData;
    }

    public get ParticipantRegistrationData(): IParticipantRegistrationData {
        return this.participantRegistrationData;
    }
    public set ParticipantRegistrationData(value: IParticipantRegistrationData) {
        this.participantRegistrationData = value;
    }

    public get ParticipantProfileData(): IParticipantProfileData {
        return this.participantProfileData;
    }
    public set ParticipantProfileData(value: IParticipantProfileData) {
        this.participantProfileData = value;
    }

    ApplyForChallenge(Challenge: IChallenge) {
        throw new Error("Method not implemented.");
    }
}
