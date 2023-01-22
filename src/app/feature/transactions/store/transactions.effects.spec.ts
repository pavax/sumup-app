import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TransactionsEffects } from './transactions.effects';

describe('TransactionsEffects', () => {
  let actions$: Observable<any>;
  let effects: TransactionsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TransactionsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
