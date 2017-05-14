import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-section-info',
  templateUrl: './dialog-section-info.component.html',
  styleUrls: ['./dialog-section-info.component.css']
})
export class DialogSectionInfoComponent implements OnInit {
  cso;
  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<DialogSectionInfoComponent>) {
    this.cso = data;
  }

  ngOnInit() {
  }
}
