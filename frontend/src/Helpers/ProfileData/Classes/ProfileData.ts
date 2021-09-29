import { IProfileData } from '../Interfaces/IProfileData';

export class ProfileData implements IProfileData {
  
  private photo: string;
  private banner: string;
  private description: string;
  private about: string;
  private address: string;
  private city: string;
  private state: string;
  private postalCode: number;
  private linkedin: string;
  private website: string;
  
  public get Photo(): string {
    return this.photo;
  }
  public set Photo (value: string) {
      this.photo = value;
  }

  public get Banner(): string {
    return this.banner;
  }
  public set Banner (value: string) {
      this.banner = value;
  }

  public get Description(): string {
    return this.description;
  }
  public set Description (value: string) {
      this.description = value;
  }

  public get About(): string {
    return this.about;
  }
  public set About (value: string) {
      this.about = value;
  }

  public get Address(): string {
    return this.address;
  }
  public set Address (value: string) {
      this.address = value;
  }
  public get State(): string {
    return this.state;
  }
  public set State (value: string) {
      this.state = value;
  }
  public get City(): string {
    return this.city;
  }
  public set City (value: string) {
      this.city = value;
  }
  public get PostalCode(): number {
    return this.postalCode;
  }
  public set PostalCode (value: number) {
      this.postalCode = value;
  }

  public get LinkedIn(): string {
    return this.linkedin;
  }
  public set LinkedIn (value: string) {
      this.linkedin = value;
  }

  public get Website(): string {
    return this.website;
  }
  public set Website (value: string) {
      this.website = value;
  }

  constructor(photo:string, description: string, about:string, address:string, city:string, state:string, 
    postal_code:number, linkedin:string, website:string) {
    this.Photo = photo;
    this.Description = description;
    this.About = about;
    this.Address = address;
    this.City = city;
    this.State = state;
    this.PostalCode = postal_code;
    this.LinkedIn = linkedin;
    this.Website = website;
  }
}
