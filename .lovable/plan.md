
# Plan: Koppling av CreatorForm till Kandidatdatabasen

## Översikt
Skapar ett tvåstegs-ansökningsflöde där kreatörer först fyller i ett enkelt intresseformulär, som sedan kan leda till en inbjudan att slutföra en fullständig registrering i kandidatdatabasen.

```text
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  1. ÖPPET FORMULÄR   │────▶│  2. ADMIN-GRANSKNING │────▶│ 3. FULLSTÄNDIG REG.  │
│  /for-creators       │     │  Godkänn/Avvisa      │     │ Via säker länk       │
│                      │     │                      │     │                      │
│  • Grundläggande     │     │  • Granska svar      │     │  • CV-uppladdning    │
│    kontaktinfo       │     │  • Skicka inbjudan   │     │  • Telefon, LinkedIn │
│  • Portfolio         │     │    via e-post        │     │  • Referenser        │
│  • 3 frågor          │     │                      │     │  • Code of Conduct   │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
```

## Vad kommer att förändras

### 1. Ny databasstruktur
- Lägger till kolumner i `creator_applications`:
  - `status`: för att spåra var i processen ansökan befinner sig (ny/granskad/inbjuden/avvisad)
  - `invitation_token`: unik länk för att slutföra registrering
  - `invitation_sent_at`: tidsstämpel för inbjudan
  - `invitation_expires_at`: utgångsdatum för inbjudan

### 2. Admin-gränssnitt för att hantera ansökningar
- Ny sida under `/admin/applications` för att se inkomna ansökningar från CreatorForm
- Möjlighet att:
  - Granska ansökan med alla svar
  - Godkänna och skicka inbjudan via e-post
  - Avvisa ansökan
- Visuell statusindikator för varje ansökan

### 3. E-postfunktion för inbjudan
- Ny edge-funktion `send-candidate-invitation` som:
  - Genererar en unik, tidsbegränsad token
  - Skickar ett stilrent e-postmeddelande med inbjudningslänk
  - Länkar till ett förifylt formulär

### 4. Anpassat registreringsformulär
- Ny sida `/apply/:token` som:
  - Verifierar att token är giltig och ej utgången
  - Visar förifyld information (namn, e-post, roll) från ursprunglig ansökan
  - Samlar in kompletterande information:
    - Telefonnummer
    - LinkedIn-profil
    - CV-uppladdning
    - Referenser
  - Skapar en fullständig kandidatpost i `candidates`-tabellen
  - Markerar ursprunglig ansökan som slutförd

### 5. Statusflöde

```text
Ansökningsstatus:
  pending    → Ny ansökan väntar på granskning
  reviewing  → Under utvärdering
  invited    → Inbjudan skickad
  completed  → Fullständig registrering genomförd
  rejected   → Avvisad
```

---

## Tekniska detaljer

### Databasändringar (migration)

```sql
-- Lägg till nya kolumner i creator_applications
ALTER TABLE creator_applications ADD COLUMN status TEXT DEFAULT 'pending';
ALTER TABLE creator_applications ADD COLUMN invitation_token UUID;
ALTER TABLE creator_applications ADD COLUMN invitation_sent_at TIMESTAMPTZ;
ALTER TABLE creator_applications ADD COLUMN invitation_expires_at TIMESTAMPTZ;
ALTER TABLE creator_applications ADD COLUMN reviewed_by UUID;
ALTER TABLE creator_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE creator_applications ADD COLUMN candidate_id UUID REFERENCES candidates(id);

-- RLS-policy för att tillåta uppdatering med giltig token
CREATE POLICY "Anyone can complete with valid token"
ON creator_applications FOR UPDATE
USING (invitation_token IS NOT NULL AND invitation_expires_at > now())
WITH CHECK (invitation_token IS NOT NULL AND invitation_expires_at > now());
```

### Nya filer som skapas

| Fil | Beskrivning |
|-----|-------------|
| `src/pages/admin/Applications.tsx` | Admin-sida för ansökningsgranskning |
| `src/components/applications/ApplicationList.tsx` | Lista med alla ansökningar |
| `src/components/applications/ApplicationCard.tsx` | Detaljvy för en ansökan |
| `src/components/applications/InviteDialog.tsx` | Dialog för att skicka inbjudan |
| `src/hooks/useApplications.ts` | Hook för CRUD-operationer |
| `src/pages/CompleteApplication.tsx` | Sida för att slutföra registrering |
| `supabase/functions/send-candidate-invitation/index.ts` | Edge-funktion för e-postinbjudan |

### Befintliga filer som uppdateras

| Fil | Ändring |
|-----|---------|
| `src/App.tsx` | Nya routes: `/admin/applications`, `/apply/:token` |
| `src/pages/admin/Dashboard.tsx` | Länk till ansökningshantering |
| `src/integrations/supabase/types.ts` | Auto-uppdateras med nya kolumner |

### E-postmall för inbjudan

Inbjudningsmeddelandet kommer innehålla:
- Personlig hälsning
- Information om att ansökan godkänts
- Tydlig call-to-action med länk
- Information om att länken är giltig i 7 dagar
- Kontaktinformation vid frågor

---

## Sammanfattning av användarflödet

1. **Kreatör** fyller i formuläret på `/for-creators` med grundläggande info
2. **Admin** får e-postnotifikation och granskar ansökan i `/admin/applications`
3. **Admin** godkänner och klickar "Skicka inbjudan"
4. **Kreatör** får e-post med personlig länk
5. **Kreatör** klickar länken och kommer till förifylt formulär
6. **Kreatör** fyller i kompletterande info (CV, telefon, LinkedIn, referenser)
7. **Systemet** skapar fullständig kandidatpost och uppdaterar ansökningsstatus
8. **Admin** kan nu se kandidaten i `/admin/candidates`
