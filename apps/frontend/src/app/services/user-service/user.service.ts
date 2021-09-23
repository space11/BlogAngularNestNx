import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserData } from '../../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();

    params.append('page', String(page));
    params.append('size', String(size));
    const url = '/api/users';

    return this.http.get<UserData>(url, { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    );
  };
}
