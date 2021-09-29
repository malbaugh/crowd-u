import { Challenge } from "../Classes/Challenge";
import { IContestData } from 'src/Helpers/ChallengeData/Interfaces/IContestData';

export interface IContest extends Challenge {
    ContestData: IContestData;
}
