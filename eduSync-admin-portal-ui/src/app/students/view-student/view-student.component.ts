import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  header: string = '';
  genderList: Gender[] = [];
  studentId: string | null | undefined;

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }

  isNewStudent = false;
  displayProfileUrl: string = '';

  constructor(private readonly studentService: StudentService,
    private readonly genderService: GenderService, 
    private readonly route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if(this.studentId) {

          if(this.studentId.toLowerCase() === "Add".toLowerCase())
          {
            this.isNewStudent = true;
            this.header = "Add New Student";
            this.setImage();
          }
          else
          {
            this.isNewStudent = false;
            this.header = "Edit Student";

            this.studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) => {
                this.student = successResponse;
                this.setImage();
              },
              (errorResponse) => {
                this.setImage();
              }
              );
          }
            
          this.genderService.getGenderList()
          .subscribe(
            (successResponse) => {
              this.genderList = successResponse;
            }
          )
        }
      }
      );
    }

  onUpdate(): void {
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe(
      (successResponse) => {
        this.snackBar.open("Student's records successfully updated", undefined, {
          duration: 3000
        });
      },
      (error) => {
        //log it
      }
    )
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse) => {
        this.snackBar.open("Student's records successfully deleted", undefined, {
          duration: 3000
        });
        setTimeout(() => {
          this.router.navigateByUrl("students");
        }, 3000);
      },
      (error) => {
        //log it
      }
    )
  }

  onAdd(): void {
    this.studentService.addStudent(this.student)
    .subscribe(
      (successResponse) => {
        this.snackBar.open("Student's records successfully created", undefined,{
          duration: 3000
        });
        setTimeout(() => {
          this.router.navigateByUrl('students/${ successResponse.id }');
        }, 3000);
      },
      (error) => {

      }
    )
  }

  uploadImage(event: any): void {
     if(this.studentId){
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();

          // Show a notification
          this.snackBar.open("Profile Image successfully Updated", undefined,{
            duration: 3000
          });
        
        },
        (errorResponse) => {
          
        }
      );
     }
  }

  private setImage(): void {
    if(this.student.profileImageUrl){
      this.displayProfileUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    }
    else{
      this.displayProfileUrl = 'assets/images/user.png';
    }
  }
}
