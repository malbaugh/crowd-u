import { ChallengeData } from './ChallengeData';
import { IContestData } from '../Interfaces/IContestData';
import { IChallengeCreateData } from '../Interfaces/IChallengeCreateData';

export class ContestData extends ChallengeData implements IContestData {
    constructor(challengeCreateData: IChallengeCreateData) {
        super(challengeCreateData);      
    }
}