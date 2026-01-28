Live link: https://pos-app-khaki.vercel.app/

PS: Please wait a few moment if the app doesn't work. The free version of render sits idle after inactivity need a few moment to be active again.

POS Application Features
1. Authentication
User registration with email and password
JWT-based login authentication
Protected API routes and frontend pages
Automatic token storage and management
Session persistence across page reloads
2. Product Management
Create, read, update, and delete products
Product fields: Name, SKU (unique identifier), Price, Stock Quantity
Real-time product list updates without page reload
Search and sort products by name, SKU, price, and stock
Stock status indicators (red alert for low stock ≤10 units)
3. Sales Management
Create sales transactions with multiple products
Real-time shopping cart with add/remove functionality
Automatic stock deduction on sale creation
Stock validation before sale (prevents overselling)
Detailed error messages for insufficient stock
Sales history with total amount and timestamps
Automatic product stock updates after each sale
