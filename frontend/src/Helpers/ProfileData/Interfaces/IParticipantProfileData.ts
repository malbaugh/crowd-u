import { ProfileData } from '../Classes/ProfileData';

export interface IParticipantProfileData extends ProfileData {
    
    Phone: number;
    Major: string;
    EducationStatus: string;
    EnrollmentStatus: string;
    TravelAvailability: string;
    Concentration: string[];
}
