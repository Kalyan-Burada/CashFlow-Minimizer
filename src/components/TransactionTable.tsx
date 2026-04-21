import { Transaction } from '@/lib/cashflow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onClear?: (index: number) => void;
}

export function TransactionTable({ transactions, onClear }: TransactionTableProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No transactions yet. Add banks and transactions to get started.</p>;
  }

  return (
    <div className="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">#</TableHead>
            <TableHead className="text-xs">From</TableHead>
            <TableHead className="text-xs"></TableHead>
            <TableHead className="text-xs">To</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead>
            <TableHead className="text-xs">Time</TableHead>
            {onClear && <TableHead className="text-xs w-10"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t, i) => (
            <TableRow key={i}>
              <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium text-sm">{t.debtor}</TableCell>
              <TableCell><ArrowRight className="h-3 w-3 text-muted-foreground" /></TableCell>
              <TableCell className="font-medium text-sm">{t.creditor}</TableCell>
              <TableCell className="text-right font-heading font-semibold text-sm">₹{t.amount.toLocaleString()}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{t.timestamp.toLocaleTimeString()}</TableCell>
              {onClear && (
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onClear(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
