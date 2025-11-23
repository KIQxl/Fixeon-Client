import { Address } from "./CompanyModels";
import { Category, Departament } from "./Ticket";

export interface ApplicationUser{
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
    profilePictureUrl: string;
    organization: UserOrganization
    roles: string [];
}

export interface Organization{
    id: string;
    name: string;
    cnpj: string;
    email: string;
    profileUrl: string;
    phoneNumber: string;
    notes: string;
    address: Address;
    status: string;
    createdAt: Date;
    companyId: string;
    organizationSLAs: OrganizationSLA[];
    categories: Category[];
    departaments: Departament[]
}

export interface OrganizationSLA{
    organizationId: string;
    slaInMinutes: number;
    slaPriority: string;
    type: number;
}

export interface UserOrganization{
    organizationId: string | null;
    organizationName: string | null;
}

export interface UpdateApplicationUser{
    id: string | null;
    username: string | null;
    email: string | null;
    organizationId: string | null;
}

export interface AssociateRoleRequest{
    userId: string | null;
    roles: string [];
}

export interface CreateAccountRequest{
    email: string;
    username: string;
    password: string;
    phoneNumber: string,
    jobTitle: string;
    profilePictureUrl: File | null;
    passwordConfirm: string;
    roles: string [];
    organizationId: string | null;
    companyId: string | null;
}

export interface CreateCategory{
    organizationId: string;
    categoryName: string;
}

export interface CreateDepartament{
    organizationId: string;
    departamentName: string;
}

export interface CreateSla{
    organizationId: string;
    slaInMinutes: number;
    slaPriority: number;
    type: number;
}

export interface CreateSlaInOrganizationRequest{
    slaInMinutes: number;
    slaPriority: number;
    type: number;
}

export interface DeleteCategoryOrDepartament{
    OrganizationId: string;
    CategoryOrDepartamentId: string;
}

export interface CreateOrganizationRequest{
    Name: string;
    Slas: CreateSlaInOrganizationRequest[];
    CNPJ: string;
    Email: string;
    PhoneNumber: string;
    Categories: string [];
    Departaments: string [];
    Notes: string;
    Street: string;
    Number: string;
    Neighborhood: string;
    City: string;
    State: string;
    PostalCode: string;
    Country: string;
    ProfilePictureUrl: File | null;
}