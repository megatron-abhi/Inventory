
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { analyzeInventoryDiscrepancies } from '@/ai/flows/inventory-discrepancy-insights';
import type { AnalyzeInventoryDiscrepanciesInput } from '@/ai/flows/inventory-discrepancy-insights';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(prevState: { error: string } | null, formData: FormData) {
    const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      return { error: parsed.error.errors.map((err) => err.message).join(', ') };
    }
    
    const { email, password } = parsed.data;

    // Mock authentication
    if (email === 'abhilashn8080@gmail.com' && password === 'admin@123') {
      cookies().set('session', 'admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      });
      redirect('/');
    } else {
      return { error: 'Invalid email or password.' };
    }
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}

export async function getDiscrepancyInsight(input: AnalyzeInventoryDiscrepanciesInput) {
    try {
        const result = await analyzeInventoryDiscrepancies(input);
        return result;
    } catch (error) {
        console.error("Error getting discrepancy insight:", error);
        return {
            insights: [{
                hasDiscrepancy: true,
                discrepancyReason: 'Could not analyze discrepancy due to an internal error.',
                suggestedAction: 'Please try again later or contact support.'
            }]
        };
    }
}
