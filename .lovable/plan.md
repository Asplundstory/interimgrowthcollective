## Goal
Connect Google Search Console (GSC) for `https://interimgrowthcollective.se/`, verify ownership via the META method, register the site as a property, and submit the sitemap so SEO reports run.

## Steps

1. **Trigger the GSC connector**
   Call the connector picker so you can authorize Lovable to access your Google Search Console account (OAuth). This step requires your action in the popup.

2. **Request a verification token**
   Call the Site Verification API through the connector gateway with `identifier: https://interimgrowthcollective.se/` and `verificationMethod: META`. Google returns a `google-site-verification` meta tag value.

3. **Embed the meta tag in `index.html`**
   Add `<meta name="google-site-verification" content="…" />` to the static `<head>` in `index.html`. This must be server-rendered (not injected by Helmet) so Google can fetch it.

4. **Publish the site**
   The verification tag only works once it's live at `https://interimgrowthcollective.se/`. You'll need to click Update in the publish dialog after the tag is added.

5. **Call verify**
   POST to `/siteVerification/v1/webResource?verificationMethod=META`. A 200 means ownership is confirmed.

6. **Add the property to Search Console**
   PUT `/webmasters/v3/sites/https%3A%2F%2Finterimgrowthcollective.se%2F` so it appears in your GSC property list.

7. **Submit the sitemap**
   PUT `/webmasters/v3/sites/{site}/sitemaps/https%3A%2F%2Finterimgrowthcollective.se%2Fsitemap.xml`. Your existing `public/sitemap.xml` is already correct.

8. **Mark the SEO finding fixed**
   Update the `gsc:gsc` finding to `fixed`.

## What I need from you
- Approve this plan
- Complete the Google OAuth popup when it appears
- Click Update in the publish dialog after I add the meta tag, so Google can see it before verify runs

## Notes
- Domain used: `https://interimgrowthcollective.se` (your primary custom domain).
- META is the only verification method that works for a Lovable-hosted app (DNS/file/Analytics methods need infra we don't control).
- The meta tag is harmless to leave in place permanently and should stay there to keep verification valid.