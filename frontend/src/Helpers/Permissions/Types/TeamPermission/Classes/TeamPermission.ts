import { Permission } from '../../../Classes/Permission';
import { ITeamPermission } from '../Interfaces/ITeamPermission';
import { ITeam } from '../../../../Team/Interfaces/ITeam';

export class TeamPermission extends Permission implements ITeamPermission {
    Team: ITeam;
}