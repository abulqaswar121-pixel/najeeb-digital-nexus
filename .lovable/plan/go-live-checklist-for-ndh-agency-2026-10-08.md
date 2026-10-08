# Go-Live Checklist for NDH Agency

Everything below is what stands between the current preview and a properly launched site on agency.ndh.com.ng.

## 1. Publish the site
- Click Publish (top right of the editor), then Update whenever frontend changes are made.
- The site goes live at ndhagency.lovable.app first; the custom domain comes next.

## 2. Connect the custom domain
- In Project Settings → Domains, connect **agency.ndh.com.ng** (requires a paid plan).
- DNS records are shown in that dialog; they must be added at the domain registrar for ndh.com.ng.
- robots.txt, sitemap.xml and all page metadata already point at agency.ndh.com.ng, so nothing in the code needs to change.

## 3. Verify the live API after publishing
- The app now routes /api/* through the cloud database, but this only runs for real after publish (the published site previously returned 404/401 on /api/case-studies).
- After publishing, I will check /api/health, the case-studies list, sign-in, and one full client flow on the live URL and fix anything that fails.

## 4. Real payment keys (Paystack)
- Payments currently run in sandbox mode: transactions are recorded but not verified against real charges.
- You will need to get your live secret key from your Paystack dashboard and save it here as a secure secret (I will open the secure form when you are ready — never paste it in chat).
- The public key in the code is a test placeholder and must be swapped for your live public key.

## 5. Content you must confirm before launch
- Contact details shown site-wide: phone +234 902 993 2794, hello@ndh.com.ng, abunnajeeh7@gmail.com, Sokoto address, Facebook/Instagram links.
- Case studies, client names and metrics must be real and verifiable (project rule: no fabricated data).
- Staff demo accounts and passwords must be rotated before real users sign in.

## 6. Small technical cleanups (I can do these)
- Add a favicon (browser tab currently shows a missing icon).
- Fix the currency flicker: the menu can briefly show NGN before switching to the visitor's detected currency.
- Final phone check at real device widths to confirm zero sideways scrolling.

## Order of operations
1. I do the cleanups in step 6 and re-run all checks.
2. You confirm the content in step 5 (or tell me what to change).
3. You save the Paystack live keys (step 4).
4. Publish, then connect the domain (steps 1–2).
5. I verify the live API end-to-end (step 3).

Steps 1–3 and the domain connection are actions only you can take in the editor/dashboard; everything else I can do for you.
