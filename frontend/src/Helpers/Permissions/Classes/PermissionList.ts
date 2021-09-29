import { IPermissionList } from '../Interfaces/IPermissionList';
import { IPermission } from '../Interfaces/IPermission';

export class PermissionList implements IPermissionList {
  Permissions: IPermission[];

  HasPermission(permission: IPermission): boolean {
    // TODO 
    return true;
  }
}
