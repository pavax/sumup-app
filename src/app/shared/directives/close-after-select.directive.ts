import {Directive, OnInit} from "@angular/core";
import {MatSelect} from "@angular/material/select";

@Directive({
  selector: '[close-after-select]'
})
export class CloseAfterSelectDirective implements OnInit {

  constructor(private select: MatSelect) {
  }

  ngOnInit() {
    this.select.selectionChange.subscribe(value => {
      this.select.close();
    })
  }
}
