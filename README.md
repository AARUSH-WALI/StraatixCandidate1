## Straatix Partners – Candidate Careers Hub

This is the candidate-facing careers site for **Straatix Partners**.  
The application is a React + Vite SPA using **Supabase as the primary database and auth provider**.

### Tech stack

- **Frontend**: React, TypeScript, Vite  
- **UI**: shadcn-ui, Tailwind CSS, Framer Motion  
- **Backend / Database**: Supabase (Postgres, Auth, Storage)

### Local development

1. **Install dependencies**

```sh
npm install
```

2. **Create an environment file**

Create a `.env.local` (or `.env`) file in the project root with your Supabase project values:

```sh
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_OR_PUBLIC_KEY
```

3. **Run the dev server**

```sh
npm run dev
```

The app will be available at the URL shown in the terminal (usually `http://localhost:5173`).

### Supabase configuration

- Supabase project configuration is stored under the `supabase` directory:
  - `supabase/config.toml` – project configuration
  - `supabase/migrations/` – database schema and policies for:
    - `jobs`
    - `candidate_profiles`
    - `applications`
    - storage buckets for resumes and profile images

**Disable email verification (recommended for this app):**  
In the [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Providers** → **Email**. Turn **off** “Confirm email”.  
Users can then sign up and sign in immediately. If you already have users who get **400 on login**, open **Authentication** → **Users**, click the user, and use **Confirm email** (or confirm the user) so they can sign in.

**Check that signups are stored:**  
In the Dashboard go to **Authentication** → **Users** to see all signed-up users. For candidate profile data, open **Table Editor** → **candidate_profiles** (and **applications** for job applications).

To apply the schema to your Supabase project using the Supabase CLI:

```sh
cd supabase
supabase db push     # or: supabase migration up
```

The React app already uses the Supabase client from `src/integrations/supabase/client.ts` for:

- **Auth** (`AuthContext.tsx`)
- **Jobs listing & details** (`Jobs.tsx`, `JobDetails.tsx`)
- **Candidate profiles & applications** (`Dashboard.tsx`, `ApplicationModal.tsx`)

No external/hosted “Lovable” database is used anymore; Supabase is the single source of truth for all application data.
