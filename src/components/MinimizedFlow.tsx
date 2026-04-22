import { MinimizedTransaction } from '@/lib/cashflow';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface MinimizedFlowProps {
  transactions: MinimizedTransaction[];
  originalCount: number;
}

export function MinimizedFlow({ transactions, originalCount }: MinimizedFlowProps) {
  if (transactions.length === 0 && originalCount === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No transactions to minimize.</p>
        <p className="text-xs text-muted-foreground mt-1">Add some transactions first, then click "Minimize Flow".</p>
      </div>
    );
  }

  if (transactions.length === 0 && originalCount > 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
        <p className="text-lg font-heading font-bold text-foreground">All Settled!</p>
        <p className="text-sm text-muted-foreground mt-1">
          All {originalCount} transactions cancel out — no money needs to move.
        </p>
      </div>
    );
  }

  const savings = originalCount - transactions.length;
  const savingsPercent = originalCount > 0 ? Math.round((savings / originalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted/50 border border-border p-3 text-center">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Original</p>
          <p className="text-xl font-heading font-bold text-foreground">{originalCount}</p>
        </div>
        <div className="rounded-lg border border-accent/30 p-3 text-center" style={{ background: 'hsl(var(--accent) / 0.08)' }}>
          <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">Minimized</p>
          <p className="text-xl font-heading font-bold text-accent">{transactions.length}</p>
        </div>
        <div className="rounded-lg bg-success/10 border border-success/30 p-3 text-center">
          <p className="text-[10px] font-semibold text-success uppercase tracking-widest">Saved</p>
          <p className="text-xl font-heading font-bold text-success">{savingsPercent}%</p>
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-2">
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-muted/30 border border-border hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="font-heading font-semibold">{t.from}</span>
              <ArrowRight className="h-3.5 w-3.5 text-accent" />
              <span className="font-heading font-semibold">{t.to}</span>
            </div>
            <span className="font-heading font-bold text-sm text-accent">₹{t.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
