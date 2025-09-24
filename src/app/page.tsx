
import { Header } from '@/components/dashboard/header';
import { InventoryTable } from '@/components/dashboard/inventory-table';
import { InventorySummary } from '@/components/dashboard/inventory-summary';
import { getProducts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const products = await getProducts();

  const totalWarehouseStock = products.reduce((sum, p) => sum + p.warehouseStock, 0);
  const totalWixStock = products.reduce((sum, p) => sum + p.wixStock, 0);
  const totalWarehouseValue = products.reduce((sum, p) => sum + p.warehouseStock * p.price, 0);
  const totalWixValue = products.reduce((sum, p) => sum + p.wixStock * p.price, 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
        <InventorySummary
            totalWarehouseStock={totalWarehouseStock}
            totalWixStock={totalWixStock}
            totalWarehouseValue={totalWarehouseValue}
            totalWixValue={totalWixValue}
        />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Inventory Details</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTable initialProducts={products} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
