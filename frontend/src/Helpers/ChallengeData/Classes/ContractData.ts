import { ChallengeData } from './ChallengeData';
import { IContractData } from '../Interfaces/IContractData';
import { IChallengeCreateData } from '../Interfaces/IChallengeCreateData';

export class ContractData extends ChallengeData implements IContractData {
    
    constructor(challengeCreateData: IChallengeCreateData) {
        super(challengeCreateData);      
    }
}
