import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { catchError, delay, finalize } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loader.startLoading();
    return next.handle(req).pipe(
      delay(5000),
      finalize(() => this.loader.stopLoading())
    );
  }
}
