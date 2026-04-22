import { useState } from 'react';
import { CashFlowMinimizer } from '@/lib/cashflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bank } from '@/lib/cashflow';
import { Calculator, TrendingUp } from 'lucide-react';

interface ToolsPanelProps {
  cf: CashFlowMinimizer;
  banks: Bank[];
}

export function ToolsPanel({ cf, banks }: ToolsPanelProps) {
  const [interestResult, setInterestResult] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // Interest
  const [iDebtor, setIDebtor] = useState('');
  const [iCreditor, setICreditor] = useState('');
  const [iRate, setIRate] = useState('');
  const [iDays, setIDays] = useState('');

  // Prediction
  const [pBank, setPBank] = useState('');
  const [pDays, setPDays] = useState('30');

  const calcInterest = () => {
    if (!iDebtor || !iCreditor || !iRate || !iDays) return;
    const interest = cf.calculateInterest(iDebtor, iCreditor, Number(iRate), Number(iDays));
    setInterestResult(`₹${interest.toFixed(2)}`);
  };

  const predict = () => {
    if (!pBank) return;
    const p = cf.predictCashFlow(pBank, Number(pDays));
    if (!p) { setPredictionResult('No data available.'); return; }
    setPredictionResult(
      `Incoming: ₹${p.predictedIncoming.toFixed(2)} | Outgoing: ₹${p.predictedOutgoing.toFixed(2)} | Net: ₹${p.netPredictedFlow.toFixed(2)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Interest Calculator */}
      <div className="space-y-3">
        <h4 className="font-heading font-semibold text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4 text-accent" /> Interest Calculator
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Debtor</Label>
            <Select value={iDebtor} onValueChange={setIDebtor}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Bank" /></SelectTrigger>
              <SelectContent>{banks.map(b => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Creditor</Label>
            <Select value={iCreditor} onValueChange={setICreditor}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Bank" /></SelectTrigger>
              <SelectContent>{banks.map(b => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Rate (%)</Label>
            <Input type="number" value={iRate} onChange={e => setIRate(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Days</Label>
            <Input type="number" value={iDays} onChange={e => setIDays(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>
        </div>
        <Button onClick={calcInterest} size="sm" variant="outline" className="w-full text-xs">Calculate</Button>
        {interestResult && <p className="text-sm font-heading font-semibold text-accent">{interestResult}</p>}
      </div>

      <div className="border-t border-border" />

      {/* Cash Flow Prediction */}
      <div className="space-y-3">
        <h4 className="font-heading font-semibold text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" /> Cash Flow Prediction
        </h4>
        <div>
          <Label className="text-xs text-muted-foreground">Bank</Label>
          <Select value={pBank} onValueChange={setPBank}>
            <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Select bank" /></SelectTrigger>
            <SelectContent>{banks.map(b => <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Days</Label>
          <Input type="number" value={pDays} onChange={e => setPDays(e.target.value)} className="mt-1 h-8 text-xs" />
        </div>
        <Button onClick={predict} size="sm" variant="outline" className="w-full text-xs">Predict</Button>
        {predictionResult && <p className="text-xs font-medium text-muted-foreground mt-1">{predictionResult}</p>}
      </div>
    </div>
  );
}
