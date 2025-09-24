
import { Header } from '@/components/dashboard/header';
import { InventoryTable } from '@/components/dashboard/inventory-table';
import { getProducts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTable initialProducts={products} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
