import { TrendingUp, TrendingDown, Building2, ArrowRightLeft, Activity, IndianRupee } from 'lucide-react';

interface StatsCardsProps {
  totalBanks: number;
  totalTransactions: number;
  totalVolume: number;
  topDebtor: { name: string; netAmount: number } | null;
  topCreditor: { name: string; netAmount: number } | null;
  mostActive: { name: string; count: number } | null;
}

export function StatsCards({ totalBanks, totalTransactions, totalVolume, topDebtor, topCreditor, mostActive }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Banks',
      value: totalBanks,
      icon: Building2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Transactions',
      value: totalTransactions,
      icon: ArrowRightLeft,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Volume',
      value: `₹${totalVolume.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Top Debtor',
      value: topDebtor && topDebtor.netAmount !== 0
        ? topDebtor.name
        : '—',
      subtitle: topDebtor && topDebtor.netAmount !== 0
        ? `₹${Math.abs(topDebtor.netAmount).toLocaleString()}`
        : undefined,
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Top Creditor',
      value: topCreditor && topCreditor.netAmount !== 0
        ? topCreditor.name
        : '—',
      subtitle: topCreditor && topCreditor.netAmount !== 0
        ? `₹${topCreditor.netAmount.toLocaleString()}`
        : undefined,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Most Active',
      value: mostActive ? mostActive.name : '—',
      subtitle: mostActive ? `${mostActive.count} txns` : undefined,
      icon: Activity,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="stat-card group">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${card.bgColor} ${card.color} transition-transform group-hover:scale-110`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">{card.label}</p>
          <p className="text-base font-heading font-bold text-foreground truncate">{card.value}</p>
          {'subtitle' in card && card.subtitle && (
            <p className={`text-xs font-medium mt-0.5 ${card.color}`}>{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}
