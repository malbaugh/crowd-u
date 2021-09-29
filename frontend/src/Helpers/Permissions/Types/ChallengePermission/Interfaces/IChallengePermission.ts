import { Permission } from '../../../Classes/Permission';
import { IChallenge } from '../../../../Challenge/Interfaces/IChallenge';

export interface IChallengePermission extends Permission {
    Challenge: IChallenge;
}