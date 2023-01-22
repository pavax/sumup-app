import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-offline-dialog',
  templateUrl: 'offline.dialog.component.html',
})
export class OfflineDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<OfflineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    console.log(this.data);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
