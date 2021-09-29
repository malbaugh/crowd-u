import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-no-winners-notice',
  templateUrl: './no-winners-notice.component.html',
  styleUrls: ['./no-winners-notice.component.css']
})
export class NoWinnersNoticeComponent implements OnInit {

  public dataLoaded: boolean = false;

  constructor(
    public confirmDialogRef: MatDialogRef<NoWinnersNoticeComponent>
  ) { }

  ngOnInit() {
    this.dataLoaded = true;
  }

  public OnDelete() {
    this.confirmDialogRef.close(true);
  }

  public OnCancel() {
    this.confirmDialogRef.close(false);
  }

  public OnExit() {
    this.confirmDialogRef.close();
  }
}
