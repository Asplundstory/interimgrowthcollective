-- Create insights table for blog posts
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Anyone can read published insights
CREATE POLICY "Anyone can read published insights"
ON public.insights
FOR SELECT
USING (published = true);

-- Admins can view all insights (including unpublished)
CREATE POLICY "Admins can view all insights"
ON public.insights
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert insights
CREATE POLICY "Admins can insert insights"
ON public.insights
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update insights
CREATE POLICY "Admins can update insights"
ON public.insights
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete insights
CREATE POLICY "Admins can delete insights"
ON public.insights
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_insights_updated_at
BEFORE UPDATE ON public.insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with default content (published)
INSERT INTO public.insights (slug, title, excerpt, content, tags, date, published) VALUES
(
  'kvalitet-utan-kompromiss',
  'Kvalitet utan kompromiss',
  'Varför vi aldrig tummar på vem vi förmedlar. Om urval, mognad och förtroende.',
  'Kvalitet handlar inte om att hitta den snabbaste lösningen. Det handlar om att hitta rätt person för rätt situation.

Vi möter ofta förväntningen att leverera snabbt. Och ja, hastighet kan vara viktigt. Men aldrig på bekostnad av kvalitet.

## Vad vi menar med kvalitet

Det handlar om mognad. Om människor som förstår att kreativt arbete kräver både intuition och struktur. Som kan navigera i komplexa organisationer utan att tappa sin röst.

Det handlar om ansvar. Om att vara på plats, fullt ut, även när det blir svårt. Om att leverera utan att någon behöver påminna.

## Varför det spelar roll

Våra uppdragsgivare anlitar oss för att de vill ha trygghet. De vill veta att personen som kliver in förstår sammanhanget, respekterar kulturen, och levererar med känsla.

Det är inte förhandlingsbart.',
  ARRAY['Kultur', 'Kvalitet'],
  '2024-12-10',
  true
),
(
  'kreativitet-under-press',
  'Kreativitet under press',
  'Hur erfarna kreatörer hanterar tryck utan att tappa kvalitet. En reflektion om struktur och frihet.',
  'Press är en del av arbetet. Det går inte att undvika. Men det går att hantera.

De kreatörer vi arbetar med har alla en sak gemensamt: de har lärt sig att leverera under tryck utan att kompromissa med kvalitet.

## Struktur som möjliggörare

Det finns en missuppfattning att struktur kväver kreativitet. Vår erfarenhet säger motsatsen. Struktur skapar utrymme. Den frigör energi som annars går åt till att hantera kaos.

## Att behålla känslan

Det som skiljer bra arbete från utmärkt arbete är känsla. Den går inte att forcera. Men den går att skydda.

Erfarna kreatörer vet hur de skyddar sin process. De vet när de behöver utrymme och när de behöver input. De kommunicerar tydligt och ber om det de behöver.',
  ARRAY['Kreativitet', 'Process'],
  '2024-11-28',
  true
),
(
  'interim-som-strategiskt-val',
  'Interim som strategiskt val',
  'Interimslösningar är inte en nödlösning. För allt fler organisationer är det ett medvetet val.',
  'Det finns fortfarande en föreställning om att interimslösningar är något man tar till i nödfall. Att det är en tillfällig lösning på ett akut problem.

Den bilden stämmer inte längre.

## En förändrad verklighet

Organisationer förändras snabbare än någonsin. Projekt uppstår och avslutas. Kompetenser behövs intensivt under begränsade perioder.

Att anställa för varje behov är varken praktiskt eller ekonomiskt hållbart.

## Rätt person vid rätt tillfälle

Interim handlar om att matcha kompetens med behov. Att få tillgång till erfarna människor som kan bidra direkt, utan lång uppstartstid.

Det kräver ett annat sätt att tänka. Och det kräver en annan typ av person.

Människor som trivs med förändring. Som är trygga i sin kompetens. Som kan kliva in i nya sammanhang och göra skillnad från dag ett.',
  ARRAY['Strategi', 'Organisation'],
  '2024-11-15',
  true
);