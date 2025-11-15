import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressServices {

  constructor(private http_client: HttpClient) { }

  GetAddressByCEP(cep: string): Observable<viaCEPObject>{
    return this.http_client.get<viaCEPObject>(`https://viacep.com.br/ws/${cep}/json/`);
  }

  GetCountries(){
     return this.http_client
    .get<CountryAPIResponse[]>('https://restcountries.com/v3.1/all?fields=name')
    .pipe(
      map((res: CountryAPIResponse[]) =>
        res.map(c => c.name.common).sort()
      )
    );
  }
}

export interface viaCEPObject{
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  estado: string;
}

export interface CountryAPIResponse {
  name: {
    common: string;
  };
}