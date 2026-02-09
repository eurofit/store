import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserStockAlerts } from '@/actions/stock-alert';
import { StockAlertsTable } from '@/components/stock-alerts/table';
import { columns } from '@/components/stock-alerts/table/columns';
import { redirect } from 'next/navigation';

export default async function StockAlertsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login' + '?next=' + encodeURIComponent('/account/stock-alerts'));
  }
  const stockAlerts = await getUserStockAlerts({ userId: user.id });

  return (
    <div className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Stock Alerts</h3>
        <p className="text-muted-foreground text-sm">Manage your stock alerts.</p>
      </hgroup>
      <StockAlertsTable columns={columns} data={stockAlerts.stockAlerts} />
    </div>
  );
}
