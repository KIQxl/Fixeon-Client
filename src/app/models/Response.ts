export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}

export interface TokenPayload{
  id: string;
  username: string;
  email: string;
  roles: string[];
  organizationId: string;
}
