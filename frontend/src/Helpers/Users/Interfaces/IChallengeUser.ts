import { User } from '../Classes/User';
import { IChallengerRegistrationData } from 'src/Helpers/Registration/Interfaces/IChallengerRegistrationData';
import { IChallengeOwnerProfileData } from 'src/Helpers/ProfileData/Interfaces/IChallengeOwnerProfileData';

export interface IChallengeUser extends User {
    ChallengerRegistrationData: IChallengerRegistrationData;
    ChallengeOwnerProfileData: IChallengeOwnerProfileData;
    Department: string;
    OrganizationLead: boolean;
    LeaderId: number;
}
