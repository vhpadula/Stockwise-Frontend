Here is a **clean, concise `README.md` focused only on description + setup**, which is usually what recruiters expect for frontend repos.

You can paste this directly into your repo.

# Stockwise Frontend

Stockwise is a web interface for the **Stockwise inventory management system**, designed for **Food & Beverage CPG brands**.

The application allows users to:

- Manage products
- Track inventory and stock batches
- Create purchase orders to add stock
- Record sales orders
- Visualize financial insights such as revenue, cost, and profit

The frontend communicates with the **Stockwise Backend API** to manage inventory operations and display analytics.

Backend repository:  
https://github.com/vhpadula/Stockwise-Backend

---

# Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Mantine UI**
- **TanStack Query (React Query)**
- **Recharts**

---

# Setup

## 1. Clone the repository

```bash
git clone https://github.com/vhpadula/Stockwise-Frontend
cd Stockwise-Frontend
```

---

## 2. Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This variable should point to the running Stockwise backend API.

---

## 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

# Backend Requirement

The frontend requires the Stockwise backend API to be running.

Follow the backend setup instructions here:

[https://github.com/vhpadula/Stockwise-Backend](https://github.com/vhpadula/Stockwise-Backend)
