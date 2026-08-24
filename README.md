# Office Pool Signup — 25 Spots

A small GitHub Pages site backed by Supabase. Visitors can see all 25 spots, click an available spot, enter a name, and claim it. A database primary key prevents two people from claiming the same spot.

## Files

- `index.html` — page markup
- `styles.css` — layout and appearance
- `app.js` — loads and submits signups
- `config.js` — the only website file you need to edit
- `supabase.sql` — one-time database setup
- `.nojekyll` — tells GitHub Pages to serve the files as-is

## 1. Create the Supabase database

1. Create a free Supabase project at https://supabase.com/.
2. Open **SQL Editor**.
3. Create a new query.
4. Paste the entire contents of `supabase.sql` and run it.
5. In your Supabase project settings/API area, copy:
   - the **Project URL**
   - the browser-safe **Publishable key** (or legacy `anon` key)
6. Do **not** use or publish the `service_role` key.

## 2. Put your Supabase values in `config.js`

Replace the two placeholder strings:

```js
supabaseUrl: "PASTE_YOUR_SUPABASE_URL_HERE",
supabaseKey: "PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE"
```

You can also change the title/subtitle in the same file.

## 3. Upload to GitHub

1. Create a new GitHub repository, for example `office-pool`.
2. A **Public** repository is the simplest option and works with GitHub Free; private Pages availability depends on your GitHub plan/organization settings.
3. Open the new repository and choose **Add file → Upload files**.
4. Upload everything from the extracted `office-pool-signup` folder. (`.nojekyll` may be hidden on some computers; this simple site will still work if that one file is omitted.)
5. Commit the files to the `main` branch.

## 4. Turn on GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch `main` and folder `/(root)`.
4. Click **Save**.
5. GitHub will show the public Pages URL after deployment.

For a repository named `office-pool`, the URL is normally:

`https://YOUR-USERNAME.github.io/office-pool/`

## Day-to-day use

The page refreshes automatically every 10 seconds and immediately after a signup. The public page can add signups, but it cannot edit or delete existing ones.

To remove a mistaken signup, open the Supabase SQL Editor and run:

```sql
delete from public.office_pool_signups where spot = 7;
```

To reset all 25 spots:

```sql
truncate table public.office_pool_signups;
```

## Important privacy note

The names on the signup sheet are publicly readable by anyone who has the GitHub Pages URL. Use first names/initials if you do not want full names exposed.
