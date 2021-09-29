import { IPermission } from '../Interfaces/IPermission';
import { IPermissionAction } from '../Interfaces/IPermissionAction';
import { IUser } from '../../Users/Interfaces/IUser';

export class Permission implements IPermission {
    ActingUser: IUser;
    Action: IPermissionAction;
}
