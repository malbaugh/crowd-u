import { IPermissionAction } from './IPermissionAction';
import { IUser } from '../../Users/Interfaces/IUser';

export interface IPermission {
    ActingUser: IUser;
    Action: IPermissionAction;
}