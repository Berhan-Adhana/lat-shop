# Phase 2 — Authentication

## What's Included

### Backend
| File | Purpose |
|---|---|
| `src/lib/auth/auth.options.ts` | NextAuth config — providers, JWT, callbacks |
| `src/lib/auth/helpers.ts` | `requireAuth()` and `requireAdmin()` for API routes |
| `src/lib/email/index.ts` | Email sender — welcome, password reset, order confirmation |
| `src/app/api/auth/[...nextauth]/route.ts` | All NextAuth endpoints in one file |
| `src/app/api/auth/register/route.ts` | POST /api/auth/register — creates new account |
| `src/app/api/auth/forgot-password/route.ts` | POST /api/auth/forgot-password — sends reset email |

### Frontend Pages
| Route | Page |
|---|---|
| `/login` | Sign in form |
| `/register` | Create account form with password strength |
| `/forgot-password` | Request password reset |

### Utilities
| File | Purpose |
|---|---|
| `src/components/auth/SessionProvider.tsx` | Wraps app with NextAuth context |
| `src/app/layout.tsx` | Root layout with fonts, session, toasts |
| `src/app/globals.css` | Base styles + brand CSS variables |
| `src/hooks/useAuth.ts` | `useAuth()` hook for client components |
| `src/types/next-auth.d.ts` | Adds `id` and `role` to session type |

---

## How to Use in Your Components

### Check if user is logged in (client component)
```tsx
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hi, {user.name}</span>
          {isAdmin && <Link href="/admin">Admin</Link>}
          <button onClick={logout}>Sign Out</button>
        </>
      ) : (
        <Link href="/login">Sign In</Link>
      )}
    </nav>
  );
}
```

### Protect an API route
```ts
import { requireAuth } from "@/lib/auth/helpers";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error; // returns 401 automatically

  // user.id, user.email, user.role available here
}
```

### Protect an admin API route
```ts
import { requireAdmin } from "@/lib/auth/helpers";

export async function DELETE() {
  const { user, error } = await requireAdmin();
  if (error) return error; // returns 401 or 403 automatically

  // Only admins reach here
}
```

### Get session in a server component
```tsx
import { getSession } from "@/lib/auth/helpers";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <div>Hello {session.user.name}</div>;
}
```

---

## Merging with Phase 1

Copy all files from this phase into your Phase 1 project folder. The folder structure matches exactly.

---

## What's Next — Phase 3

- Homepage with hero section
- Shop page with product grid
- Category filtering
- Product detail page
- Navbar with cart icon and user menu
