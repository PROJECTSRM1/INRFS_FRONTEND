# INRFS Frontend 

A modern investment and sports facility booking application built with React, TypeScript, and Vite.

## Tech Stack

### Core
- **Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)

### UI & Styling
- **Component Library**: [Ant Design](https://ant.design/)
- **Icons**: [@ant-design/icons](https://ant.design/components/icon)
- **Styling**: CSS Modules / Vanilla CSS Variables
- **Charts**: [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/)

### State Management & Data
- **Global State**: [Redux Toolkit](https://redux-toolkit.js.org/) & Context API
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

### Utilities
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)

---

## Project Flow

### User Roles
The application supports two distinct workflows:

1.  **Investor Workflow**
2.  **Admin Workflow**

### 1. Landing Page
- The entry point (`/`) displays the Hero section and navigation options.
- **"Start Investing"** & **"Investor Workflow"**: Opens the **Login Modal**.
- **"Admin Workflow"**: Navigates to the dedicated Admin Login page.

### 2. Authentication Flow
- **Investor Login**:
    - Triggered via modal on the landing page.
    - Supports mock login with Email/Password.
    - **Forgot Password**: Opens a modal to reset via Email or SMS.
    - **Registration**: "Sign Up" opens the Registration Modal.
    - **Success**: Redirects to `/investor/dashboard`.
- **Admin Login**:
    - Accessed via `/admin/login`.
    - Dedicated login page.
    - **Forgot Password**: Integrated link opens the same recovery modal.
    - **Success**: Redirects to `/admin/dashboard`.

### 3. Dashboard Features
- **Investor Dashboard**:
    - View and manage investments.
    - Book sports facilities/items.
    - View transaction history and wallet balance.
    - Download investment certificates (generated via jsPDF).
- **Admin Dashboard**:
    - Manage users and bookings.
    - Oversee platform statistics.

## Development

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Build

```bash
# Build for production
npm run build
```

### Linting

```bash
# Run linting
npm run lint
```
