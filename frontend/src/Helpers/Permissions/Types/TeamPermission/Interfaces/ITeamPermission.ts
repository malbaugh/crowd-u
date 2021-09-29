import { Permission } from '../../../Classes/Permission';
import { ITeam } from '../../../../Team/Interfaces/ITeam';

export interface ITeamPermission extends Permission {
    Team: ITeam;
}