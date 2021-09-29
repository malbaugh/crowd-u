import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { _filter } from 'src/Data/Information/Filter';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/Services/CurrentUser/current-user.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-landing-search',
  templateUrl: './landing-search.component.html',
  styleUrls: ['./landing-search.component.css']
})
export class LandingSearchComponent implements OnInit {
  
  constructor(
    public router: Router
  ) { }

  ngOnInit() {}
  
  public OnSubmit() {
    this.router.navigate(['/search/']);
  }
}
