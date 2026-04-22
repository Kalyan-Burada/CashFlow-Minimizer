import { CashFlowMinimizer, Bank } from '@/lib/cashflow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ReportsPanelProps {
  cf: CashFlowMinimizer;
  banks: Bank[];
}

export function ReportsPanel({ cf }: ReportsPanelProps) {
  const reports = cf.generateTransactionReport();
  const now = new Date();
  const monthly = cf.getMonthlySummary(now.getMonth() + 1, now.getFullYear());

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">Transaction Report</h4>
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Bank</TableHead>
                  <TableHead className="text-xs text-right">Txns</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="text-xs text-right">Avg</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(r => (
                  <TableRow key={r.bankName}>
                    <TableCell className="font-medium text-sm">{r.bankName}</TableCell>
                    <TableCell className="text-right text-sm">{r.totalTransactions}</TableCell>
                    <TableCell className="text-right text-sm font-heading">₹{r.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">₹{r.avgAmount.toFixed(0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      <div>
        <h4 className="font-heading font-semibold text-sm mb-3">
          Monthly Summary ({now.toLocaleString('default', { month: 'long', year: 'numeric' })})
        </h4>
        {monthly.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Bank</TableHead>
                  <TableHead className="text-xs text-right">Incoming</TableHead>
                  <TableHead className="text-xs text-right">Outgoing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthly.map(m => (
                  <TableRow key={m.bankName}>
                    <TableCell className="font-medium text-sm">{m.bankName}</TableCell>
                    <TableCell className="text-right text-sm text-success">₹{m.incoming.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm text-destructive">₹{m.outgoing.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
