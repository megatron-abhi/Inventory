
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
  try {
    const { email, password } = loginSchema.parse(Object.fromEntries(formData.entries()));

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
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { error: e.errors.map((err) => err.message).join(', ') };
    }
    return { error: 'An unexpected error occurred.' };
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
