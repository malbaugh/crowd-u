import { Challenge } from './Challenge';
import { IContract } from '../Interfaces/IContract';
import { IContractData } from 'src/Helpers/ChallengeData/Interfaces/IContractData';

export class Contract extends Challenge implements IContract {
    
    private contractData: IContractData;

    constructor (contractData: IContractData) {
        super(contractData);
        this.contractData = contractData;
    }

    public get ContractData(): IContractData {
        return this.contractData;
    }

    public set ContractData(value: IContractData) {
        this.contractData = value;
    }
}
