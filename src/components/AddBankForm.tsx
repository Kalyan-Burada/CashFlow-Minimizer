import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { VALID_PAYMENT_TYPES } from '@/lib/cashflow';

interface AddBankFormProps {
  onAdd: (name: string, types: string[]) => string;
}

export function AddBankForm({ onAdd }: AddBankFormProps) {
  const [name, setName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Enter a bank name'); return; }
    if (selectedTypes.size === 0) { toast.error('Select at least one payment type'); return; }
    const msg = onAdd(name.trim(), Array.from(selectedTypes));
    toast.success(msg);
    setName('');
    setSelectedTypes(new Set());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Bank Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HDFC" className="mt-1" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Payment Types</Label>
        <div className="flex flex-wrap gap-3 mt-2">
          {VALID_PAYMENT_TYPES.map(type => (
            <label key={type} className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={selectedTypes.has(type)}
                onCheckedChange={() => toggleType(type)}
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        <Plus className="h-4 w-4 mr-2" /> Add Bank
      </Button>
    </form>
  );
}
