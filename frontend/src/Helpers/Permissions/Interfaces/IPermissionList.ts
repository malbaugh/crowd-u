import { IPermission } from './IPermission';
import { IUser } from '../../Users/Interfaces/IUser';

export interface IPermissionList {
  Permissions: IPermission[];

  HasPermission(permission: IPermission): boolean;
}
