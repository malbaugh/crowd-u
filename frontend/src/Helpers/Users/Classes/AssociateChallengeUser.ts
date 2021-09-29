import { IAssociateChallengeUser } from '../Interfaces/IAssociateChallengeUser';
import { ChallengeUser } from './ChallengeUser';
import { IChallengerRegistrationData } from 'src/Helpers/Registration/Interfaces/IChallengerRegistrationData';

export class AssociateChallengeUser extends ChallengeUser implements IAssociateChallengeUser {
    constructor(regData: IChallengerRegistrationData) {
        super(regData);

    }
}
