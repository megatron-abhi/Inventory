# **App Name**: StockWatch

## Core Features:

- Wix Inventory Sync: Fetch product inventory data from the Wix API and store it.
- Warehouse Stock Management: Allow admin users to manually input and update warehouse stock levels for each product.
- Inventory Discrepancy Analyzer: Compares the current quantity of products as per Wix inventory against manually updated warehouse stock, showing discrepancies in an aggregated view. It reasons to decide when discrepancies must be shown using a tool.
- Real-time Purchase Listener: Integrates with the Wix webhook or polling the Wix API to automatically update displayed values and alert on inventory changes.
- Alert System: Generates visual alerts on the dashboard when the stock levels in Wix and the warehouse do not match or exceed predefined limits.
- Authentication: Admin authentication to protect sensitive stock information from unauthorized access.
- Dashboard UI: Clear, at-a-glance view of key inventory metrics, product-specific data, and real-time alerts.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke a sense of reliability and stability.
- Background color: Light gray (#F5F5F5) provides a clean, neutral backdrop for readability.
- Accent color: Soft orange (#FFAB40) for alerts and interactive elements to draw attention.
- Body and headline font: 'PT Sans', a humanist sans-serif providing a blend of modern appeal and comfortable readability.
- Use simple, clear icons from a consistent set to represent data and actions. Ensure contrast for visibility.
- Dashboard layout with clear sections for each component: inventory levels, discrepancy alerts, and manual entry forms. Use white space to declutter.
- Subtle transitions on data updates to provide a sense of real-time changes without being distracting.