import { IUser } from '../Interfaces/IUser';
import { IProfileData } from '../../ProfileData/Interfaces/IProfileData';
import { IPermissionList } from '../../Permissions/Interfaces/IPermissionList';
import { IRegistrationData } from 'src/Helpers/Registration/Interfaces/IRegistrationData';

export class User implements IUser {

  // TODO --> see about making common fields protected
  protected rank: number;
  private permissions: IPermissionList;
  private userProfileData: IProfileData;
  private userRegistrationData: IRegistrationData;
  private userId: number;
  private token: string;
  private updatedAt: Date;
  private createdAt: Date;
  private lastUpdatedBy: string;

  public get Permissions(): IPermissionList {
    return this.permissions;
  }
  public set Permissions (value: IPermissionList) {
      this.permissions = value;
  }

  public get UserProfileData(): IProfileData {
    return this.userProfileData;
  }
  public set UserProfileData (value: IProfileData) {
      this.userProfileData = value;
  }

  public get UserRegistrationData(): IRegistrationData {
    return this.userRegistrationData;
  }
  public set UserRegistrationData (value: IRegistrationData) {
      this.userRegistrationData = value;
  }

  public get UserId(): number {
    return this.userId;
  }
  public set UserId (value: number) {
      this.userId = value;
  }

  public get Token(): string {
    return this.token;
  }
  public set Token (value: string) {
      this.token = value;
  }

  public get Rank(): number {
    return this.rank;
  }
  public set Rank (value: number) {
      this.rank = value;
  }

  public get UpdatedAt(): Date {
    return this.updatedAt;
  }
  public set UpdatedAt (value: Date) {
      this.updatedAt = value;
  }

  public get CreatedAt(): Date {
    return this.createdAt;
  }
  public set CreatedAt (value: Date) {
      this.createdAt = value;
  }

  public get LastUpdatedBy(): string {
    return this.lastUpdatedBy;
  }
  public set LastUpdatedBy (value: string) {
      this.lastUpdatedBy = value;
  }

  constructor(regData: IRegistrationData) {
    this.UserRegistrationData = regData;
  }
  
  SendUserMessage(IUser: string, Message: string): void {
    throw new Error("Method not implemented.");
  }
}
