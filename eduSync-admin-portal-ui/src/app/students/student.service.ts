import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'https://localhost:44373/api';

  constructor(private httpClient: HttpClient) { }

  getStudent(): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl + '/students');
  }
}
