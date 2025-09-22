# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"seekingSame" is a React-based rental admin dashboard with Firebase authentication, Stripe payments, and a Node.js backend. The application manages rental properties with role-based access (admin, host, user) and includes email verification, subscription management, and real-time features.

## Development Commands

### Frontend (React)
```bash
npm start          # Start development server (http://localhost:3000)
npm run dev        # Alias for npm start
npm run build      # Build for production
npm test           # Run tests with Jest
```

### Backend (Express)
```bash
npm run server     # Start Express server (tries ports 4242-4245)
```

### Testing
- Uses React Testing Library and Jest (via react-scripts)
- No custom test scripts configured

## Architecture Overview

### Frontend Structure
- **React 18** with React Router DOM for SPA routing
- **Firebase Integration**: Authentication, Firestore database, Storage, Analytics
- **Styled Components** for CSS-in-JS styling
- **Context API**: AuthContext for global user state management
- **Role-based routing**: Admin, Host, and User access levels

### Authentication Flow
- Firebase Auth handles login/signup
- User profiles stored in Firestore with role assignment
- Email verification required for non-admin users (`VerificationModal`)
- Role-based route protection via `ProtectedRoute`, `AdminRoute`, `HostOnlyRoute`

### Backend Structure
- Express server with CORS enabled
- Stripe integration for subscription payments (currently in test mode)
- Email service integration (incomplete - routes exist but implementation missing)
- Multi-port startup (4242-4245) to handle port conflicts

### Key Services
- **stripeService.js**: Handles Stripe Checkout sessions with fallback URLs
- **chatService.js**: Chat functionality for hosts
- **userService.js**: User management operations
- **transactionService.js**: Payment transaction handling
- **imageService.js**: Image upload/processing
- **emailjsService.js**: Email notifications

### Role System
- **admin**: Full access to all features including user management and subscriptions
- **host**: Property management, chat access, dashboard
- **user**: Basic property viewing (default role)

### Environment Configuration
- Frontend: `REACT_APP_STRIPE_PUBLISHABLE_KEY` required for Stripe
- Backend: `STRIPE_SECRET_KEY` for server-side Stripe operations
- Firebase config is hardcoded in `src/firebase.js`

### Route Structure
```
/ (Dashboard) - Protected
/properties - Property management
/chat - Host-only chat feature
/notifications - User notifications
/transactions - Payment history
/users - Admin-only user management
/subscribe - Admin-only subscription management
/settings - User profile settings
/login, /signup - Authentication pages
```

### Database Schema (Firestore)
User documents include: email, display_name, role, isVerified, isSubscribe, favorites, recentSearch, idPhoto, phone_number, isSuspended

### Payment Integration
- Stripe Checkout for subscriptions
- Test mode enabled (returns mock session IDs)
- Multiple backend URL fallbacks for deployment flexibility
- CheckoutHandler component processes post-payment redirects

### Key Components
- **Layout/**: Header, Sidebar, Layout wrapper
- **Auth/**: Login, Signup, VerificationModal
- **Dashboard/**: StatsCard, PropertyChart, RecentActivity
- **Properties/**: Property CRUD with MapPicker integration
- **Subscribe/**: Stripe integration and checkout handling