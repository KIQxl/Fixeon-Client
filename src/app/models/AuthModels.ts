export interface ApplicationUser{
    id: string;
    username: string;
    email: string;
    organization: string | null;
    organizationId: string | null;
    roles: string [];
}

export interface Organization{
    id: string;
    name: string;
    companyId: string;
}

export interface UpdateApplicationUser{
    id: string | null;
    username: string | null;
    email: string | null;
    organizationId: string | null;
}