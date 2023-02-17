import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorHandler {
  constructor(private snackBar: MatSnackBar) {}

  handle() {
    this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK');
  }
}
