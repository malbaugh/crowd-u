import { IOwnerChallengeUser } from '../Interfaces/IOwnerChallengeUser';
import { ChallengeUser } from './ChallengeUser';
import { IChallengerRegistrationData } from 'src/Helpers/Registration/Interfaces/IChallengerRegistrationData';

export class OwnerChallengeUser extends ChallengeUser implements IOwnerChallengeUser {

    constructor(regData: IChallengerRegistrationData) {
        super(regData);

    }
}
