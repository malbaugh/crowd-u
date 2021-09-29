import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public dataLoaded: boolean = false;

  constructor(
    public snackBar: MatSnackBar,
    public imageDialog: MatDialogRef<ImageUploaderComponent>,
    @Inject(MAT_DIALOG_DATA) public imageEvent,
  ) { }

  ngOnInit() {
    this.imageChangedEvent = this.imageEvent;
    this.dataLoaded = true;
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }
  
  public OnSave() {
    this.imageDialog.close(this.croppedImage);
  }

  public OnExit() {
    this.imageDialog.close();
  }
}
