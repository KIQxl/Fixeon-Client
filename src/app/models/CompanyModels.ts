export interface Company{
  id: string;
  name: string;
  cnpj: string | null;
}

export interface Tag{
  id: string;
  name: string;
}

export interface CreateTagRequest{
  name: string;
}