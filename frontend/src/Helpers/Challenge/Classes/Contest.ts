import { Challenge } from './Challenge';
import { IContest } from '../Interfaces/IContest';
import { IContestData } from 'src/Helpers/ChallengeData/Interfaces/IContestData';
import { ContestData } from 'src/Helpers/ChallengeData/Classes/ContestData';

export class Contest extends Challenge implements IContest {
    
    private contestData: IContestData;

    constructor (contestData: IContestData) {
        super(contestData);
        this.contestData = contestData;
    }

    public get ContestData(): IContestData {
        return this.contestData;
    }

    public set ContestData(value: IContestData) {
        this.contestData = value;
    }
}