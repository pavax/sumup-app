import { Directive, OnInit } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: '[appCloseAfterSelect]',
})
export class CloseAfterSelectDirective implements OnInit {
  constructor(private select: MatSelect) {}

  ngOnInit() {
    this.select.selectionChange.subscribe(() => {
      this.select.close();
    });
  }
}
