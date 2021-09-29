import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUserService } from '../CurrentUser/current-user.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private currentUser: CurrentUserService,
        private snackBar: MatSnackBar) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status == 401) {
                this.snackBar.open("Username or password incorrect.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
            else if (err.status == 403) {
                this.snackBar.open("Verify your email before doing this.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }
            else if (err.status == 409) {
                this.snackBar.open("The email or username you provided are already taken (for teams, this could be your team name).", "Close", {duration: 3000,panelClass: ['snackbar-color']});
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}