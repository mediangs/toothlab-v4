import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-viewsetting',
  templateUrl: './dialog-viewsetting.component.html',
  styleUrls: ['./dialog-viewsetting.component.css']
})
export class DialogViewsettingComponent {
  passedData;
  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DialogViewsettingComponent>) {
    this.passedData = data;
  }
}
