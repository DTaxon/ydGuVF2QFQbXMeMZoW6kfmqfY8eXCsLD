# 2026 Packer Football Pool

A 25-spot signup page designed for GitHub Pages with Supabase used as the live signup database.

## Files

- `index.html` - page structure; normally you do not need to edit this.
- `styles.css` - visual styling.
- `app.js` - signup/admin behavior; normally you do not need to edit this.
- `config.js` - **the main file you edit** for titles, instructions, labels, status messages, admin password, spot count, refresh timing, and Supabase connection values.
- `supabase.sql` - database setup and permissions.
- `.nojekyll` - prevents unnecessary Jekyll processing on GitHub Pages.

## Important: update your existing Supabase setup

The new admin rename/remove features require UPDATE and DELETE permissions.

1. Open your Supabase project.
2. Open **SQL Editor**.
3. Copy the entire contents of `supabase.sql` into a new query.
4. Run it.

Existing signup rows are preserved. The script does not drop or truncate the table.

## Configure the site

Open `config.js` and set:

```js
adminPassword: "YOUR-PASSWORD-HERE",
supabaseUrl: "YOUR-EXISTING-SUPABASE-URL",
supabaseKey: "YOUR-EXISTING-PUBLISHABLE-OR-ANON-KEY",
```

All normal site text is under `text: { ... }` in this same file, including the page title and instructions.

### Security limitation of the admin password

GitHub Pages serves static public files. That means `config.js` and its admin password can be viewed by someone who deliberately inspects the website source.

For a low-risk office football pool this may be acceptable as a convenience gate, but it is **not secure authentication**. Do not reuse an important password here.

A truly secure admin login would require server-side authentication, such as Supabase Auth plus row-level-security rules or a server-side function that keeps the secret out of GitHub.

## Admin use

1. Open the pool website.
2. Click **Admin**.
3. Enter the password from `config.js`.
4. Claimed spots turn into editable admin spots.
5. Click a claimed spot.
6. Change the name and choose **Save Name**, or choose **Remove Spot**.
7. Click **Exit Admin** when finished.

Admin mode is not persisted after the page is reloaded.

## Upload the update to GitHub

If your repository already contains the earlier version:

1. Open the repository on GitHub.
2. Upload/replace these files in the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js`
   - `supabase.sql`
   - `README.md`
3. **Before replacing `config.js`, copy your current Supabase URL and key somewhere safe.** The packaged `config.js` contains placeholders, so paste your existing values into the new file before publishing it.
4. Commit the changes to the branch GitHub Pages uses, normally `main`.
5. GitHub Pages will redeploy automatically.
6. If your browser still shows the old page after deployment, use `Ctrl+F5` or open the page with a cache-busting query such as `?v=2`.

## Signup behavior

- Exactly 25 numbered spots by default.
- Open spots are first-come/first-served.
- A spot number is the database primary key, so two successful signups cannot own the same spot.
- The page refreshes automatically according to `refreshSeconds` in `config.js`.
- The current "one spot per person" rule is instructional text rather than a database-enforced name restriction.
