import { IPermissionAction } from '../Interfaces/IPermissionAction';
import { IPermissionActionParams } from '../Interfaces/IPermissionActionParams';

export class PermissionAction implements IPermissionAction {
    Params: IPermissionActionParams;    

    SetParams(params: IPermissionActionParams): void {
        throw new Error("Method not implemented.");
    }
    PerformAction(): void {
        throw new Error("Method not implemented.");
    }


}
