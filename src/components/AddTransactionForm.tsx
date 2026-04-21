import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { Bank } from '@/lib/cashflow';

interface AddTransactionFormProps {
  banks: Bank[];
  onAdd: (debtor: string, creditor: string, amount: number) => string;
}

export function AddTransactionForm({ banks, onAdd }: AddTransactionFormProps) {
  const [debtor, setDebtor] = useState('');
  const [creditor, setCreditor] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtor || !creditor || !amount) { toast.error('Fill all fields'); return; }
    if (debtor === creditor) { toast.error('Debtor and creditor must differ'); return; }
    const debtorBank = banks.find(b => b.name === debtor);
    if (debtorBank && !debtorBank.types.has('debit')) {
      toast.error(`${debtor} does not support debit transactions`);
      return;
    }
    const creditorBank = banks.find(b => b.name === creditor);
    if (creditorBank && !creditorBank.types.has('credit')) {
      toast.error(`${creditor} does not support credit transactions`);
      return;
    }
    const msg = onAdd(debtor, creditor, Number(amount));
    if (msg.startsWith('Transaction')) toast.success(msg);
    else toast.error(msg);
    setDebtor('');
    setCreditor('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Debtor (Payer)</Label>
        <Select value={debtor} onValueChange={setDebtor}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select bank" /></SelectTrigger>
          <SelectContent>{banks.map(b => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Creditor (Receiver)</Label>
        <Select value={creditor} onValueChange={setCreditor}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select bank" /></SelectTrigger>
          <SelectContent>{banks.map(b => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Amount (₹)</Label>
        <Input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1" />
      </div>
      <Button type="submit" className="w-full">
        <Send className="h-4 w-4 mr-2" /> Add Transaction
      </Button>
    </form>
  );
}
