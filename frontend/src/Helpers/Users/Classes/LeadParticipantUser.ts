import { ILeadParticipantUser } from '../Interfaces/ILeadParticipantUser';
import { ParticipantUser } from './ParticipantUser';
import { IParticipantRegistrationData } from 'src/Helpers/Registration/Interfaces/IParticipantRegistrationData';

export class LeadParticipantUser extends ParticipantUser implements ILeadParticipantUser {
    constructor(regData: IParticipantRegistrationData) {
        super(regData);

    }
}
