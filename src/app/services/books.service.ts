import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';
import { catchError, delay, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService, DialogData } from './alert.service';

export interface Book {
  id: number;
  title: string;
  author: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private loader: LoaderService,
    private alert: AlertService,
    private router: Router
  ) {}

  getAllBooks(): Observable<Book[]> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();
    return this.http
      .get<Book[]>(`${this.baseUrl}/books`, {
        headers,
      })
      .pipe(
        delay(5000),
        catchError((error) => this.handleError(error)),
        finalize(() => this.loader.stopLoading())
      );
  }

  getBookById(bookId: number): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();
    return this.http
      .get<Book>(`${this.baseUrl}/books/${bookId}`, {
        headers,
      })
      .pipe(
        delay(5000),
        finalize(() => this.loader.stopLoading())
      );
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();
    return this.http
      .post<Book>(`${this.baseUrl}/books`, book, {
        headers,
      })
      .pipe(
        delay(5000),
        finalize(() => this.loader.stopLoading())
      );
  }

  updateBook(book: Book): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();
    return this.http
      .put<Book>(`${this.baseUrl}/books/${book.id}`, book, {
        headers,
      })
      .pipe(
        delay(5000),
        finalize(() => this.loader.stopLoading())
      );
  }

  deleteBookById(bookId: number): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();
    return this.http
      .delete<Book>(`${this.baseUrl}/books/${bookId}`, {
        headers,
      })
      .pipe(
        delay(5000),
        finalize(() => this.loader.stopLoading())
      );
  }

  private getAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getAccessToken()}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      const dialogData: DialogData = {
        status: error.status,
        statusText: error.statusText,
        message: 'You need to authenticate first',
      };

      this.alert
        .showError(dialogData)
        .subscribe(() => this.router.navigate(['login']));
    }
    return throwError(error);
  }
}
