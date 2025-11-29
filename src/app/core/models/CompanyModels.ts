import { Organization } from "./AuthModels";

export interface Company{
  id: string;
  name: string;
  cnpj: string;
  email: string;
  address: Address;
  phoneNumber: string;
  status: string;
  createdAt: Date;
  tags: Tag [];
  organizations: Organization [];
  profilePictureUrl: string;
}

export interface Tag{
  id: string;
  name: string;
}

export interface Address{
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateTagRequest{
  name: string;
}

export interface CreateCompanyRequest{
  Name: string;
  CNPJ: string;
  Email: string;
  PhoneNumber: string;
  Street: string;
  Number: string;
  Neighborhood: string;
  City: string;
  State: string;
  PostalCode: string
  Country: string;
}

export interface UpdateCompanyRequest{
  Name: string;
  CNPJ: string;
  Email: string;
  PhoneNumber: string;
  Street: string;
  Number: string;
  Neighborhood: string;
  City: string;
  State: string;
  PostalCode: string
  Country: string;
}