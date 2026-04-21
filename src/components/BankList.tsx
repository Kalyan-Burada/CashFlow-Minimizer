import { useState } from 'react';
import { Bank, VALID_PAYMENT_TYPES } from '@/lib/cashflow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface BankListProps {
  banks: Bank[];
  onUpdateTypes?: (name: string, types: string[]) => string;
}

export function BankList({ banks, onUpdateTypes }: BankListProps) {
  const [editingBank, setEditingBank] = useState<string | null>(null);
  const [editTypes, setEditTypes] = useState<Set<string>>(new Set());

  if (banks.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No banks added yet.</p>;
  }

  const startEdit = (bank: Bank) => {
    setEditingBank(bank.name);
    setEditTypes(new Set(bank.types));
  };

  const toggleType = (type: string) => {
    setEditTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const saveEdit = () => {
    if (!editingBank || !onUpdateTypes) return;
    if (editTypes.size === 0) { toast.error('Select at least one payment type'); return; }
    const msg = onUpdateTypes(editingBank, Array.from(editTypes));
    toast.success(msg);
    setEditingBank(null);
  };

  const cancelEdit = () => {
    setEditingBank(null);
    setEditTypes(new Set());
  };

  return (
    <div className="space-y-2.5 max-h-[400px] overflow-auto">
      {banks.map((bank) => (
        <div key={bank.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-sm">{bank.name}</p>
            {editingBank === bank.name ? (
              <div className="mt-1.5">
                <div className="flex flex-wrap gap-2.5 mb-2">
                  {VALID_PAYMENT_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-1 cursor-pointer">
                      <Checkbox checked={editTypes.has(type)} onCheckedChange={() => toggleType(type)} />
                      <span className="text-xs capitalize">{type}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-success" onClick={saveEdit}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={cancelEdit}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {Array.from(bank.types).map(type => (
                  <Badge key={type} variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                    {type}
                  </Badge>
                ))}
                {onUpdateTypes && (
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => startEdit(bank)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className={`font-heading font-bold text-sm ${bank.netAmount > 0 ? 'text-success' : bank.netAmount < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {bank.netAmount >= 0 ? '+' : ''}₹{bank.netAmount.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
