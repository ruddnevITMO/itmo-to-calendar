# Deploying your own Apps Script import (with subject filter)

This deploys `filter-subjects-apps-script` under your own Google account, so
calendar events are created directly in your Google Calendar (no manual
`.ics` download/import step).

1. Go to https://script.google.com/home and click "New project".
2. In the script editor, delete the default `Code.gs` placeholder.
3. Create three files, copying each one's contents exactly from
   `filter-subjects-apps-script`:
   - `calendar.gs` (Script file)
   - `delete.gs` (Script file)
   - `webapp.html` (HTML file)
4. Open Project Settings → check "Show appsscript.json manifest file in
   editor", then replace its contents with this repo's `appsscript.json`.
   Its `webapp.executeAs`/`webapp.access` are just the dialog's starting
   values — whatever you pick in the next step's deployment dialog is what
   actually takes effect for this deployment, regardless of the manifest.
5. Click Deploy → New deployment → type "Web app".
   - Execute as: **Me**
   - Who has access: **Only myself** (unless you want to share it)
6. Click Deploy, authorize the requested Calendar scope when Google prompts
   you (this is your own script running under your own account — the token
   never leaves Google's infrastructure).
7. Copy the resulting Web app URL — this is your personal equivalent of the
   automatic-import link on the static site (`auto.html`, which redirects to
   the original author's own deployment — yours replaces that for you).
   Bookmark it.
8. Open the URL, run through the form once with a small date range, and
   verify: a subject checklist appears after clicking "Старт" (colored
   dot + checkbox per subject), and unchecking a subject means no event
   for it appears in your Google Calendar after clicking "Сгенерировать".
9. To redeploy after making further script edits: Deploy → Manage
   deployments → edit (pencil icon) → New version → Deploy. The Web app URL
   stays stable across versions.
