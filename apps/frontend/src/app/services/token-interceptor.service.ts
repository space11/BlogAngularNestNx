import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication-service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  private AUTH_HEADER = 'Authorization';

  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = this.addAuthenticationToken(req);
    console.log(19);


    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          // TODO: Add login to handle 401 and refresh token here
        }
        return throwError(error);
      })
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAuthenticationToken();
    console.log({ token });

    // If we dont have stored token dont try to attach it
    if (!token) {
      return request;
    }

    // TODO: If you are calling an outside domain then do not add the
    // if (!request.url.match(/www.mydomain.com\//)) {
    //   return request;
    // }

    return request.clone({
      setHeaders: { [this.AUTH_HEADER]: `Bearer ${token}` }
    });
  }
}
