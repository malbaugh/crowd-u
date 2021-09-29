import { IChallengeUser } from '../Interfaces/IChallengeUser';
import { User } from './User';
import { IChallengerRegistrationData } from 'src/Helpers/Registration/Interfaces/IChallengerRegistrationData';
import { IChallengeOwnerProfileData } from 'src/Helpers/ProfileData/Interfaces/IChallengeOwnerProfileData';

export class ChallengeUser extends User implements IChallengeUser {
    
    private challengerRegistrationData: IChallengerRegistrationData;
    private challengeOwnerProfileData: IChallengeOwnerProfileData;
    private department: string;
    private organizationLead: boolean;
    private leaderId: number;

    constructor(regData: IChallengerRegistrationData) {
        super(regData);
        this.challengerRegistrationData = regData;
    }

    public get ChallengerRegistrationData(): IChallengerRegistrationData {
        return this.challengerRegistrationData;
    }
    public set ChallengerRegistrationData(value: IChallengerRegistrationData) {
        this.challengerRegistrationData = value;
    }

    public get ChallengeOwnerProfileData(): IChallengeOwnerProfileData {
        return this.challengeOwnerProfileData;
    }
    public set ChallengeOwnerProfileData(value: IChallengeOwnerProfileData) {
        this.challengeOwnerProfileData = value;
    }

    public get Department(): string {
        return this.department;
    }
    public set Department(value: string) {
        this.department = value;
    }

    public get OrganizationLead(): boolean {
        return this.organizationLead;
    }
    public set OrganizationLead(value: boolean) {
        this.organizationLead = value;
    }

    public get LeaderId(): number {
        return this.leaderId
    }
    public set LeaderId(value: number) {
        this.leaderId = value;
    }
}
