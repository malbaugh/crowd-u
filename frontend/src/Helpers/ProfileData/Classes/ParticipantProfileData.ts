import { ProfileData } from './ProfileData';
import { IParticipantProfileData } from '../Interfaces/IParticipantProfileData';

export class ParticipantProfileData extends ProfileData implements IParticipantProfileData {
    
    private phone: number;
    private major: string;
    private educationStatus: string;
    private enrollmentStatus: string;
    private travelAvailability: string;
    private concentration: string[];
    
    public get Phone(): number {
        return this.phone;
    }
    public set Phone (value: number) {
        this.phone = value;
    }
    
    public get Major(): string {
        return this.major;
    }
    public set Major (value: string) {
        this.major = value;
    }

    public get EducationStatus(): string {
        return this.educationStatus;
    }
    public set EducationStatus (value: string) {
        this.educationStatus = value;
    }

    public get EnrollmentStatus(): string {
        return this.enrollmentStatus;
    }
    public set EnrollmentStatus (value: string) {
        this.enrollmentStatus = value;
    }

    public get TravelAvailability(): string {
        return this.travelAvailability;
    }
    public set TravelAvailability (value: string) {
        this.travelAvailability = value;
    }

    public get Concentration(): string[] {
        return this.concentration;
    }
    public set Concentration (value: string[]) {
        this.concentration = value;
    }

    constructor(phone:number, address:string, city:string, state:string, postalCode:number, 
        educationStatus:string, enrollmentStatus:string, major:string, travelAvailability:string, concentration:string[], description:string, about:string, linkedin:string, photo:string, website:string) {
            
        super(photo, description, about, address, city, state, postalCode, linkedin, website);
        this.Phone = phone;
        this.Major = major;
        this.EducationStatus = educationStatus;
        this.EnrollmentStatus = enrollmentStatus;
        this.TravelAvailability = travelAvailability;
        this.Concentration = concentration;
    }
}
