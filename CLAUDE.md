# CLAUDE.md - Clear Deal Docs

## Project Overview

Clear Deal Docs is a vehicle dealer addendum management system. Dealers create customizable addendum documents with product selections (installed/optional accessories), capture digital signatures, and share signing links with customers via QR codes or mobile URLs.

## Tech Stack

- **Framework:** React 18 + TypeScript 5.8 (strict mode disabled)
- **Build:** Vite 5 with SWC (via @vitejs/plugin-react-swc)
- **Styling:** Tailwind CSS 3.4 with custom CSS variables + Shadcn/ui components
- **Backend:** Supabase (PostgreSQL, Auth, RLS policies)
- **State:** React Query (@tanstack/react-query) for server state, React Context for auth
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Testing:** Vitest + @testing-library/react + jsdom
- **Linting:** ESLint 9 (flat config) with typescript-eslint, react-hooks, react-refresh plugins
- **Package Manager:** npm (bun lockfiles also present)

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build to dist/
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run test         # Run tests once (vitest run)
npm run test:watch   # Run tests in watch mode (vitest)
npm run preview      # Preview production build
```

## Project Structure

```
src/
  App.tsx                  # Root component: providers + router
  main.tsx                 # React DOM entry point
  index.css                # Global styles, CSS variables, print styles
  components/
    ui/                    # Shadcn/ui primitives (do not manually edit)
    addendum/              # Domain components (AddendumHeader, ProductRow, SignaturePad, etc.)
    NavLink.tsx            # Navigation component
  pages/                   # Route-level page components
    Index.tsx              # Main addendum builder (home page)
    Login.tsx              # Auth page (sign in / sign up)
    Admin.tsx              # Product catalog management (admin only)
    SavedAddendums.tsx     # List of saved addendums
    MobileSigning.tsx      # Token-based customer signing page
    NotFound.tsx           # 404 page
  contexts/
    AuthContext.tsx         # Auth provider: user, isAdmin, signIn, signUp, signOut
  hooks/
    useProducts.ts         # Product data fetching hook
    use-toast.ts           # Toast notification hook
    use-mobile.tsx         # Mobile detection hook
  integrations/
    supabase/
      client.ts            # Supabase client initialization
      types.ts             # Auto-generated types from Supabase schema
  lib/
    utils.ts               # cn() classname merge utility
  test/
    setup.ts               # Vitest setup (jest-dom matchers, matchMedia mock)
    example.test.ts        # Sample test
supabase/
  config.toml              # Supabase project config
  migrations/              # SQL migration files (schema + seed data)
```

## Routes

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Index | Yes | Main addendum builder; `?id=<uuid>` loads a saved addendum |
| `/login` | Login | No | Sign in / sign up |
| `/admin` | Admin | Yes (admin) | Product catalog CRUD |
| `/saved` | SavedAddendums | Yes | List saved addendums |
| `/sign/:token` | MobileSigning | No (token) | Customer signing via unique link |

## Database Schema (Supabase)

**Tables:**
- `products` - Product catalog (name, price, warranty, badge_type, disclosure, sort_order)
- `addendums` - Saved addendum documents (vehicle info, product snapshots as JSONB, signatures, signing_token)
- `user_roles` - Role assignments (admin/user enum)
- `profiles` - User display names (auto-created on signup via trigger)

**Key RPC functions:**
- `has_role(user_id, role)` - Check if user has a role (SECURITY DEFINER)
- `get_addendum_by_token(token)` - Retrieve addendum by signing token for anonymous access

**RLS:** All tables have Row Level Security enabled. Anonymous access to addendums is only via signing token.

## Key Conventions

### Imports
- Always use the `@/` path alias for internal imports (maps to `src/`)
- Example: `import { Button } from "@/components/ui/button"`

### Components
- Page components go in `src/pages/` (PascalCase filenames)
- Domain components go in `src/components/addendum/` (PascalCase filenames)
- **Do not manually edit files in `src/components/ui/`** - these are Shadcn/ui managed components

### Styling
- Use Tailwind utility classes; custom CSS variables are defined in `src/index.css`
- Fonts: Barlow Condensed (headers), Barlow (body) - loaded from Google Fonts
- Print-specific styles use `@media print` rules and `.no-print` class to hide elements
- Dark mode supported via `class` strategy

### TypeScript
- Strict mode is **off** (`strict: false`, `noImplicitAny: false`)
- Unused variables/parameters are allowed by both TS and ESLint configs
- Supabase types are auto-generated in `src/integrations/supabase/types.ts` - do not manually edit

### State Management
- Server state: React Query (`useQuery`, `useMutation` from @tanstack/react-query)
- Auth state: `useAuth()` hook from `src/contexts/AuthContext.tsx`
- Form state: React Hook Form with Zod schemas
- Local UI state: `useState` / `useReducer` in components

### Environment Variables
- All client-side env vars must be prefixed with `VITE_`
- Accessed via `import.meta.env.VITE_*`
- Supabase credentials are in `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY)

### Testing
- Test files: `src/**/*.{test,spec}.{ts,tsx}`
- Vitest globals are enabled (no need to import `describe`, `it`, `expect`)
- jsdom environment with @testing-library/jest-dom matchers available
- Setup file: `src/test/setup.ts`

## Key Workflows

### Adding a new page
1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx` inside `<Routes>`
3. Add navigation link if needed

### Adding a new Shadcn/ui component
Use the Shadcn CLI or manually copy from the Shadcn/ui registry into `src/components/ui/`

### Modifying the database schema
1. Create a new migration in `supabase/migrations/`
2. Update `src/integrations/supabase/types.ts` if types change

### Mobile signing flow
1. Addendum is saved with a unique `signing_token` (UUID)
2. QR code / link generated pointing to `/sign/<token>`
3. Customer accesses the link (no auth needed)
4. `get_addendum_by_token()` RPC retrieves the addendum
5. Customer signs and the addendum is updated via token-based RLS policy
