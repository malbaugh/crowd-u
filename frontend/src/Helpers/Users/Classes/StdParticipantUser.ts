import { IStdParticipantUser } from '../Interfaces/IStdParticipantUser';
import { ParticipantUser } from './ParticipantUser';
import { IParticipantRegistrationData } from 'src/Helpers/Registration/Interfaces/IParticipantRegistrationData';

export class StdParticipantUser extends ParticipantUser implements IStdParticipantUser {
    constructor(regData: IParticipantRegistrationData) {
        super(regData);

    }
}
