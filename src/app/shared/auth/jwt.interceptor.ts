import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {JWT_OPTIONS} from './jwtoptions.token';
import {JwtService} from './jwt.service';

// TODO: export to its own module/package
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(@Inject(JWT_OPTIONS) private config, private jwtService: JwtService) {
  }

  handle(token: string, request: HttpRequest<any>, next: HttpHandler) {
    let tokenIsExpired: boolean;

    if (!token && this.config.throwNoTokenError) {
      throw new Error('No token returned from tokenGetter function.');
    }

    if (this.config.skipWhenExpired) {
      tokenIsExpired = token ? this.jwtService.isTokenExpired(token) : true;
    }

    if (token && tokenIsExpired && this.config.skipWhenExpired) {
      request = request.clone();
    } else {
      request = request.clone({
        setHeaders: {
          [this.config.headerName]: `${this.config.authScheme}${this.config.tokenGetter()}`
        }
      });
    }

    return next.handle(request);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.config.getToken();

    if (token instanceof Promise) {
      return Observable.fromPromise(token)
        .mergeMap((asyncToken: string) => this.handle(asyncToken, request, next));
    } else {
      return this.handle(token, request, next);
    }
  }
}
