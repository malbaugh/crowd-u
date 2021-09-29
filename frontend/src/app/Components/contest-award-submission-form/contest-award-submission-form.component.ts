import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-contest-award-submission-form',
  templateUrl: './contest-award-submission-form.component.html',
  styleUrls: ['./contest-award-submission-form.component.css']
})
export class ContestAwardSubmissionFormComponent implements OnInit {

  public dataLoaded: boolean = false;
  public awardGroupOptions: Observable<string[]>;
  public awards: string[] = [
    '1st Place',
    '2nd Place',
    '3rd Place',
    '4th Place',
    '5th Place',
    'Honorable Mention',
    "People's Choice"
  ];
  public ngZone: NgZone;
  public winnerForm: FormGroup;
  
  constructor(
    public fb: FormBuilder,
    public winnerDialogForm: MatDialogRef<ContestAwardSubmissionFormComponent>,
  ) { }

  ngOnInit() {
    this.winnerForm = this.fb.group({
      award: ['']
    });

    this.awardGroupOptions = this.winnerForm.get('award')!.valueChanges.pipe(startWith(''),map(value => this._filterAwards(value)));

    this.dataLoaded = true;
  }

  public _filterAwards(value: string): string[] {
    if (value) {
      value = value.toLowerCase();
      return this.awards.filter(item => item.toLowerCase().indexOf(value) === 0).filter(group => group.length > 0);
    }
    return this.awards;
  }

  public get award() { return this.winnerForm.get('award'); }

  public OnSubmitWinner() {
    this.winnerDialogForm.close(this.award.value);
  }

  public OnExit() {
    this.winnerDialogForm.close();
  }
}
