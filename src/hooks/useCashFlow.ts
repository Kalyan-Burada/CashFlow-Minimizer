import { useState, useCallback, useRef } from 'react';
import { CashFlowMinimizer, Transaction, MinimizedTransaction } from '@/lib/cashflow';

export function useCashFlow() {
  const cfRef = useRef(new CashFlowMinimizer());
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick(t => t + 1), []);

  const cf = cfRef.current;

  const addBank = useCallback((name: string, types: string[]) => {
    const msg = cf.addBank(name, types);
    rerender();
    return msg;
  }, [cf, rerender]);

  const addTransaction = useCallback((debtor: string, creditor: string, amount: number) => {
    const msg = cf.addTransaction(debtor, creditor, amount);
    rerender();
    return msg;
  }, [cf, rerender]);

  const clearTransaction = useCallback((index: number) => {
    const msg = cf.clearTransaction(index);
    rerender();
    return msg;
  }, [cf, rerender]);

  const updateBankTypes = useCallback((name: string, types: string[]) => {
    const msg = cf.updateBankTypes(name, types);
    rerender();
    return msg;
  }, [cf, rerender]);

  return {
    cf,
    addBank,
    addTransaction,
    clearTransaction,
    updateBankTypes,
    banks: Array.from(cf.banks.values()),
    transactions: cf.transactionHistory,
    stats: cf.getStats(),
    rerender,
  };
}
