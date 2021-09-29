export interface ITeam {
    Id: number;
    Name: string;
    Leader: string;
    Members: string[];
    Challenges: string[];
    UpdatedAt: Date;
    CreatedAt: Date;
    LastUpdatedBy: string;
}