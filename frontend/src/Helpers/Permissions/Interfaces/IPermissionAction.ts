import { IPermissionActionParams } from './IPermissionActionParams';

export interface IPermissionAction {
    Params: IPermissionActionParams;

    SetParams(params: IPermissionActionParams): void;
    PerformAction(): void;
}
