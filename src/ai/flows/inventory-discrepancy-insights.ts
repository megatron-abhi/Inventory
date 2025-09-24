'use server';
/**
 * @fileOverview Analyzes inventory discrepancies between Wix and warehouse stock, providing summarized insights and potential reasons for mismatches.
 *
 * - analyzeInventoryDiscrepancies - Analyzes discrepancies and provides insights.
 * - AnalyzeInventoryDiscrepanciesInput - Input type for analyzeInventoryDiscrepancies.
 * - AnalyzeInventoryDiscrepanciesOutput - Return type for analyzeInventoryDiscrepancies.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInventoryDiscrepanciesInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  sku: z.string().describe('The SKU of the product.'),
  warehouseStock: z.number().describe('The quantity of the product in the warehouse.'),
  wixInventoryStock: z.number().describe('The quantity of the product in Wix inventory.'),
});
export type AnalyzeInventoryDiscrepanciesInput = z.infer<
  typeof AnalyzeInventoryDiscrepanciesInputSchema
>;

const DiscrepancyInsightSchema = z.object({
  hasDiscrepancy: z.boolean().describe('Whether a significant discrepancy exists.'),
  discrepancyReason: z
    .string()
    .describe('The probable reason for the discrepancy, if any.'),
  suggestedAction: z
    .string()
    .describe('A suggested action to resolve the discrepancy, if any.'),
});

const AnalyzeInventoryDiscrepanciesOutputSchema = z.object({
  insights: DiscrepancyInsightSchema.array().describe('Insights for each product.'),
});
export type AnalyzeInventoryDiscrepanciesOutput = z.infer<
  typeof AnalyzeInventoryDiscrepanciesOutputSchema
>;

const discrepancyChecker = ai.defineTool({
  name: 'discrepancyChecker',
  description:
    'This tool checks for discrepancies between warehouse and Wix inventory stock levels. It should be used when the user asks about inventory mismatches to decide when a discrepancy exists and suggest an action.',
  inputSchema: z.object({
    warehouseStock: z
      .number()
      .describe('The quantity of the product in the warehouse.'),
    wixInventoryStock: z
      .number()
      .describe('The quantity of the product in Wix inventory.'),
    productName: z.string().describe('The name of the product.'),
    sku: z.string().describe('The SKU of the product.'),
  }),
  outputSchema: DiscrepancyInsightSchema,
},
async input => {
  // Basic logic to determine discrepancy and suggest actions
  const threshold = 0; // Define a threshold for significant discrepancy, this should not be hardcoded, but for now we don't have a better alternative
  const difference = Math.abs(input.warehouseStock - input.wixInventoryStock);

  if (difference > threshold) {
    return {
      hasDiscrepancy: true,
      discrepancyReason: `There is a discrepancy of ${difference} units between warehouse stock (${input.warehouseStock}) and Wix inventory (${input.wixInventoryStock}) for product ${input.productName} (SKU: ${input.sku}).`,
      suggestedAction: `Investigate potential causes such as shipment delays, miscounting, or system errors. Perform inventory reconciliation.`,        
    };
  } else {
    return {
      hasDiscrepancy: false,
      discrepancyReason: 'No significant discrepancy detected.',
      suggestedAction: 'No action required.',
    };
  }
});

const analyzeInventoryDiscrepanciesPrompt = ai.definePrompt({
  name: 'analyzeInventoryDiscrepanciesPrompt',
  tools: [discrepancyChecker],
  input: {schema: AnalyzeInventoryDiscrepanciesInputSchema},
  output: {schema: AnalyzeInventoryDiscrepanciesOutputSchema},
  prompt: `You are an inventory management expert. Analyze the discrepancies between warehouse stock and Wix inventory for a list of products. Use the discrepancyChecker tool to identify and provide insights on each product.

      Input Products:
      Product Name: {{{productName}}}
      SKU: {{{sku}}}
      Warehouse Stock: {{{warehouseStock}}}
      Wix Inventory Stock: {{{wixInventoryStock}}}
      
       Based on the above data, determine if a discrepancy exists using the discrepancyChecker tool, provide reasons and suggest actions.
      `,
});

const analyzeInventoryDiscrepanciesFlow = ai.defineFlow(
  {
    name: 'analyzeInventoryDiscrepanciesFlow',
    inputSchema: AnalyzeInventoryDiscrepanciesInputSchema,
    outputSchema: AnalyzeInventoryDiscrepanciesOutputSchema,
  },
  async input => {
    const discrepancyResult = await discrepancyChecker(input);

    return {
      insights: [discrepancyResult],
    };
  }
);

export async function analyzeInventoryDiscrepancies(
  input: AnalyzeInventoryDiscrepanciesInput
): Promise<AnalyzeInventoryDiscrepanciesOutput> {
  return analyzeInventoryDiscrepanciesFlow(input);
}
