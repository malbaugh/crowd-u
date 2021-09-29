import { IProfileData } from '../../ProfileData/Interfaces/IProfileData';
import { IPermissionList } from 'src/Helpers/Permissions/Interfaces/IPermissionList';
import { IRegistrationData } from 'src/Helpers/Registration/Interfaces/IRegistrationData';
import { User } from '../Classes/User';

export interface IUser {
  UserRegistrationData: IRegistrationData;
  UserProfileData: IProfileData;
  Permissions: IPermissionList;
  UserId: number;
  Token: string;
  Rank: number;
  UpdatedAt: Date;
  CreatedAt: Date;
  LastUpdatedBy: string;
  
  SendUserMessage(IUser: string, Message: string): void;
}
