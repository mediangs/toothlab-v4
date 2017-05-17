import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {duplicateArray} from "../shared/utils";

@Component({
  selector: 'app-dialog-viewsetting',
  templateUrl: './dialog-viewsetting.component.html',
  styleUrls: ['./dialog-viewsetting.component.css']
})
export class DialogViewsettingComponent implements OnInit {
  private previousData;
  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DialogViewsettingComponent>) {
  }

  ngOnInit() {
    this.previousData = duplicateArray(this.data);
  }
}
