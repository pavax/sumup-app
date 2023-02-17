import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { updateSWVersion } from '../../store/core.actions';

@Component({
  selector: 'app-update-dialog',
  templateUrl: 'update.dialog.component.html',
})
export class UpdateDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<UpdateDialogComponent>,
    private store: Store
  ) {}

  installUpdate() {
    this.store.dispatch(updateSWVersion());
  }
}
