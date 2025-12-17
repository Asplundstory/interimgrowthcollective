# Interim Growth Collective

Interimslösningar inom brand, marketing, kommunikation och kreativa discipliner.

## Tech Stack

- React + Vite
- React Router (client-side routing)
- Tailwind CSS
- shadcn/ui
- TypeScript

## Projektstruktur

```
src/
├── components/
│   ├── editorial/     # Återanvändbara UI-komponenter
│   │   ├── Hero.tsx
│   │   ├── Section.tsx
│   │   ├── EditorialCard.tsx
│   │   ├── AreaGrid.tsx
│   │   ├── CTA.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CreatorForm.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/            # shadcn/ui komponenter
│   └── Layout.tsx     # Gemensam layout med Header/Footer
├── content/           # Content layer
│   ├── site.ts        # Site-wide config
│   ├── pages.ts       # Sidinnehåll
│   ├── areas.ts       # Områden/discipliner
│   ├── insights.ts    # Blogginlägg
│   └── adapter.ts     # Content adapter (för framtida CMS)
├── pages/             # Sidkomponenter
│   ├── Home.tsx
│   ├── ForCompanies.tsx
│   ├── ForCreators.tsx
│   ├── Areas.tsx
│   ├── AboutPage.tsx
│   ├── Insights.tsx
│   ├── InsightPage.tsx
│   ├── ContactPage.tsx
│   ├── PrivacyPage.tsx
│   ├── TermsPage.tsx
│   └── NotFoundPage.tsx
└── App.tsx            # Routing
```

## Content Layer

All text hämtas via content layer i `src/content/`. Detta gör det enkelt att:
1. Uppdatera copy utan att ändra komponenter
2. Byta till ett CMS senare

### Byta till CMS

1. Skapa ny adapter-implementation i `src/content/cmsAdapter.ts`
2. Implementera `getAllPosts()` och `getPostBySlug()` 
3. Byt import i `adapter.ts`

## Routes

| Path | Sida |
|------|------|
| `/` | Startsida |
| `/for-companies` | För företag |
| `/for-creators` | För kreatörer (ansökan) |
| `/areas` | Områden |
| `/about` | Om oss |
| `/insights` | Alla inlägg |
| `/insights/:slug` | Enskilt inlägg |
| `/contact` | Kontakt |
| `/privacy` | Integritetspolicy |
| `/terms` | Villkor |

## Public Files Checklist

Följande filer måste ligga i `public/` för att publiceras:

- [x] `robots.txt`
- [x] `llms.txt` - AI-instruktioner
- [x] `.well-known/security.txt` - Säkerhetskontakt
- [ ] `og-image.jpg` - OpenGraph-bild (1200x630px)
- [ ] `favicon.ico` - Uppdatera med faktisk favicon

## TODO innan lansering

- [ ] Ersätt placeholder-copy i `src/content/pages.ts`
- [ ] Lägg till faktiska blogginlägg i `src/content/insights.ts`
- [ ] Skapa OG-bild och lägg i `public/og-image.jpg`
- [ ] Uppdatera `src/content/site.ts` med faktisk e-post
- [ ] Koppla kontaktformulär till backend (Lovable Cloud)
- [ ] Skriv faktisk integritetspolicy och villkor

## Lokal utveckling

```sh
npm install
npm run dev
```

## Deploy

Publicera via Lovable: Share → Publish
