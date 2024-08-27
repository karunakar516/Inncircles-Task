import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  postData(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  putData(userData: any, id: any): Observable<any> {
    console.log(typeof(id))
    console.log(userData)
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData).pipe(catchError(this.handleError));
  }
  getFormData(id: any): Observable<any> {
    console.log(typeof(id))
    console.log(id)
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
