

# Affärssystem IGC - Komplett Plan

## Sammanfattning

Detta är en plan för att bygga ett komplett affärssystem (Business Management System) för Interim Growth Collective. Systemet integrerar CRM, kandidathantering, kundportal och dokumenthantering i en sammanhållen plattform.

## Systemöversikt

Affärssystemet består av fyra huvudmoduler:

1. **CRM-modul** - Leads, kontakter, företag och affärer
2. **Kandidatdatabas** - Ansökningsformulär (Typeform-stil) med CV/LinkedIn-uppladdning
3. **Kundportal** - Säker yta per kund med offerter, fakturor och dokument
4. **Dokumenthantering** - Kontrakt, policys och avtal (baserat på uppladdade mallar)

---

## Modul 1: CRM-system

### Databasstruktur

**companies** (Företag)
- id, name, org_number, industry, website
- address, city, postal_code
- notes, created_at, updated_at

**contacts** (Kontaktpersoner)
- id, company_id, first_name, last_name
- email, phone, title, linkedin_url
- is_primary, notes, created_at

**deals** (Affärer/Pipelines)
- id, company_id, contact_id, proposal_id
- title, value, currency, status (lead/qualified/proposal/negotiation/won/lost)
- probability, expected_close_date
- notes, created_at, updated_at

**deal_activities** (Aktivitetslogg)
- id, deal_id, user_id, activity_type (call/email/meeting/note)
- description, scheduled_at, completed_at

### Gränssnitt

- Listvy med filter och sök
- Kanban-vy för pipeline
- Detaljsidor med aktivitetsflöde
- Snabbskapande av leads/kontakter

---

## Modul 2: Kandidatdatabas

### Ansökningsformulär (Typeform-stil)

Ett stegvist formulär med animerade övergångar:

1. **Steg 1**: Personuppgifter (namn, email, telefon)
2. **Steg 2**: Professionell profil (roll, LinkedIn-URL, portfolio)
3. **Steg 3**: CV-uppladdning (PDF/DOC)
4. **Steg 4**: Frågor om arbetsätt (befintliga frågor från CreatorForm)
5. **Steg 5**: Referenser (namn, företag, email, telefon)
6. **Steg 6**: Code of Conduct (baserat på Coc-IGC.docx)

### Databasstruktur

**candidates** (Kandidater)
- id, first_name, last_name, email, phone
- role, linkedin_url, portfolio_url
- cv_url (storage bucket), status (new/screening/interview/approved/rejected)
- availability, hourly_rate
- notes, q1_feeling, q2_structure, q3_pressure
- code_of_conduct_accepted, created_at

**candidate_references** (Referenser)
- id, candidate_id, name, company, title, email, phone

### Säkerhet - 2FA med Google Authenticator

Kandidatinloggning med:
- Email + lösenord
- TOTP-baserad 2FA (Google Authenticator-kompatibel)
- Supabase Auth med MFA-funktionalitet

---

## Modul 3: Kundportal

### Inloggning (Magic Link)

Kunden loggar in utan lösenord:
1. Anger sin email på /client-login
2. Får en verifieringskod via email (OTP)
3. Matar in koden och får tillgång

### Kundens yta innehåller:

- **Mina förslag** - Aktiva och tidigare affärsförslag (befintlig proposals)
- **Signerade offerter** - PDF-versioner av godkända förslag
- **Fakturor** - Lista med fakturor (referens till Wint.se, inte faktisk fakturering)
- **Dokument** - Kontrakt, policys, avtal
- **Avslutade uppdrag** - Historik

### Databasstruktur

**client_users** (Kundkonton)
- id, company_id, email, name
- last_login_at, created_at

**client_documents** (Dokument per kund)
- id, company_id, document_type (contract/policy/invoice/agreement)
- title, file_url, uploaded_by, created_at

**invoices** (Fakturareferenser)
- id, company_id, deal_id, invoice_number
- amount, currency, status (draft/sent/paid/overdue)
- due_date, wint_reference, created_at

---

## Modul 4: Dokumenthantering

### Mallar från uppladdade filer

1. **Uppdragsavtal** - Avtal mellan IGC och kund
   - Dynamiska fält: Kundnamn, org-nummer, kontaktperson, roll, startdatum, pris, etc.

2. **Anställningsavtal** - Avtal mellan IGC och konsult
   - Dynamiska fält: Konsultnamn, personnummer, roll, lön, kund-placering

3. **Code of Conduct** - Uppförandekod för konsulter
   - Statiskt dokument med signeringsfält

### Funktionalitet

- Mallbibliotek med dynamisk fyllning
- PDF-generering
- Digital signering (integration eller enkel bekräftelse)
- Versionering och historik

---

## Teknisk Arkitektur

### Nya databastabeller

```
companies
contacts  
deals
deal_activities
candidates
candidate_references
client_users
client_documents
invoices
document_templates
```

### Nya komponenter

```
src/pages/
  admin/
    CRM.tsx
    Candidates.tsx
    Documents.tsx
  client/
    Portal.tsx
    Login.tsx

src/components/
  crm/
    CompanyList.tsx
    CompanyDetail.tsx
    ContactCard.tsx
    DealPipeline.tsx
    DealCard.tsx
    ActivityLog.tsx
  candidates/
    ApplicationForm.tsx (Typeform-style)
    CandidateList.tsx
    CandidateDetail.tsx
  client-portal/
    ClientDashboard.tsx
    ProposalList.tsx
    DocumentList.tsx
    InvoiceList.tsx
  documents/
    TemplateEditor.tsx
    DocumentGenerator.tsx
```

### Nya hooks

```
src/hooks/
  useCRM.ts
  useCandidates.ts
  useClientPortal.ts
  useDocuments.ts
```

### Nya edge functions

```
supabase/functions/
  send-magic-link/ (kundportal-inloggning)
  generate-document-pdf/ (PDF-generering från mall)
```

---

## Autentisering och säkerhet

### Tre typer av användare

| Typ | Inloggning | Åtkomst |
|-----|-----------|---------|
| Admin | Email + lösenord | Allt |
| Kandidat | Email + lösenord + 2FA | Kandidatportal |
| Kund | Magic Link (email OTP) | Kundportal |

### RLS-policies

- Admins: Full åtkomst till alla tabeller
- Kandidater: Endast sin egen data
- Kunder: Endast sin företags data och relaterade dokument

---

## Rekommenderad implementation (fasindelning)

### Fas 1: CRM Foundation
- Databastabeller för companies, contacts, deals
- Listvy och detaljsidor
- Pipeline-vy

### Fas 2: Kandidatdatabas  
- Candidates-tabell med storage för CV
- Typeform-stil ansökningsformulär
- Admin-vy för kandidater

### Fas 3: Kundportal
- client_users med magic link auth
- Portal-sidor för förslag och dokument
- Koppling till befintlig proposals

### Fas 4: Dokumenthantering
- Dokumentmallar baserade på uppladdade filer
- PDF-generering
- Digital bekräftelse/signering

### Fas 5: 2FA och avancerad säkerhet
- TOTP-implementation för kandidater
- Audit logging
- Ytterligare säkerhetsåtgärder

---

## Tekniska detaljer

### Storage buckets att skapa

- `candidate-cvs` - För CV-uppladdningar
- `client-documents` - För kontrakt, fakturor, avtal
- `document-templates` - För dokumentmallar

### Edge functions

**send-magic-link**
- Genererar OTP-kod
- Sparar i sessions-tabell med expiry
- Skickar via Resend

**generate-document-pdf**
- Tar mall-ID och dynamiska värden
- Genererar PDF med platshållare utfyllda
- Sparar till storage och returnerar URL

### Nya typer i types.ts (autogenereras)

Alla nya tabeller läggs automatiskt till i Supabase-typerna efter migration.

