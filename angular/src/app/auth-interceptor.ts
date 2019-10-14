import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './services/requestApi.service';

@Injectable()
  /*
  HttpInterceptor is the interface provided by angular that forces you to implement the intercept method so that we can call this method for request that are leaving second argument next allow to leave the request and allow other part of our application to execute and is of type http handler also provided by http module of angular
  */
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: ApiService) { }
  // In order to make this interceptor work we have to provide it as a service but bit differently by adding an javascript object to provider array in app.module.ts

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    // clone method is used to make the copy of the request and we can also edit request via clone
    const authRequest = req.clone({
    // .set method is used to add new headers to the existing header of request if that header already existed it will overright it
    // here we are one additional header to our requests
      headers: req.headers.set('Authorization',  authToken)
    });
    return next.handle(authRequest);
  }
}
