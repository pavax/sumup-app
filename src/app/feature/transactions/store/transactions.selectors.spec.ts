import * as fromTransactions from './transactions.reducer';
import { selectTransactionsState } from './transactions.selectors';

describe('Transactions Selectors', () => {
  it('should select the feature state', () => {
    const result = selectTransactionsState({
      [fromTransactions.transactionsFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
