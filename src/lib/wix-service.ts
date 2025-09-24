
import axios from 'axios';
import type { Product } from './types';

const WIX_API_URL = 'https://www.wixapis.com/stores/v1/products/query';
const WIX_AUTH_URL = 'https://www.wix.com/oauth/access';

// A simple in-memory cache for the access token
let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

async function getAccessToken(): Promise<string> {
  // If we have a valid token in cache, return it
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const appId = process.env.WIX_APP_ID;
  const appSecret = process.env.WIX_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Wix API credentials are not configured in .env file.');
  }

  try {
    const response = await axios.post(
      WIX_AUTH_URL,
      {
        grant_type: 'client_credentials',
        client_id: appId,
        client_secret: appSecret,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = response.data;
    accessToken = access_token;
    // Set expiry to 5 minutes before the actual token expiration to be safe
    tokenExpiresAt = Date.now() + (expires_in - 300) * 1000; 

    return accessToken;
  } catch (error) {
    console.error('Failed to get Wix access token:', error);
    throw new Error('Could not authenticate with Wix API.');
  }
}

export async function getWixProducts(): Promise<Product[]> {
    const token = await getAccessToken();

    try {
        const response = await axios.post(
            WIX_API_URL,
            { 
                query: {
                    paging: { limit: 100 } // Fetch up to 100 products
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const productsFromWix = response.data.products;

        // Map Wix product data to our internal Product type
        const products: Product[] = productsFromWix.map((wixProduct: any) => {
            const inventory = wixProduct.inventory;
            const wixStock = inventory?.trackQuantity ? inventory.quantity : 0;
            
            return {
                id: wixProduct.id,
                name: wixProduct.name,
                sku: wixProduct.sku ?? `WIX-${wixProduct.id.substring(0, 4)}`,
                price: wixProduct.price?.price ?? 0,
                wixStock: wixStock,
                warehouseStock: 0, // This will be populated from another source
                image: wixProduct.media?.mainMedia?.image?.url ?? 'https://picsum.photos/seed/placeholder/100/100',
            };
        });

        return products;
    } catch (error) {
        console.error('Failed to fetch products from Wix:', error);
        throw new Error('Could not fetch products from Wix.');
    }
}
