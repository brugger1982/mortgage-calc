# Premium Mortgage & Housing Calculator

A premium, interactive web application built with React and Vite to help home buyers (both first-time and repeat buyers) plan their housing finances with absolute clarity. It automatically synchronizes the entire application state with URL parameters, enabling easy bookmarking, sharing, and deep-linking of custom financial scenarios.

---

## 🎯 Scope of the Project

The Mortgage & Housing Calculator is designed to provide comprehensive, real-time insights into the home buying process, going beyond simple mortgage math to model real-world scenarios.

### 1. Dual-Path Down Payment Calculation
* **First-Time Buyer Path:** Models down payments directly from savings/additional cash.
* **Repeat Buyer Path:** Automatically calculates the seller net proceeds from selling a current home (Sale Price − Mortgage Balance − Agent Commission − Seller Closing Costs) and rolls that net equity directly into the down payment for the new purchase, along with any extra cash.

### 2. Comprehensive Monthly Payment Breakdown
Computes a granular breakdown of the monthly housing expense:
* **Principal & Interest (P&I):** Based on loan size, interest rate, and term.
* **Property Taxes:** Configurable via three modes: percentage of home value, annual flat amount, or per-$100k of home value.
* **Homeowners Insurance:** Estimated annual insurance broken down monthly.
* **Private Mortgage Insurance (PMI):** Automatically computed if the down payment is less than 20% of the home purchase price.
* **HOA Fees:** Monthly home owners association fee integration.

### 3. Diverse Loan Structure Modeling
* Support for **15-year fixed**, **20-year fixed**, and **30-year fixed** amortization schedules.
* Support for **ARM (Adjustable Rate Mortgages)** (e.g., 5/1 ARM, 7/1 ARM) detailing worst-case interest rate adjustments and the resulting payment hikes after the fixed-rate period ends.

### 4. Cash to Close & Total Out-of-Pocket Expenses
* Summarizes the absolute cash required to finalize the transaction, factoring in the effective down payment and estimated buyer closing costs.

---

## ⚙️ Approach & Technology Stack

The application leverages modern web standards and libraries to deliver a seamless, high-performance user experience.

* **Frontend Framework:** React 19 + Vite for ultra-fast Hot Module Replacement (HMR) and lightweight production bundles.
* **State Management:** Custom URL state synchronization hooks that bind form fields directly to URL search parameters. This makes every calculation scenario uniquely shareable.
* **Visualization:** Custom interactive charts (using Recharts) to visually represent the payment breakdowns and future payment adjustments (e.g., ARM worst-case scenarios).
* **Styling & Theme:** Vanilla CSS with custom property tokens (HSL-based color system, neon accents, card shadows, responsive CSS Grid layouts, and smooth micro-animations).

---

## 🚀 Getting Started

To run this project locally, make sure you have [Node.js](https://nodejs.org/) installed, and then follow these steps:

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd mortgage-calc
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 3. Build for Production
To bundle the project for production deployment:
```bash
npm run build
npm run preview
```
