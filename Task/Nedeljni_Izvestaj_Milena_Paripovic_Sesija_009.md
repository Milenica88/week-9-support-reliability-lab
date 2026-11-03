# Nedeljni izveštaj

## 1. Osnovne informacije

| Polje | Odgovor |
| --- | --- |
| Ime i prezime | Milena Paripović |
| Adresa e-pošte | paripovicmilena@gmail.com |
| Discord korisničko ime | Milena Paripovic |
| Nedelja | Sesija 009 — W09 Support Reliability Lab |
| Par / tim | Dušan Nikolić / tim 9 |
| Moj konkretan doprinos / uloga | Predložila sam istraživanje podobnosti izvora, usmeravala rad para i lično pregledala završne izveštaje i tragove. Vodim prikaz ove nedelje. |
| Datum predaje | 2026-11-03 |
| Reference na rad i dokaze | [beleška para](EVIDENCE_W09.md), [završna evaluacija](../runs/evaluate-392ac8e4-bd0c-42af-b74f-a4e02bcef195/), [završna regresija](../runs/regression-7e90bdbb-88e6-4679-93cb-8149c38285b3/), [poređenje](../compare-regression.txt) |

## 2. Moj status

**Status:** Zajedničko istraživanje i pregled dokaza završeni; čeka se nezavisna provera u sredu i dopuna beleške.

Završni rezultati podržavaju ciljanu ispravku policy putanje u kontrolisanoj simulaciji, uz jasno ograničen domet preporuke.

## 3. Rad ove nedelje

Ove nedelje sam, kao supervizorka rada para, predložila da istražimo izbor prihvatljivog izvora za odgovor o pravilima usluge. Tokom celog postupka usmeravala sam hipotezu, granicu izmene i način čitanja dokaza: da se uporede isti slučajevi nad istim podacima i da se proveri da li se odgovor zaista oslanja na aktivan dokument. Dušan je implementirao promenu u kodu i test; moji doprinosi bili su ideja, nadzor i pregled rezultata.

Lično sam pregledala završne generisane izveštaje i tragove. U završnom `refund` tragu izabran je `refund-current`, revizija 2, a odgovor navodi 14 dana; za `legacy` završni izveštaj pokazuje `refused`, prazne citate i nula poziva modela. Javni skup završio je sa 4/4 prolaza, a ceo regresioni sa 7/7. U poređenju sa početnim rezultatima 2/4 i 5/7, popravili su se `refund` i `legacy`, dok su ostali javni slučajevi ostali prolazni. Ovi zaključci i putanje četiri run direktorijuma zabeleženi su u [zajedničkoj belešci](EVIDENCE_W09.md).

U tumačenju sam razdvojila uverljiv tekst i stvarnu podobnost izvora. Provera da odgovor nije prazan prolazila je i za zastareli odgovor, dok je viša sintetička `recordedJudge` ocena pripisana upravo tom pogrešnom odgovoru. Zato zbir prolaza u malom determinističkom skupu ne koristim kao dokaz spremnosti celog servisa. Poznati propust za nepoznat nalog nije obuhvaćen javnom regresijom; živi model, stvarni saobraćaj i dostupnost nisu provereni.

Codex je poslužio za analizu, izmenu i izvođenje provera. Prihvaćen je zaključak o ciljanoj ispravci tek nakon pregleda koda, završnih izveštaja i tragova. Preporuka para je ograničena na kontrolisanu policy simulaciju, uz isključivanje pristupa putanji naloga.

## 4. Sledeći korak

Trenutno nema sledećih koraka.

## 5. Poverljiva napomena za tutora

Nema dodatne napomene.
