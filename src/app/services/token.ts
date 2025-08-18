import { Injectable } from '@angular/core';
import { TokenPayload } from '../models/Response';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Token {

  constructor() { }

  GetPayload(): TokenPayload | null{
    const token = sessionStorage.getItem('token');
    if(!token) return null;
    const decoded = jwtDecode<TokenPayload>(token);

    return decoded;
  }
}
