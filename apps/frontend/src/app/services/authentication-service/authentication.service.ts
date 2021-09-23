import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageKeys } from '../../models/local-storage.keys';
import { LocalStorageService } from '../local-storage/local-storage.service';

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  passwordConfirmed?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService) { }

  login({ email, password }: LoginForm): Observable<any> {
    const loginUrl = 'api/users/login';
    return this.httpClient.post<any>(loginUrl, { email, password }).pipe(
      map((token: { access_token: string; }) => {
        // localStorage.setItem(LocalStorageKeys.AccessToken, token.access_token);
        this.localStorageService.set(LocalStorageKeys.AccessToken, token.access_token);
        return token;
      })
    );
  }

  register(user: User): Observable<any> {
    return this.httpClient.post<any>('/api/users', user);
  }

  /**
   * getAuthenticationToken
   * @returns Authentication access token or null if token is not present
   */
  public getAuthenticationToken(): string | null {
    return this.localStorageService.get(LocalStorageKeys.AccessToken);
  }

  /**
   * storeAuthenticationToken
   * @param token Authentication access token
   */
  public storeAuthenticationToken(token: string) {
    this.localStorageService.set(LocalStorageKeys.AccessToken, token);
  }

}
