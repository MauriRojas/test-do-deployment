# Next.js Supabase & Stripe SaaS Starter Kit

This project is a Next.js application configured to integrate Supabase for authentication and Stripe for subscription management, including multiple subscription tiers (Base and Pro).

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

**Development**
Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Environment Variables**
Create a .env.local file in the root of the project and add the following environment variables:

- NEXT_PUBLIC_API_BASE_URL=Base URL for your application's backend API

- NEXT_PUBLIC_SUPABASE_URL=URL of your Supabase project
- NEXT_PUBLIC_SUPABASE_ANON_KEY=Public API key for Supabase client, required for anonymous client-side interactions.
- SUPABASE_SERVICE_ROLE_KEY=Supabase service role key, provides elevated privileges for administrative operations (server-side only).

- NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test\* Your Stripe public key, used for initiating client-side Stripe transactions
- NEXT_PUBLIC_PRICE_ID=Base product price ID
- NEXT_PUBLIC_PRO_PRICE_ID=PRO product price ID
- STRIPE_SECRET_KEY=Stripe secret key, required for server-side payment processing and management

### Features

- Authentication: Supabase Auth (Google/GitHub SSO).
- Subscriptions: Stripe integration with support for multiple subscription plans (Base and Pro).
- Protected Routes: Middleware protecting sensitive pages.
- Client & Server Auth: Session synchronization across client-side and server-side.

### Helpful Resources

[Next.js Documentation](https://nextjs.org/docs)

[Supabase Authentication](https://supabase.com/docs/guides/auth)

[Stripe Subscriptions](https://docs.stripe.com/billing/subscriptions/overview)
