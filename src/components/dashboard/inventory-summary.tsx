
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Warehouse, Globe } from "lucide-react";

type InventorySummaryProps = {
    totalWarehouseStock: number;
    totalWixStock: number;
    totalWarehouseValue: number;
    totalWixValue: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function InventorySummary({
    totalWarehouseStock,
    totalWixStock,
    totalWarehouseValue,
    totalWixValue,
}: InventorySummaryProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Warehouse Value
                        </CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalWarehouseValue)}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalWarehouseStock} total units
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Wix Store Value
                        </CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalWixValue)}</div>
                         <p className="text-xs text-muted-foreground">
                            {totalWixStock} total units available online
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWarehouseStock}</div>
                        <p className="text-xs text-muted-foreground">
                           in warehouse inventory
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Discrepancy Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalWarehouseValue - totalWixValue)}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalWarehouseStock - totalWixStock} units difference
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
