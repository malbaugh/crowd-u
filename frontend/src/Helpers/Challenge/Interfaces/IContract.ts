import { Challenge } from '../Classes/Challenge';
import { IContractData } from 'src/Helpers/ChallengeData/Interfaces/IContractData';

export interface IContract extends Challenge {
    ContractData: IContractData;
}