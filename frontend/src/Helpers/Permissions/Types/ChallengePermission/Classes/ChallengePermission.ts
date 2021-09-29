import { IChallengePermission } from '../Interfaces/IChallengePermission';
import { IChallenge } from '../../../../Challenge/Interfaces/IChallenge';
import { Permission } from '../../../Classes/Permission';

export class ChallengePermission extends Permission implements IChallengePermission {
    Challenge: IChallenge;    
}