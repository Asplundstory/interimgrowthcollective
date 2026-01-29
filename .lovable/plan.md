
# Kundyta med hemliga URL:er och affärsförslag-presentationer

## Översikt
En säker kundyta där varje kund får en unik, svårgissad URL för att visa skräddarsydda affärsförslag i ett modernt presentationsformat. Presentationen byggs som en fullskärms-slideshow med Framer Motion-animationer, keyboard-navigation och en editorial design som matchar Interim Growth Collective-varumärket.

## Funktioner

### 1. Hemliga kundspecifika URL:er
- Varje kund får en unik URL: `/p/[slug]` där slug är en svårgissad kombination (t.ex. `/p/acme-2024-xK9mQ3`)
- URL:en är inte listbar eller sökbar - endast den som har länken kan komma åt innehållet
- Admin kan skapa, redigera och hantera förslag via dashboarden

### 2. Presentationsformat (Slideshow)
Varje presentation består av fullskärms-slides (100vh) med:

**Slide 1: Titel/Välkommen**
- Kundens företagsnamn
- Projektnamn/rubrik
- Subtil bakgrundsanimation

**Slide 2: Om oss (Kort intro)**
- "Interim Growth Collective - Människor med känsla"
- Kort värdeproposition

**Slide 3: Er utmaning**
- Kundens specifika behov/problem (redigerbart)

**Slide 4: Vår lösning**
- Föreslagna konsulter/roller
- Matchning med kundens behov

**Slide 5: Konsultpresentationer**
- Individuella profiler med foto, kompetens, erfarenhet

**Slide 6: Leverans & upplägg**
- Tidslinje, omfattning, on-site/remote

**Slide 7: Investering**
- Prisförslag, villkor

**Slide 8: Nästa steg (CTA)**
- Kontaktinfo, bokningsknapp

### 3. Navigation & UX
- Keyboard: piltangenter + mellanslag för att navigera
- Prev/Next-knappar (subtila) på sidorna
- Progress-dots längst ned
- Smooth fade + slide-animationer (Framer Motion)

## Teknisk implementation

### Databasstruktur

```text
┌─────────────────────────────────────────────────────────┐
│  proposals (Kundförslag)                                │
├─────────────────────────────────────────────────────────┤
│  id: UUID (PK)                                          │
│  slug: TEXT (unique) - hemlig URL                       │
│  client_name: TEXT - kundnamn                           │
│  project_title: TEXT - projekttitel                     │
│  status: ENUM (draft/sent/viewed/accepted/declined)     │
│  valid_until: TIMESTAMP                                 │
│  created_at: TIMESTAMP                                  │
│  updated_at: TIMESTAMP                                  │
│  created_by: UUID (FK → auth.users)                     │
│  view_count: INT - antal visningar                      │
│  last_viewed_at: TIMESTAMP                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  proposal_slides (Individuella slides)                  │
├─────────────────────────────────────────────────────────┤
│  id: UUID (PK)                                          │
│  proposal_id: UUID (FK → proposals)                     │
│  slide_type: TEXT (title/challenge/solution/etc)        │
│  sort_order: INT                                        │
│  title: TEXT                                            │
│  content: JSONB - flexibelt innehåll per slide-typ     │
│  created_at: TIMESTAMP                                  │
│  updated_at: TIMESTAMP                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  proposal_consultants (Föreslagna konsulter)            │
├─────────────────────────────────────────────────────────┤
│  id: UUID (PK)                                          │
│  proposal_id: UUID (FK → proposals)                     │
│  name: TEXT                                             │
│  role: TEXT                                             │
│  photo_url: TEXT                                        │
│  bio: TEXT                                              │
│  expertise: TEXT[]                                      │
│  availability: TEXT                                     │
│  sort_order: INT                                        │
└─────────────────────────────────────────────────────────┘
```

### RLS-policies
- **proposals**: Publikt läsbar via slug (för kunder), full åtkomst för admin
- **proposal_slides**: Läsbar om tillhörande proposal är tillgänglig
- **proposal_consultants**: Läsbar om tillhörande proposal är tillgänglig

### Nya filer och komponenter

```text
src/
├── pages/
│   └── proposal/
│       └── ProposalPage.tsx          # Kundvisning av presentation
│
├── components/
│   └── proposal/
│       ├── ProposalSlideshow.tsx     # Huvudkomponent för presentationen
│       ├── slides/
│       │   ├── TitleSlide.tsx        # Slide 1: Välkommen
│       │   ├── AboutSlide.tsx        # Slide 2: Om oss
│       │   ├── ChallengeSlide.tsx    # Slide 3: Utmaning
│       │   ├── SolutionSlide.tsx     # Slide 4: Lösning
│       │   ├── ConsultantSlide.tsx   # Slide 5: Konsultprofiler
│       │   ├── DeliverySlide.tsx     # Slide 6: Leverans
│       │   ├── InvestmentSlide.tsx   # Slide 7: Pris
│       │   └── CTASlide.tsx          # Slide 8: Nästa steg
│       ├── SlideNavigation.tsx       # Prev/Next/Dots
│       └── SlideProgress.tsx         # Progress-bar
│
├── hooks/
│   └── useProposal.ts                # Hämta proposal-data
│
└── pages/admin/
    └── Proposals.tsx                  # Admin: Lista/skapa förslag
```

### Routing (App.tsx)
```text
/p/:slug          → ProposalPage (publik, ingen layout)
/admin/proposals  → Proposals (admin-skyddad)
```

### Design & Animation

**Tema: Mörkt med varma accenter**
- Bakgrund: Djup navy gradient (`#0b1220` → `#151d2e`)
- Text: Off-white (`#f5f5f0`)
- Accent: Terracotta från befintlig design (`hsl(15, 35%, 55%)`)
- Typsnitt: Inter (befintligt)

**Animationer (Framer Motion)**
- Slide-övergång: fade + horizontal slide (0.4s)
- Staggered content-entry per slide
- Subtil parallax på bakgrundselement

**Responsivitet**
- Optimerat för desktop (projektormöten)
- Fungerar på surfplattor
- Mobilvänligt (men primärt desktop)

## Admin-funktionalitet

### Ny flik i Dashboard
- Lista alla förslag med status
- Skapa nytt förslag med wizard:
  1. Grundinfo (kund, projekt)
  2. Välj/anpassa slides
  3. Lägg till konsulter
  4. Förhandsgranska
  5. Generera hemlig länk
- Kopiera länk till urklipp
- Se visningsstatistik (antal klick, senast visad)

## Flöde

```text
Admin                              Kund
  │                                  │
  ├─ Skapar nytt förslag             │
  ├─ Fyller i slides                 │
  ├─ Lägger till konsulter           │
  ├─ Genererar hemlig URL            │
  ├─ Skickar länk till kund ────────►│
  │                                  ├─ Klickar på länk
  │                                  ├─ Ser fullskärms-presentation
  │  ◄─── (view_count ökar) ─────────┤
  │                                  ├─ Navigerar med tangentbord/knappar
  ├─ Ser att förslaget visats        │
  │                                  └─ Kontaktar vid intresse
```

## Säkerhet
- Slug genereras med kryptografiskt säker slumpmässig sträng (16+ tecken)
- Ingen autentisering krävs för att visa (länken ÄR nyckeln)
- Förslag kan ha utgångsdatum (`valid_until`)
- RLS säkerställer att endast rätt data exponeras

## Steg-för-steg implementation

1. **Databas**: Skapa tabeller med migrering
2. **Hook**: `useProposal` för att hämta proposal via slug
3. **Slide-komponenter**: Bygg varje slide-typ med Framer Motion
4. **Slideshow**: Huvudkomponent med navigation, keyboard-stöd
5. **ProposalPage**: Route-komponent som hämtar och renderar
6. **Admin**: Utöka dashboard med förslag-hantering
7. **Routing**: Lägg till `/p/:slug` route

---

*Denna kundyta ger en professionell, modern och minnesvärd upplevelse för era kunder - helt i linje med Interim Growth Collective:s varumärkesposition som "människor med känsla".*
