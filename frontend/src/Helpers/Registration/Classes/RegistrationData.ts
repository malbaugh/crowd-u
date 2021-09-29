import { IRegistrationData } from '../Interfaces/IRegistrationData';

export class RegistrationData implements IRegistrationData {
  private firstName: string;
  private lastName: string;
  private email: string;
  private password: string;
  private username: string;

  public get Email(): string {
    return this.email;
  }
  public set Email (value: string) {
      this.email = value;
  }
  
  public get Password(): string {
    return this.password;
  }
  public set Password (value: string) {
      this.password = value;
  }

  public get Username(): string {
    return this.username;
  }
  public set Username (value: string) {
    this.username = value;
  }

  public get FirstName(): string {
    return this.firstName;
  }
  public set FirstName (value: string) {
    this.firstName = value;
  }

  public get LastName(): string {
    return this.lastName;
  }
  public set LastName (value: string) {
    this.lastName = value;
  }

  constructor(name:string, email:string, password:string, username:string) {
    this.Email = email;
    this.Password = password;
    this.Username = username;
    this.FirstName = name.substr(0,name.indexOf(' '));
    this.LastName = name.substr(name.indexOf(' ')+1)
  }
}