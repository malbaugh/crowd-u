import { ProfileData } from './ProfileData';
import { IChallengeOwnerProfileData } from '../Interfaces/IChallengeOwnerProfileData';

export class ChallengeOwnerProfileData extends ProfileData implements IChallengeOwnerProfileData {
    
    private industry: string;
    
    public get Industry(): string {
        return this.industry;
    }
    public set Industry (value: string) {
        this.industry = value;
    }

    constructor(address:string, city:string, state:string, postal_code:number, description:string, about:string, linkedin:string, photo:string, website:string, industry:string) {
        super(photo, description, about, address, city, state, postal_code, linkedin, website);
        this.Industry = industry;
    }
}
