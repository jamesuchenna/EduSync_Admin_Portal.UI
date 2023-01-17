import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/api-models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'https://localhost:44373/api';

  constructor(private httpClient: HttpClient) { }

  getStudent(): Observable<Student[]>{
    return this.httpClient.get<Student[]>(this.baseUrl + '/students');
  }
}
