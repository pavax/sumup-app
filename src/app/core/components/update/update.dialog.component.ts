import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {appUpdateVersion} from "../../store/core.actions";

@Component({
  selector: 'app-update-dialog',
  templateUrl: 'update.dialog.component.html',
})
export class UpdateDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<UpdateDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {

  }

  installUpdate() {
    this.store.dispatch(appUpdateVersion());
  }
}
