export const VALID_PAYMENT_TYPES = ['credit', 'debit', 'upi', 'neft', 'rtgs', 'imps'] as const;
export type PaymentType = typeof VALID_PAYMENT_TYPES[number];

export function validatePaymentTypes(types: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const t of types) {
    if (VALID_PAYMENT_TYPES.includes(t as PaymentType)) valid.push(t);
    else invalid.push(t);
  }
  return { valid, invalid };
}

export interface Bank {
  name: string;
  netAmount: number;
  types: Set<string>;
}

export interface Transaction {
  debtor: string;
  creditor: string;
  amount: number;
  timestamp: Date;
}

export interface MinimizedTransaction {
  from: string;
  to: string;
  amount: number;
}

export interface BankStatement {
  bankName: string;
  totalIncoming: number;
  totalOutgoing: number;
  transactions: Transaction[];
}

export interface TransactionReport {
  bankName: string;
  totalTransactions: number;
  totalAmount: number;
  avgAmount: number;
}

export interface CashFlowPrediction {
  bankName: string;
  days: number;
  predictedIncoming: number;
  predictedOutgoing: number;
  netPredictedFlow: number;
}

// MinHeap implementation matching the Python code
class MinHeap {
  heap: [number, string][] = [];

  push(item: [number, string]) {
    this.heap.push(item);
    this._heapifyUp(this.heap.length - 1);
  }

  pop(): [number, string] | null {
    if (!this.heap.length) return null;
    if (this.heap.length === 1) return this.heap.pop()!;
    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this._heapifyDown(0);
    return root;
  }

  get size() { return this.heap.length; }

  private _heapifyUp(index: number) {
    let parent = Math.floor((index - 1) / 2);
    while (index > 0 && this.heap[index][0] < this.heap[parent][0]) {
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
      parent = Math.floor((index - 1) / 2);
    }
  }

  private _heapifyDown(index: number) {
    const size = this.heap.length;
    let smallest = index;
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    if (left < size && this.heap[left][0] < this.heap[smallest][0]) smallest = left;
    if (right < size && this.heap[right][0] < this.heap[smallest][0]) smallest = right;
    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this._heapifyDown(smallest);
    }
  }
}

export class CashFlowMinimizer {
  banks: Map<string, Bank> = new Map();
  adjList: Map<string, [string, number][]> = new Map();
  transactionHistory: Transaction[] = [];

  addBank(name: string, types: string[]): string {
    if (this.banks.has(name)) return `Bank ${name} already exists.`;
    this.banks.set(name, { name, netAmount: 0, types: new Set(types) });
    this.adjList.set(name, []);
    return `Bank ${name} added successfully.`;
  }

  updateBankTypes(name: string, types: string[]): string {
    const bank = this.banks.get(name);
    if (!bank) return `Bank ${name} does not exist.`;
    bank.types = new Set(types);
    return `Payment types for ${name} updated successfully.`;
  }

  addTransaction(debtor: string, creditor: string, amount: number): string {
    if (!this.banks.has(debtor) || !this.banks.has(creditor))
      return "Both banks must exist in the system.";
    if (amount <= 0) return "Amount must be positive.";

    const debtorBank = this.banks.get(debtor)!;
    const creditorBank = this.banks.get(creditor)!;

    // Match Python validation: debtor must support debit, creditor must support credit
    if (!debtorBank.types.has('debit'))
      return `Bank ${debtor} does not support debit transactions.`;
    if (!creditorBank.types.has('credit'))
      return `Bank ${creditor} does not support credit transactions.`;

    debtorBank.netAmount -= amount;
    creditorBank.netAmount += amount;

    this.adjList.get(debtor)!.push([creditor, amount]);
    this.transactionHistory.push({ debtor, creditor, amount, timestamp: new Date() });
    return `Transaction added: ${debtor} → ${creditor}: ₹${amount}`;
  }

  getBankBalance(name: string): number | null {
    return this.banks.get(name)?.netAmount ?? null;
  }

  getTopDebtorCreditor(): { debtor: Bank | null; creditor: Bank | null } {
    let debtor: Bank | null = null;
    let creditor: Bank | null = null;
    for (const bank of this.banks.values()) {
      if (!debtor || bank.netAmount < debtor.netAmount) debtor = bank;
      if (!creditor || bank.netAmount > creditor.netAmount) creditor = bank;
    }
    return { debtor, creditor };
  }

  getMostActiveBank(): { name: string; count: number } | null {
    const counts: Record<string, number> = {};
    for (const name of this.banks.keys()) counts[name] = 0;
    for (const t of this.transactionHistory) {
      counts[t.debtor] = (counts[t.debtor] || 0) + 1;
      counts[t.creditor] = (counts[t.creditor] || 0) + 1;
    }
    let best: { name: string; count: number } | null = null;
    for (const [name, count] of Object.entries(counts)) {
      if (!best || count > best.count) best = { name, count };
    }
    if (best && best.count === 0) return null;
    return best;
  }

  // MinHeap-based minimization matching the Python implementation
  minimizeCashFlow(): MinimizedTransaction[] {
    // Save original balances, work on copies
    const savedBalances = new Map<string, number>();
    for (const [name, bank] of this.banks) {
      savedBalances.set(name, bank.netAmount);
    }

    const debtorHeap = new MinHeap();
    const creditorHeap = new MinHeap();

    for (const [name, bank] of this.banks) {
      if (bank.netAmount < 0) {
        debtorHeap.push([Math.abs(bank.netAmount), name]);
      } else if (bank.netAmount > 0) {
        creditorHeap.push([bank.netAmount, name]);
      }
    }

    const results: MinimizedTransaction[] = [];

    while (debtorHeap.size > 0 && creditorHeap.size > 0) {
      const [debtorAmount, debtorName] = debtorHeap.pop()!;
      const [creditorAmount, creditorName] = creditorHeap.pop()!;

      const transactionAmount = Math.min(debtorAmount, creditorAmount);
      if (transactionAmount > 0) {
        results.push({ from: debtorName, to: creditorName, amount: transactionAmount });
      }

      const remainingDebt = debtorAmount - transactionAmount;
      const remainingCredit = creditorAmount - transactionAmount;

      if (remainingDebt > 0) debtorHeap.push([remainingDebt, debtorName]);
      if (remainingCredit > 0) creditorHeap.push([remainingCredit, creditorName]);
    }

    // Restore original balances (don't mutate state)
    for (const [name, bal] of savedBalances) {
      this.banks.get(name)!.netAmount = bal;
    }

    return results;
  }

  clearTransaction(index: number): string {
    if (index < 0 || index >= this.transactionHistory.length) return "Invalid index.";
    const t = this.transactionHistory.splice(index, 1)[0];
    this.banks.get(t.debtor)!.netAmount += t.amount;
    this.banks.get(t.creditor)!.netAmount -= t.amount;
    // Remove from adj_list
    const adj = this.adjList.get(t.debtor);
    if (adj) {
      const idx = adj.findIndex(([c, a]) => c === t.creditor && a === t.amount);
      if (idx !== -1) adj.splice(idx, 1);
    }
    return `Transaction cleared: ${t.debtor} → ${t.creditor}: ₹${t.amount}`;
  }

  calculateInterest(debtor: string, creditor: string, rate: number, days: number): number {
    const adj = this.adjList.get(debtor);
    const outstandingDebt = adj
      ? adj.filter(([c]) => c === creditor).reduce((sum, [, a]) => sum + a, 0)
      : 0;
    return outstandingDebt * (rate / 100) * (days / 365);
  }

  generateBankStatement(bankName: string, startDate?: Date, endDate?: Date): BankStatement | null {
    if (!this.banks.has(bankName)) return null;
    let txns = this.transactionHistory.filter(t => t.debtor === bankName || t.creditor === bankName);
    if (startDate) txns = txns.filter(t => t.timestamp >= startDate);
    if (endDate) txns = txns.filter(t => t.timestamp <= endDate);
    const totalIncoming = txns.filter(t => t.creditor === bankName).reduce((s, t) => s + t.amount, 0);
    const totalOutgoing = txns.filter(t => t.debtor === bankName).reduce((s, t) => s + t.amount, 0);
    return { bankName, totalIncoming, totalOutgoing, transactions: txns };
  }

  generateTransactionReport(): TransactionReport[] {
    const reports: TransactionReport[] = [];
    for (const [name] of this.banks) {
      const txns = this.transactionHistory.filter(t => t.debtor === name || t.creditor === name);
      const total = txns.reduce((s, t) => s + t.amount, 0);
      reports.push({
        bankName: name,
        totalTransactions: txns.length,
        totalAmount: total,
        avgAmount: txns.length > 0 ? total / txns.length : 0,
      });
    }
    return reports;
  }

  predictCashFlow(bankName: string, days: number): CashFlowPrediction | null {
    const txns = this.transactionHistory.filter(t => t.debtor === bankName || t.creditor === bankName);
    if (txns.length === 0) return null;

    const incoming = txns.filter(t => t.creditor === bankName);
    const outgoing = txns.filter(t => t.debtor === bankName);

    const avgIn = incoming.length > 0 ? incoming.reduce((s, t) => s + t.amount, 0) / incoming.length : 0;
    const avgOut = outgoing.length > 0 ? outgoing.reduce((s, t) => s + t.amount, 0) / outgoing.length : 0;

    const timestamps = txns.map(t => t.timestamp.getTime());
    const rangeMs = Math.max(...timestamps) - Math.min(...timestamps);
    const rangeDays = Math.max(rangeMs / (1000 * 60 * 60 * 24), 1);

    const freqIn = incoming.length / rangeDays;
    const freqOut = outgoing.length / rangeDays;

    const predictedIncoming = avgIn * freqIn * days;
    const predictedOutgoing = avgOut * freqOut * days;

    return {
      bankName,
      days,
      predictedIncoming,
      predictedOutgoing,
      netPredictedFlow: predictedIncoming - predictedOutgoing,
    };
  }

  getMonthlySummary(month: number, year: number): { bankName: string; incoming: number; outgoing: number }[] {
    const results: { bankName: string; incoming: number; outgoing: number }[] = [];
    for (const [name] of this.banks) {
      const incoming = this.transactionHistory
        .filter(t => t.creditor === name && t.timestamp.getMonth() + 1 === month && t.timestamp.getFullYear() === year)
        .reduce((s, t) => s + t.amount, 0);
      const outgoing = this.transactionHistory
        .filter(t => t.debtor === name && t.timestamp.getMonth() + 1 === month && t.timestamp.getFullYear() === year)
        .reduce((s, t) => s + t.amount, 0);
      results.push({ bankName: name, incoming, outgoing });
    }
    return results;
  }

  filterTransactions(opts: {
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    nameFilter?: string;
  }): Transaction[] {
    let txns = [...this.transactionHistory];
    if (opts.startDate) txns = txns.filter(t => t.timestamp >= opts.startDate!);
    if (opts.endDate) txns = txns.filter(t => t.timestamp <= opts.endDate!);
    if (opts.minAmount !== undefined) txns = txns.filter(t => t.amount >= opts.minAmount!);
    if (opts.maxAmount !== undefined) txns = txns.filter(t => t.amount <= opts.maxAmount!);
    if (opts.nameFilter) txns = txns.filter(t => t.debtor.includes(opts.nameFilter!) || t.creditor.includes(opts.nameFilter!));
    return txns;
  }

  getStats() {
    const totalBanks = this.banks.size;
    const totalTransactions = this.transactionHistory.length;
    const totalVolume = this.transactionHistory.reduce((s, t) => s + t.amount, 0);
    const { debtor, creditor } = this.getTopDebtorCreditor();
    const mostActive = this.getMostActiveBank();
    return { totalBanks, totalTransactions, totalVolume, topDebtor: debtor, topCreditor: creditor, mostActive };
  }
}
