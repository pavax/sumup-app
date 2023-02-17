import { NgModule } from '@angular/core';
import { CloseAfterSelectDirective } from './directives/close-after-select.directive';

@NgModule({
  declarations: [CloseAfterSelectDirective],
  exports: [CloseAfterSelectDirective],
})
export class SharedModule {}
