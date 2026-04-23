import { useState } from 'react';
import { useCashFlow } from '@/hooks/useCashFlow';
import { StatsCards } from '@/components/StatsCards';
import { AddBankForm } from '@/components/AddBankForm';
import { AddTransactionForm } from '@/components/AddTransactionForm';
import { TransactionTable } from '@/components/TransactionTable';
import { BankList } from '@/components/BankList';
import { MinimizedFlow } from '@/components/MinimizedFlow';
import { ToolsPanel } from '@/components/ToolsPanel';
import { ReportsPanel } from '@/components/ReportsPanel';
import { MinimizedTransaction } from '@/lib/cashflow';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2, ArrowRightLeft, Zap, Calculator, BarChart3, GitBranch, Wallet, TrendingUp,
} from 'lucide-react';

const Index = () => {
  const { cf, addBank, addTransaction, clearTransaction, updateBankTypes, banks, transactions, stats } = useCashFlow();
  const [minimized, setMinimized] = useState<MinimizedTransaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const handleMinimize = () => {
    const result = cf.minimizeCashFlow();
    setMinimized(result);
    toast.success(`Cash flow minimized: ${transactions.length} → ${result.length} transactions`);
  };

  const handleClear = (index: number) => {
    const msg = clearTransaction(index);
    toast.info(msg);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
              <GitBranch className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground tracking-tight">
                Cash Flow Minimizer
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                Multi-Bank Transaction Optimization System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              <Wallet className="h-3.5 w-3.5" />
              <span>{stats.totalBanks} Banks</span>
              <span className="text-border">|</span>
              <TrendingUp className="h-3.5 w-3.5" />
              <span>₹{stats.totalVolume.toLocaleString()}</span>
            </div>
            <button
              onClick={handleMinimize}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              style={{ background: 'var(--gradient-accent)', color: 'white' }}
            >
              <Zap className="h-4 w-4" /> Minimize Flow
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsCards
          totalBanks={stats.totalBanks}
          totalTransactions={stats.totalTransactions}
          totalVolume={stats.totalVolume}
          topDebtor={stats.topDebtor}
          topCreditor={stats.topCreditor}
          mostActive={stats.mostActive}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border border-border p-1 h-auto gap-1">
            <TabsTrigger value="overview" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <ArrowRightLeft className="h-3.5 w-3.5" /> Transactions
            </TabsTrigger>
            <TabsTrigger value="banks" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <Building2 className="h-3.5 w-3.5" /> Banks
            </TabsTrigger>
            <TabsTrigger value="minimized" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <Zap className="h-3.5 w-3.5" /> Minimized
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <Calculator className="h-3.5 w-3.5" /> Tools
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2">
              <BarChart3 className="h-3.5 w-3.5" /> Reports
            </TabsTrigger>
          </TabsList>

          <div className="mt-5">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-accent" />
                        Transaction History
                        <span className="ml-auto text-xs text-muted-foreground font-normal">{transactions.length} records</span>
                      </h3>
                    </div>
                    <div className="p-5">
                      <TransactionTable transactions={transactions} onClear={handleClear} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-accent" />
                        Add Transaction
                      </h3>
                    </div>
                    <div className="p-5">
                      <AddTransactionForm banks={banks} onAdd={addTransaction} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="banks">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-accent" />
                        Registered Banks
                        <span className="ml-auto text-xs text-muted-foreground font-normal">{banks.length} banks</span>
                      </h3>
                    </div>
                    <div className="p-5">
                      <BankList banks={banks} onUpdateTypes={updateBankTypes} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-accent" />
                        Add New Bank
                      </h3>
                    </div>
                    <div className="p-5">
                      <AddBankForm onAdd={addBank} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="minimized">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    Minimized Cash Flow
                  </h3>
                  <button
                    onClick={handleMinimize}
                    className="text-xs text-accent hover:underline font-semibold"
                  >
                    Re-calculate
                  </button>
                </div>
                <div className="p-5">
                  <MinimizedFlow transactions={minimized} originalCount={transactions.length} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools">
              <div className="bg-card rounded-xl border border-border overflow-hidden max-w-2xl">
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-accent" />
                    Financial Tools
                  </h3>
                </div>
                <div className="p-5">
                  <ToolsPanel cf={cf} banks={banks} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    Reports & Analytics
                  </h3>
                </div>
                <div className="p-5">
                  <ReportsPanel cf={cf} banks={banks} />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Cash Flow Minimizer — B.Tech Project • Built with MinHeap-based Optimization Algorithm
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
