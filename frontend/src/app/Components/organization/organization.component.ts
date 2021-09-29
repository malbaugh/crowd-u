import { Component, OnInit } from '@angular/core';
import { ChallengeUser } from 'src/Helpers/Users/Classes/ChallengeUser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UsersService } from 'src/app/Services/Users/users.service';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { ChallengeOwnerCreateDepartmentFormComponent } from '../challenge-owner-create-department-form/challenge-owner-create-department-form.component';
import { OrganizationEditFormComponent } from '../organization-edit-form/organization-edit-form.component';
import { ConfirmDeleteFormComponent } from '../confirm-delete-form/confirm-delete-form.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  public user: ChallengeUser;
  public creatingChallenge: boolean = false;
  public dataLoaded: boolean = false;
  public image: string;
  public departments: ChallengeUser[] = []
  
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public currentUser: CurrentUserService,
    public usersService: UsersService,
    public snackBar: MatSnackBar,
    public activeRoute: ActivatedRoute) { 
      this.currentUser.UserLocation = "/organization";
    }

  ngOnInit() {
    if (this.currentUser.CurrentUserValue instanceof ChallengeUser) {
      this.user = this.currentUser.CurrentUserValue;
      
      this.usersService.GetDepartments(this.user).subscribe(
        data => {
          this.dataLoaded = true;
          this.departments = data;
        },
        error => {
          this.dataLoaded = true;
        }
      );
    }
  }

  public OnCreateDepartment() {
    let departmentRef = this.dialog.open(ChallengeOwnerCreateDepartmentFormComponent, {
      data: this.user
    });

    departmentRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {
          this.departments.push(data);
        }
      },
      error => {}
    );
  }

  public OnSeeDepartmentPerformance(department: ChallengeUser) {

  }

  public OnSeeDepartmentOpenChallenges(department: ChallengeUser) {
    this.router.navigate(["/owner/challenges/",department.UserRegistrationData.Username+"_ongoing"]);
  }

  public OnSeeDepartmentProfile(department: ChallengeUser) {
    this.router.navigate(["/profile/org/",department.UserRegistrationData.Username]);
  }

  public OnEditDepartment(department: ChallengeUser) {
    const accountDialogRef = this.dialog.open(OrganizationEditFormComponent, {
      data: department
    });
  }

  public OnDeleteDepartment(department: ChallengeUser) {
    const confirmDialogRef = this.dialog.open(ConfirmDeleteFormComponent, {
      data :{
        'title':'Are you sure?',
        'dialog':'Are you sure you want to delete this department? You cannot undo this action and you will lose access to the previous events the department hosted.',
        'confirm':'CONFIRM',
        'cancel':'CANCEL'
      }
    });

    confirmDialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.dataLoaded = false;
          this.usersService.DeleteDepartment(department).subscribe(
            data => {
              var i = this.departments.indexOf(department);
              if (i !== -1) {
                this.departments.splice(i,1);
              }

              this.dataLoaded = true;

              this.snackBar.open("Department successfully deleted.", "Close", {duration: 2000,panelClass: ['snackbar-color']});
            }, 
            error => {
              this.dataLoaded = true;
            }
          );
        }
      },
      error => {}
    );
  }
}
