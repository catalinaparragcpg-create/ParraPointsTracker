# Parra Points Tracker — Netlify version

This is a standalone version of the tracker, built to run outside Claude entirely.
Two things changed from the Claude-hosted version:

- **Storage** is now `localStorage` — your data lives in the browser on the device
  you're using, not tied to an account. It won't follow you to a different phone,
  and clearing Safari's site data or reinstalling will wipe it. Use "Copy save
  code" in Settings occasionally as a backup.
- **The AI food-logging** now goes through a small serverless function
  (`netlify/functions/food-ai.js`) that holds your own Anthropic API key. This
  means API usage is billed to you directly, separately from any Claude
  subscription.

## Before you deploy: get an Anthropic API key

1. Go to **console.anthropic.com** and sign up (this is a separate account
   from claude.ai — it's Anthropic's developer/billing platform).
2. Add a small amount of credit (a few dollars covers a lot of food logging —
   each photo analysis is a fraction of a cent).
3. Create an API key under **Settings → API Keys**. Copy it somewhere safe —
   you'll paste it into Netlify in step 4 below, and you won't be able to see
   it again after you close that page.

## Deploying (no terminal required)

1. **Create a free GitHub account** if you don't have one (github.com).
2. **Create a new repository** (top right → New repository). Any name is fine.
3. **Upload these files**: on the new repo's page, click "Add file" →
   "Upload files," then drag this entire folder's contents in (keep the
   folder structure — `netlify/functions/food-ai.js` needs to stay nested
   the way it is). Commit the changes.
4. **Go to netlify.com**, sign up free, click **"Add new site" → "Import an
   existing project"**, and connect your GitHub account. Pick the repo you
   just created. Netlify will read `netlify.toml` automatically and know how
   to build it — you shouldn't need to change any build settings.
5. **Before the first deploy finishes** (or any time after, in Site
   configuration → Environment variables), add a variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: the key you copied earlier
6. Deploy. Netlify gives you a URL like `something-random.netlify.app`. You
   can rename it (Site configuration → Change site name) to something like
   `parra-tracker.netlify.app`.

## Using it

- Open that Netlify URL in Safari on each family member's phone.
- Each person completes the setup questionnaire on their own device — this
  is now a per-device thing, not per-account (see the storage note above).
- Share → Add to Home Screen, same as before.

## If something goes wrong

- **AI logging fails immediately**: double-check the `ANTHROPIC_API_KEY`
  environment variable is set correctly in Netlify and redeploy (env var
  changes require a new deploy to take effect — trigger one from the
  Deploys tab).
- **Build fails on Netlify**: check the deploy log for the actual error —
  most often it's a typo introduced during the file upload. Re-upload the
  affected file.
