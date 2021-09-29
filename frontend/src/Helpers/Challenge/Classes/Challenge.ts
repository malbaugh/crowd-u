import { IChallenge } from '../Interfaces/IChallenge';
import { IChallengeData } from 'src/Helpers/ChallengeData/Interfaces/IChallengeData';

export class Challenge implements IChallenge {
    private challengeData: IChallengeData;

    constructor (challengeData: IChallengeData) {
        this.challengeData = challengeData;
    }

    public get ChallengeData(): IChallengeData {
        return this.challengeData;
    }

    public set ChallengeData(value: IChallengeData) {
        this.challengeData = value;
    }
}