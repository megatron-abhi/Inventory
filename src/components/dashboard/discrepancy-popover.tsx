
'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getDiscrepancyInsight } from '@/app/actions';
import type { Product } from '@/lib/types';
import type { AnalyzeInventoryDiscrepanciesOutput } from '@/ai/flows/inventory-discrepancy-insights';

export function DiscrepancyPopover({ product }: { product: Product }) {
  const [insight, setInsight] = useState<AnalyzeInventoryDiscrepanciesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const difference = product.warehouseStock - product.wixStock;

  if (difference === 0 && !isOpen) {
    return <div className="w-9 h-9" />; // Maintain layout consistency
  }

  async function checkDiscrepancy() {
    if (insight) return; // Don't re-fetch if we already have the insight

    setIsLoading(true);
    try {
      const result = await getDiscrepancyInsight({
        productName: product.name,
        sku: product.sku,
        warehouseStock: product.warehouseStock,
        wixInventoryStock: product.wixStock,
      });
      setInsight(result);
    } catch (error) {
      console.error(error);
      setInsight({
        insights: [{
          hasDiscrepancy: true,
          discrepancyReason: 'Failed to load insights.',
          suggestedAction: 'Please try again.',
        }]
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      checkDiscrepancy();
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" disabled={difference === 0}>
            {difference !== 0 ? <AlertTriangle className="h-5 w-5 text-accent animate-pulse" /> : <div className="w-5 h-5"/>}
            <span className="sr-only">Analyze Discrepancy</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Discrepancy Analysis</h4>
            <p className="text-sm text-muted-foreground">
              AI-powered insights for {product.name}.
            </p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-2">
              {insight?.insights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium">{item.discrepancyReason}</p>
                    <p className="text-sm text-muted-foreground">{item.suggestedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
