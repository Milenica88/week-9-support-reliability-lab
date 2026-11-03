# Nedeljni izveštaj

## 1. Osnovne informacije

| Polje | Odgovor |
| --- | --- |
| Ime i prezime | Dušan Nikolić |
| Adresa e-pošte | d-nikolic98@outlook.com |
| Discord korisničko ime | Dušan Nikolić |
| Nedelja | Sesija 009 — W09 Support Reliability Lab |
| Par / tim | Milena Paripović / tim 9 |
| Moj konkretan doprinos / uloga | Implementirao sam ciljanu ispravku izbora izvora i novi test, pa proverio rezultate pre i posle izmene. |
| Datum predaje | 2026-11-03 |
| Reference na rad i dokaze | [src/app.ts](../src/app.ts), [source-eligibility.test.mjs](../tests/source-eligibility.test.mjs), [beleška para](EVIDENCE_W09.md), [test pre](../test-before.txt), [test posle](../test-after.txt), commit `40e64d16535c2a181ec55c23f2066fe918330217` |

## 2. Moj status

**Status:** Istraživanje i implementacija završeni; čeka se nezavisna provera u sredu i dopuna beleške.

Završna javna evaluacija i regresija su prošle u kontrolisanom skupu. Preporuka se odnosi samo na ograničenu simuliranu policy upotrebu.

## 3. Rad ove nedelje

Ove nedelje radio sam na zadatku W09 Support Reliability Lab. Pregledao sam aplikacioni kod, sintetičke podatke, početne izveštaje i tragove. Kod je birao prvi dokument iste teme, čak i kada je arhiviran. Zato je `refund` vraćao zastarelo pravilo o 30 dana sa citatom `refund-old`, a `legacy` je davao odgovor iako nije imao aktivan izvor. Početni javni rezultat bio je 2/4, a regresioni 5/7.

Dodao sam test `policy answers use an active source and cite it` sa zasebnom temom `warranty`, arhiviranim i aktivnim dokumentom i zapisom koji izvor je predat kontrolisanoj modelskoj funkciji. Na početnom kodu test je stvarno pao na pogrešnom citatu. Zatim sam u `src/app.ts` proširio postojeći predikat tako da izvor mora odgovarati temi i imati stanje `active`. Nisam menjao javne podatke, evaluaciona pravila ili putanju naloga.

Lično sam proverio izlaze istog testa pre i posle izmene: od jednog neuspeha do jednog prolaza. Uz podešavanje `NODE_OPTIONS=--test-isolation=none`, neizmenjena komanda `npm test` prošla je 3/3 pre i 4/4 posle dodavanja testa; početni običan pokušaj bio je blokiran greškom `EPERM` pri pokretanju podprocesa, pre izvršavanja testova. Posle ispravke `refund` citira aktivni `refund-current` i navodi 14 dana, dok `legacy` vraća `refused` bez poziva modela. Završni javni rezultat je 4/4, a regresioni 7/7, bez pogoršanja u izvršenim slučajevima. Pregledao sam i odvojena kontrolisana poređenja i tragove; detalji i putanje su u [belešci para](EVIDENCE_W09.md).

U radu je korišćen Codex za analizu, implementacionu pomoć i organizovanje provera. Zaključke sam vezao za kod, sačuvani test koji je najpre pao, stvarne `report.json` rezultate i tragove, a ne za uverljivost odgovora ili sintetičku ocenu. Nepoznat nalog i dalje može biti pogrešno predstavljen kao aktivan; kontrolisana modelska zamena i mali skup ne dokazuju rad živog modela niti produkcionu pouzdanost.

## 4. Sledeći korak

Trenutno nema sledećih koraka.

## 5. Poverljiva napomena za tutora

Nema dodatne napomene.
