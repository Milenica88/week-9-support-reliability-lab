**Nedeljni zadatak: Nedelja 9**

# Izgleda ispravno. Da li biste ga pustili u rad?

## Vaš posao ove nedelje

Preuzeli ste mali servis korisničke podrške. Aplikacija se pokreće, vraća odgovore i prolazi osnovne testove. Neko u timu zato kaže: „Deluje dobro. Možemo li da koristimo novu verziju?”

Vaš posao nije da odmah odgovorite „da”, niti da tražite od Codex-a da popravi sve. Potrebno je da utvrdite šta servis zaista radi, istražite jedan propust, napravite ograničenu izmenu i pokažete šta se njome promenilo. Na kraju ćete obrazložiti preporuku: izdati u jasno definisanoj simulaciji, ograničiti upotrebu ili ne izdati.

Radite **samostalno u paru između petka i srede**, uz odobreni Codex i kursnu zajednicu. Cilj ostaje **3–4 sata zajedničkog rada**, ne nekoliko dana razvoja. U okvirna vremena koraka uračunajte i čitanje njihovih objašnjenja, ne dodatna četiri sata programiranja posle čitanja. Duži tekst služi da možete da razumete postupak bez stalne pomoći tutora. Ne traži se veliki izveštaj ili mnogo izmena koda.

Minimum je jedna istražena promena sa kontrolisanim poređenjem i regresionom proverom. Predajete izmenjeni izvor, dodatni test, generisane dokaze pre/posle i [kratku belešku para](evidence-template.md). U belešku unosite tumačenje, ne prepisujete automatske tabele.

### Kako se ovo nadovezuje na prethodno čitanje?

U [prethodnom čitanju](pre-reading.md) razmatrali ste zašto uverljiv odgovor nije dovoljan dokaz. Ovde ćete tu ideju proveriti na stvarnom izvršavanju aplikacije:

- Kriterijume prihvatanja pretvarate u očekivane rezultate, umesto da pitate samo da li je komanda završena.
- Trag povezujete sa konkretnim izvorom i odgovorom, umesto da prihvatite objašnjenje bez provere.
- Zadržavate iste podatke i način merenja dok menjate aplikaciju.
- Proveravate i ciljni propust i prethodno ispravno ponašanje.
- Razdvajate doprinos Codex-a od dokaza i donosite ograničenu preporuku izdanja.

Petkov D1 pokazivao je pogrešno postupanje sa nepoznatim nalogom, a D2 razliku između relevantnosti i podržanosti. **Vaša istraga je H1: izbor prihvatljivog izvora za odgovor o pravilima usluge.** Ne ponavljate petkovu popravku niti implementirate sopstveni semantički ocenjivač. [Nastavni materijal](session-material.md) ostaje šira offline referenca; ovde imate konkretan radni put.

### Granice koje čuvaju smisao eksperimenta

Menjate TypeScript aplikaciju u `src/` i dodajete ciljanu proveru u `tests/`. Ne menjate postojeći `data/lab.json`, javne kriterijume, postojeće testove, konfiguraciju ili skripte za evaluaciju da biste dobili bolje brojeve. Svoj novi test sme i treba da ima sopstvene male sintetičke podatke: to nije menjanje javnog skupa.

Ne dodajete UI, bazu, mrežni servis, plaćeni model ili opšti evaluacioni sistem. Ne koristite stvarne podatke korisnika. Poznati problem naloga nije obavezna druga popravka; primetiti preostali rizik i ograničiti preporuku jeste deo zadatka.

## 1. Upoznajte servis i pripremite radni prostor

**Okvirno vreme: 20 minuta.** Dobijate [studentski starter](../project/support-reliability-starter.zip), ne kompletan instruktorski repozitorijum. Raspakujte ga u nov direktorijum i otvorite `support-reliability-lab`. Ne nastavljate W08 projekat.

Ovo je CLI aplikacija: komande pišete u terminalu, a rezultat čitate kao JSON. Nema browser interfejsa i nema komande `npm run dev`. Proverite da ste u folderu koji sadrži `package.json`, `src/`, `tests/` i `data/`.

Koristite Node.js 24 ili noviji:

```sh
node --version
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm test
```

Očekujete uspešnu instalaciju i proveru tipova, a zatim **3 prolaza u `npm test`**. Ta komanda prvo gradi izvršivi kod u `dist/`, pa pokreće osnovne testove. Ako instalacija ili build ne uspeju, to je problem pripreme, ne očekivani propust aplikacije iz ove vežbe.

Prva instalacija zahteva odobreno preuzimanje zaključanog razvojnog alata TypeScript. Sa unapred pripremljenim npm kešom umesto nje može `npm ci --offline --ignore-scripts --no-audit --no-fund`. Nije potreban modelski API ključ.

Sačuvajte početno Git stanje svoje kopije pre izmene. Ako pravite novi repozitorijum, proverite da niste slučajno u tuđem ili roditeljskom repozitorijumu; ne šaljite promene automatski na nepoznat udaljeni repo. Zabeležite početni i završni commit. Nedostajući Git metapodaci prikazuju se kao takvi; hash-evi fajlova i dalje identifikuju sadržaj, ali ne izmišljajte commit koji ne postoji.

### Šta aplikacija stvarno radi?

Postoje dve putanje. Zahtev `policy` traži dokument za zadatu temu, predaje izabrani dokument kontrolisanoj modelskoj funkciji i vraća tekst, citat i trag. Zahtev `account` koristi jedan read-only lookup i vraća status naloga. CLI `npm start` izlaže policy putanju; evaluacione provere pozivaju i druge tipove zahteva.

Ovde nema živog LLM-a. Kontrolisana modelska funkcija pravi tekst `Policy: ` praćen tekstom izabranog dokumenta. To omogućava ponovljive provere izbora izvora, ali ne meri sposobnosti proizvoljnog modela da razume pitanje ili generiše odgovor. Aplikacija prima strukturisanu temu, ne slobodno pitanje na prirodnom jeziku.

### Mali CLI priručnik

| Komanda | Šta radi | Dokaz koji ostavlja |
| --- | --- | --- |
| `npm start` | Gradi kod i pita za podrazumevanu temu `shipping` | JSON u konzoli; nema novog `runs/` |
| `npm start -- refund` | Isto, ali za temu `refund` | JSON odgovora i traga u konzoli |
| `npm start -- legacy` | Pita za temu sa samo arhiviranim izvorom | JSON u konzoli |
| `npm start -- unknown` | Pita za temu bez izvora | JSON u konzoli |
| `npm run typecheck` | Proverava TypeScript tipove | Rezultat u konzoli |
| `npm run build` | Gradi trenutni `src/` u `dist/` | Izvršivi kod; nije evaluacioni izveštaj |
| `npm test` | Gradi i pokreće testove iz `tests/` | Rezultati testova u konzoli |
| `npm run evaluate` | Gradi i izvršava 4 javna policy slučaja | Nov direktorijum sa izveštajem i tragovima |
| `npm run regression` | Gradi i izvršava ista 4 plus 3 zaštitna slučaja | Zaseban direktorijum za svih 7 slučajeva |
| `npm run compare -- PRE/report.json POSLE/report.json` | Poredi dva stvarna izveštaja istog skupa | Provere uslova i promene po slučaju u konzoli |

`PRE` i `POSLE` u poslednjem redu predstavljaju stvarne putanje, ne direktorijume koje treba ručno napraviti. Konkretno poređenje uradićete u koraku 7.

**Važno:** komanda `npm start` može završiti kodom 0 i kada je odgovor poslovno pogrešan ili odbijen. Ona prikazuje odgovor, ne donosi presudu o njegovoj ispravnosti. Evaluacija i regresioni skup završavaju kodom 1 kada neka provera pada. Nedostajući modul, greška kompajliranja ili odsustvo novog izveštaja nisu taj očekivani signal.

**Kontrolna tačka:** oba člana mogu da objasne razliku između uspešnog pokretanja, prolaza osnovnih testova i zadovoljenih kriterijuma prihvatanja. Tri zelena osnovna testa još nisu dozvola za izdanje.

## 2. Prvo dobar odgovor, zatim sumnjiv odgovor

**Okvirno vreme: 20 minuta.** Najpre proverite jednostavan primer:

```sh
npm start -- shipping
```

U JSON-u očekujete `status: "ok"`, tekst `Policy: Shipping takes 3 days.` i citat `shipping-current`. Ovo je stvarni rezultat za taj sintetički primer, ne dokaz da sve teme rade.

Sada promenite samo temu:

```sh
npm start -- refund
```

Početni odgovor je `Policy: Refund period: 30 days.`, sa citatom `refund-old`. Deluje konkretno i upotrebljivo. Aplikacija nije prijavila izuzetak. Ipak, otvorite `data/lab.json` i pogledajte dokumente za temu `refund`: `refund-old` je arhiviran, a `refund-current`, revizija 2, aktivan je i navodi **14 dana**.

Zato razlikujemo **ono što starter trenutno radi** od **onoga što ugovor zahteva**. Očekivani prihvatljiv rezultat je `Policy: Refund period: 14 days.`, sa citatom `refund-current`. Ne prepravljajte dokument od 30 dana u dokument od 14 dana: podaci već sadrže informaciju potrebnu za ispravno ponašanje.

Ugovor policy putanje glasi:

1. Koristiti aktivan izvor odgovarajuće teme i navesti njegov ID.
2. Ne dati prednost arhiviranom izvoru zato što se ranije nalazi u listi.
3. Ako nema prihvatljivog izvora, vratiti `refused`, bez poziva modelskoj funkciji.

Proverite još dve granice:

```sh
npm start -- legacy
npm start -- unknown
```

Za `legacy` postoji samo arhiviran dokument: starter pogrešno vraća odgovor, a ugovor zahteva odbijanje. Za `unknown` nema dokumenta i starter već vraća `refused`. Nemojte popraviti prvi problem tako što ćete pokvariti postojeće ispravno odbijanje.

**Zastanite pre izmene koda:** kako istovremeno mogu biti tačne tvrdnje „proces je uspešno izvršen” i „odgovor nije prihvatljiv”? Povežite odgovor sa kriterijumom, ne sa utiskom o kvalitetu rečenice.

## 3. Sačuvajte početno merenje, ne samo utisak

**Okvirno vreme: 25 minuta.** Pojedinačan CLI poziv je koristan za upoznavanje, ali vam za poređenje treba sačuvan skup rezultata, verzije i tragovi. Sada još ne menjate aplikaciju.

Naredni blokovi koriste Bash/zsh, odnosno Git Bash na Windows-u. Pokrećite ih u istom terminalu iz direktorijuma aplikacije. Promenljive samo pamte putanje; ne menjaju aplikaciju. Ako koristite drugi terminal, možete pokrenuti iste npm komande pojedinačno i za kasnije poređenje preuzeti stvarne putanje iz konzole.

```sh
PRE_EVAL_LOG="$(npm run evaluate)"
printf '%s\n' "$PRE_EVAL_LOG"
PRE_EVAL="$(printf '%s\n' "$PRE_EVAL_LOG" | sed -n 's/^.*; evidence: //p')"
test -f "$PRE_EVAL/report.json"
```

Očekujete **2/4** i novu putanju `runs/evaluate-…`. Sama evaluaciona komanda namerno vraća kod 1; zato je ne povezujte sa narednim proverama pomoću `&&`. Poslednji red potvrđuje da zaista postoji nov izveštaj. Ako nema izveštaja, stanite i proverite pripremu.

Sačuvajte i početnu regresionu proveru:

```sh
PRE_REG_LOG="$(npm run regression)"
printf '%s\n' "$PRE_REG_LOG"
PRE_REG="$(printf '%s\n' "$PRE_REG_LOG" | sed -n 's/^.*; evidence: //p')"
test -f "$PRE_REG/report.json"
```

Očekujete **5/7**. Regresioni skup nije drugi naziv za ista četiri slučaja: sadrži i tri dodatne zaštite. Ne upoređujte njegov broj prolaza sa 2/4 kao da je reč o istom merenju.

| Slučaj | Početni rezultat | Šta proverava |
| --- | --- | --- |
| `refund` | FAIL | Aktivan izvor i odgovarajući odgovor/citat |
| `shipping` | PASS | Prethodno prihvatljiv policy odgovor |
| `legacy` | FAIL | Odbijanje kada postoje samo arhivirani izvori |
| `unsupported` | PASS | Odbijanje kada nema odgovarajućeg izvora |
| `active-account`, `suspended-account`, `invalid` | PASS, u regresionom skupu | Poznati nalozi i neispravan zahtev |

UUID, vreme i putanje biće drugačiji pri svakom izvršavanju. Ne treba da prepisujete neki prikazani primer UUID-a: važno je da sačuvate **svoje** direktorijume. Ne brišite početne rezultate kada dobijete završne.

**Kontrolna tačka:** imate dva početna izveštaja, razumete zašto su provere pale i još niste menjali kod, podatke ili kriterijume.

## 4. Istražite šta se dogodilo i da li je ocena uverljiva

**Okvirno vreme: 40 minuta.** Sada radite ono što je u prethodnom čitanju predstavljeno kao prelaz sa utiska na dokaz. Nije dovoljno napisati „refund ne radi”. Potrebno je povezati zahtev, odabrani izvor, odgovor i prekršeni kriterijum.

```sh
cat "$PRE_EVAL/summary.md"
cat "$PRE_EVAL/traces/refund.json"
```

`summary.md` je pregled. U editoru otvorite i `report.json` iz istog direktorijuma i pronađite stavku `results` čiji je `id` jednak `refund`. Tu su detalji, ne samo zbirni broj.

| Polje | Kako ga koristite |
| --- | --- |
| `request` | Proverite koji je stvarni strukturisani zahtev izvršen |
| `actual.status`, `actual.text`, `actual.citations` | Odvojite vraćeni status od značenja odgovora i citiranog izvora |
| `checks`, `passed` | Pronađite konkretan kriterijum koji pada |
| `actual.trace` i `trace` | Prvo je sadržaj traga, drugo putanja izdvojenog fajla |
| `modelCalls`, `lookupCalls` | Proverite koje su kontrolisane zavisnosti zaista pozvane |
| `weakCheck`, `recordedJudge` | Uporedite površnu proveru i ilustrativnu ocenu sa ugovorom |

Za početni refund trag očekujete:

```json
[
  {"stage": "retrieval", "sourceId": "refund-old", "revision": "1"},
  {"stage": "model", "outcome": "returned"},
  {"stage": "response", "outcome": "ok"}
]
```

U tragu nema polja `state`. Zato podatak da je izvor arhiviran potražite u `data/lab.json`, koristeći isti ID i reviziju. To je mali primer **porekla rezultata**: nije dovoljno da negde postoji pravi dokument, već morate znati koji je dokument stvarno upotrebljen.

Zapišite kratko opažanje u belešku para: „Za temu refund izabran je izvor …, njegov status je …, odgovor kaže …, a kriterijum zahteva …”. Popunite činjenice iz svojih fajlova. Tek zatim iznesite hipotezu o uzroku.

### Šta nam trag dozvoljava da zaključimo?

Znate da je odabran arhivirani izvor i da je modelskom funkcijom dobijen odgovor. Ne znate samo iz traga zašto je kod izabrao taj dokument. Za tu hipotezu pregledajte policy granu u `src/app.ts`. Ne zaključujte da je problem u promptu ili „halucinaciji modela” samo zato što je rezultat netačan.

Ovde se ranije RAG znanje koristi za proveru prihvatljivosti izvora i citata; znanje o alatima za razumevanje granica poziva; a mala specifikacija za usmeravanje izmene. Trag je zapis aplikacionih događaja, ne skrivenog rezonovanja LLM-a.

### Zašto površna provera propušta problem?

U refund rezultatu `weakCheck` prolazi zato što odgovor nije prazan. To je istinito, ali ne odgovara na pitanje da li je izvor važeći. Slaba provera nije nužno neispravno implementirana: može ispravno meriti pogrešno izabranu osobinu.

`recordedJudge` za početni odgovor ima ocenu 0.95, uz objašnjenje da je odgovor tečan i konkretan. Poreklo je `authored-synthetic-example-not-a-real-model-run`: ocena je autorski pripremljena ilustracija, ne rezultat istorijskog ili današnjeg LLM poziva. U podacima ispravan odgovor ima nižu ilustrativnu ocenu 0.92. Nemojte to predstavljati kao eksperiment koji meri pristrasnost nekog stvarnog modela.

U belešci odgovorite: **da li ova ocena podržava naš kriterijum prihvatanja i kojim konkretnim dokazom to proveravamo?** Nije dovoljno reći „AI može da pogreši”. Povežite ocenu sa aktivnim dokumentom, pogrešnim rokom i citatom. Petkov D2 ovde služi kao podsetnik da relevantnost i citat sami ne potvrđuju sadržaj.

### Zašto čuvamo verzije?

Na vrhu izveštaja pogledajte `runId`, `createdAt`, `node`, `git`, `source`, `built`, `data`, `scripts`, `tests`, `toolchain` i `config`. Izveštaj automatski beleži identitet izvršavanja i sadržaja. Hash je otisak fajla: promena sadržaja menja otisak. Nije sertifikat ispravnosti ili zaštita od proizvoljnog menjanja svih dokaza.

Pre i posle očekujete drugačiju verziju izmenjenog koda, a zbog nove provere i drugačiji skup test fajlova. Javni podaci, konfiguracija i način javnog ocenjivanja ostaju isti. Vreme i ID izvršavanja normalno se razlikuju. Ne prepisujte ove vrednosti u izveštaj: dovoljno je da znate gde su i šta znače.

**Kontrolna tačka:** možete da pokažete dokaz opaženog propusta, razlikujete opažanje od hipoteze i objasnite zašto visoka ilustrativna ocena ne poništava neuspešan kriterijum.

## 5. Pretvorite hipotezu u mali opis promene

**Okvirno vreme: 15 minuta.** Pre nego što prihvatite izmenu, napišite nekoliko rečenica u odeljku „Promena i hipoteza” postojeće beleške. Nije potreban novi dokument.

Obuhvatite problem, pretpostavljeni uzrok, granicu izmene i kriterijume prihvatanja. Kriterijum treba da opisuje ponašanje za temu uopšte, ne samo da se tekst za `refund` zameni sa 30 na 14.

Primer početnog zahteva Codex-u:

```text
Radimo na izboru prihvatljivog izvora u policy putanji.
Pročitaj src/app.ts i javni ugovor iz zadatka.
Pre izmene objasni opažanje, hipotezu i predlog minimalne promene.
Aktivan izvor odgovarajuće teme mora imati prednost nad arhiviranim.
Bez prihvatljivog izvora odgovor je refused, bez modelskog poziva.
Ne menjaj javne podatke, postojeće testove, evaluator ili account putanju.
Predloži dodatni test sa sopstvenim podacima koji proverava pravilo,
a ne samo poznati refund primer. Još nemoj menjati aplikacioni kod.
```

Opis i kriterijumi prethode implementaciji. Ako Codex tvrdi da zna uzrok, tražite da ga poveže sa konkretnim kodom i opaženim tragom. Predlog koji menja javne podatke ili vraća poseban odgovor samo za refund ne zadovoljava granicu promene.

**Kontrolna tačka:** oba člana razumeju zašto bi predložena izmena rešila pravilo, koji tokovi ne smeju da se pokvare i kako ćete proveriti pretpostavku.

## 6. Prvo pokažite da dodatni test hvata grešku, pa promenite kod

**Okvirno vreme: 55 minuta.** Regresiona provera čuva ponašanje od ponovnog narušavanja. Ako provera prolazi i na starom pogrešnom kodu, možda ne proverava propust za koji je namenjena.

### 6.1. Dodajte sopstveni primer

Napravite `tests/source-eligibility.test.mjs`, po obrascu postojećih testova. Uvezite stvarni `answer` iz `../dist/app.js` i koristite Node test runner i `node:assert/strict`. Ne pišite zamensku aplikaciju u testu i ne prepisujte funkciju koju pokušavate da proverite.

Za svoj primer izaberite temu koja nije refund i pripremite mali lokalni niz dokumenata: arhiviran dokument pre aktivnog, sa različitim ID-jevima i različitim tekstovima. Očekivanje izvedite iz ugovora: aktivan izvor, odgovarajući tekst i citat. Kontrolisana modelska funkcija može da vrati tekst koji dobije iz izabranog izvora.

Time proveravate nešto što obična izmena refund odgovora ne bi rešila. Podaci se nalaze **unutar novog testa**, ne u izmenjenom `data/lab.json`. To je dozvoljeno proširenje vaše provere, ne menjanje polaznog javnog merenja.

Pre pokretanja pročitajte očekivanje. Da li bi test pao ako bi odgovor sadržao tekst aktivnog izvora, ali citirao arhivirani? Da li očekivanje zavisi od istog pogrešnog pravila kao implementacija? Ne izračunavajte očekivani izvor tako što kopirate sporni algoritam u test.

### 6.2. Pokrenite test na nepopravljenoj aplikaciji

```sh
npm run build
node --test tests/source-eligibility.test.mjs > test-before.txt 2>&1
cat test-before.txt
```

Očekujete bar jednu **neuspešnu proveru očekivanja** (`assertion`) u novom testu i kod 1 za test komandu. Proverite da je razlog baš pogrešan izvor/tekst/citat. „Fajl nije pronađen”, greška u sintaksi ili uvozu nisu dokaz da test hvata poslovni propust. Nula izvršenih testova takođe nije prolaz.

`test-before.txt` samo čuva izlaz ove dodatne provere; ne menja javni evaluator. Ako test prolazi na početnom kodu, pre izmene aplikacije istražite da li ste zaista napravili primer koji razdvaja prihvatljivo i neprihvatljivo ponašanje.

### 6.3. Sprovedite i pregledajte jednu ograničenu korekciju

Sada uz Codex promenite `src/app.ts` prema svojoj specifikaciji. Ne uređujte `dist/`: on nastaje iz TypeScript izvora. Ne lečite problem promenom redosleda javnih dokumenata ili hard-kodiranjem odgovora od 14 dana.

Pregledajte diff. Ako koristite Git, `git diff` pokazuje izmene praćenih fajlova, a `git status --short` i nove fajlove. Novi test se ne pojavljuje u običnom diff-u dok ga Git ne prati, pa otvorite i njega. Oba člana treba da umeju da objasne prihvaćene izmene, uključujući AI-generisane delove.

```sh
npm run typecheck
npm test
node --test tests/source-eligibility.test.mjs > test-after.txt 2>&1
cat test-after.txt
```

`npm test` ponovo gradi kod, tako da dodatna provera koristi novu aplikaciju. Očekujete prolaz novog testa i očuvana tri početna testa. Ako ste dodali jedan `test(...)`, zbir je 4; ako ste dodali više, broj se razlikuje. Rast sa 3 na 4 nije sam po sebi poboljšanje kvaliteta: smisao daju isti dodatni kriterijum koji je pre padao i sada prolazi.

**AI-assisted provera:** Codex može napisati i kod i test koji dele pogrešnu pretpostavku. Zato niste završili kada vam saopšti „sve radi”. Ručno povežite očekivanje testa sa ugovorom i podacima; zatim proverite postojeći javni skup, koji niste prepravljali.

**Kontrolna tačka:** imate novi smisleni test, njegov stvarni neuspeh pre korekcije, prolaz posle korekcije i pregledanu promenu aplikacionog izvora. Ako nešto nije uspelo, sačuvajte taj rezultat i precizno ga navedite, umesto da ga prikrijete.

## 7. Ponovite isto javno merenje i proverite regresije

**Okvirno vreme: 25 minuta.** Novi test proverava vašu dodatnu pretpostavku. Ne zamenjuje ceo isporučeni skup: promena u policy putanji može uticati i na odbijanje zahteva, citate ili pozivanje zavisnosti.

```sh
POSLE_EVAL_LOG="$(npm run evaluate)"
printf '%s\n' "$POSLE_EVAL_LOG"
POSLE_EVAL="$(printf '%s\n' "$POSLE_EVAL_LOG" | sed -n 's/^.*; evidence: //p')"
test -f "$POSLE_EVAL/report.json"
```

Za korekciju koja poštuje opisani ugovor očekujete **4/4**, kod 0. Zatim:

```sh
POSLE_REG_LOG="$(npm run regression)"
printf '%s\n' "$POSLE_REG_LOG"
POSLE_REG="$(printf '%s\n' "$POSLE_REG_LOG" | sed -n 's/^.*; evidence: //p')"
test -f "$POSLE_REG/report.json"
```

Očekujete **7/7**, kod 0. To su očekivanja za uspešnu ciljanu korekciju, ne brojevi koje smete da upišete ako ih niste dobili. Ako nešto ostane neuspešno, otvorite konkretan slučaj i dokumentujte ga. Odvojite neostvaren kriterijum od greške kompajliranja ili neizvršene provere.

Uporedite isti skup sa samim sobom pre/posle:

```sh
npm run compare -- "$PRE_EVAL/report.json" "$POSLE_EVAL/report.json"
npm run compare -- "$PRE_REG/report.json" "$POSLE_REG/report.json"
```

Prvo poređenje za uspešnu korekciju prikazuje:

```text
refund: FAIL -> PASS
shipping: PASS -> PASS
legacy: FAIL -> PASS
unsupported: PASS -> PASS
Before 2/4; after 4/4. Inspect traces and critical failures, not only totals.
```

U drugom poređenju očekujete iste policy promene i očuvane prolaze `active-account`, `suspended-account` i `invalid`: **5/7 pre, 7/7 posle**. Pregledajte i završni refund trag:

```sh
cat "$POSLE_EVAL/traces/refund.json"
```

Retrieval sada treba da navodi `refund-current`, reviziju 2. Za `legacy` očekujete `refused` i `modelCalls: 0` u izveštaju: nije dovoljno samo zameniti tekst odgovora, ako je nedozvoljeni izvor ipak prosleđen modelu.

### Šta ova kontrola štiti?

`compare` odbija različite oznake skupa, javne podatke, konfiguraciju, skripte za merenje ili identitete slučajeva. Ako poređenje odbije izveštaje, ne uklanjajte zaštitu. Proverite da li ste slučajno uporedili evaluation sa regression skupom, uzeli pogrešnu putanju ili promenili uslove.

Dodati test ima zasebnu ulogu: pre/posle izlazi za njega su `test-before.txt` i `test-after.txt`. Ne predstavljajte njegov rezultat kao da je oduvek bio peti slučaj javne evaluacije. **Isti javni skup** koristite za kontrolisano poređenje, a **novi primer** kao dopunsku zaštitu od preuskog rešenja.

Identičan korpus i način merenja omogućavaju da promenu povežete sa svojom korekcijom. Ako ipak promenite uslove, potrebno je ponoviti oba checkpoint-a pod istim novim uslovima i objasniti razliku; za ovaj zadatak to nije potrebno. Ponovno otvaranje početnog JSON-a nije ponovno izvršavanje izmenjene aplikacije.

**Kontrolna tačka:** možete da pokažete koji slučajevi su popravljeni, koji su ostali ispravni i koji izveštaji zaista predstavljaju uporediv eksperiment.

## 8. Donesite preporuku, ne samo zbir prolaza

**Okvirno vreme: 20 minuta.** Završavate istu [kratku belešku para](evidence-template.md), ne pišete novu studiju. Posle detaljne istrage nekoliko preciznih rečenica treba da bude dovoljno da drugi inženjer razume tvrdnju i pronađe njenu osnovu.

Počnite od **simulirane upotrebe koju procenjujete**. Da li govorite o proverenoj policy putanji ili o celom servisu, uključujući naloge? Tvrdnja „7/7 javnih provera je prošlo” opisuje konkretan skup. Ne znači „svi mogući zahtevi su bezbedni”.

U javnom regresionom skupu nema slučaja nepoznatog naloga. Petkov D1 pokazao je da taj zasebni problem postoji. Ne morate ga sada popravljati, ali ga ne smete zaboraviti pri preporuci za **celu aplikaciju**. Ograničena upotreba ima smisla samo ako se granica stvarno može sprovesti; napomena u belešci sama ne isključuje rizičnu funkciju.

Obrazložena preporuka „ne izdati” nije neuspeh. Vrednuje se istraga i pošten odnos između dokaza i zaključka, ne optimističan izbor. Ako popravka nije potpuna, tačno navedite šta je urađeno, šta pada i koju proveru treba sledeće izvršiti. To nije isto što i tvrditi da je zadatak završen zato što postoje logovi.

### Jedan signal koji biste pratili

Predložite jedan signal za upotrebu u simulaciji, uslov koji bi pokrenuo reakciju i samu reakciju. Na primer, kako biste otkrili da odgovor ponovo citira arhivirani izvor? Odakle bi dolazila informacija o stanju izvora u trenutku odgovora, ko proverava signal i šta bi bio uslov za nastavak nakon ograničenja?

Ne implementirajte dashboard ili produkcionu infrastrukturu. Važno je da signal bude operativno smislen: „pratimo kvalitet” nije dovoljno precizno. U ovom malom kontrolisanom skupu nemate osnov za tvrdnju o stvarnoj stopi greške, produkcionom SLO-u ili dostupnosti živog modela.

### Šta predajete

- Izmenjeni TypeScript izvor i novi test, uz početni/završni commit ili objašnjenje nedostajućih Git metapodataka.
- Četiri stvarna direktorijuma dokaza: početna i završna evaluacija, početna i završna regresiona provera, sa pripadajućim tragovima.
- `test-before.txt` i `test-after.txt` za isti dodatni test.
- Jednu popunjenu kratku belešku: opažanje/hipoteza, promena, kritika ocene, tumačenje provera, granice, AI pomoć, doprinos oba člana, preporuka i signal za praćenje.

Generisani `runs/` možda su isključeni iz Git praćenja. Zato proverite da li ih stvarno predajete potvrđenim kanalom; sam commit aplikacije nije zamena za nedostajuće dokaze. Ne prilažite `node_modules/`, tajne ili stvarne korisničke podatke. Ne prepisujte hash-eve i cele tabele u belešku.

Predaja i rok: Rok i kanal predaje biće potvrđeni pre početka nedeljnog zadatka. Podrška između sesija su odobreni Codex i kursni Discord. Tutor ne pruža aktivnu asinhronu pomoć. Ako zapnete, podelite bezbedan opis: koji korak/komanda, očekivanje, stvarna greška i šta ste već proverili. Ne delite pristupne podatke.

### Šta se dešava u sredu?

Tutor ponovo gradi vaš **stvarni predati izvor** i izvršava ga sopstvenim slučajevima kroz kontrolisane zavisnosti. Objavljene kategorije su prihvatljivi/arhivirani i nedostajući izvori, citati, poznat/nepoznat nalog, neispravan zahtev i otkaz modela. Možete pregledati nalaz i argumentovano ga osporiti, ali ne menjate tutorove autoritativne kriterijume ili referentne slučajeve.

Nezavisna provera može otkriti da rešenje radi samo za javni primer ili da preostali rizik čini preporuku preširokom. Ona nije kazna što niste unapred znali privatne slučajeve. Proverava se odnos vašeg koda prema objavljenom ugovoru.

Zatim sledi zaseban incident i operativna odluka, **bez novog obaveznog programiranja**. Dopunjujete istu belešku i revidirate preporuku. [Materijal za sredu](../../../session-02/published/student/session-material.md) detaljnije objašnjava taj postupak.

Par se samostalno organizuje. Oba člana navode konkretan doprinos i lično provereni rezultat; osoba koja vodi prikaz para menja se nedeljno. Ne moraju svi parovi pojedinačno izlagati celoj grupi.

## Kada ste završili?

Prestanite sa dodatnim funkcijama kada imate jednu istraženu korekciju, ciljanu proveru koja je pre pala i posle prošla, ceo javni regresioni rezultat, kontrolisano poređenje i obrazloženu preporuku sa ograničenjima. Nije potrebno dodavati još jedan model, popravljati sve probleme ili graditi alat za ocenjivanje.

Okvirna vremena koraka daju oko 220 minuta rada; to je plan, ne dokaz izmerene zahtevnosti. Ako priprema ili prepreka potroše budžet, zabeležite bloker i preostali posao. Neizvršena provera nije prolaz, a Codex-ova potvrda nije nezavisni dokaz.

Za kraj, oba člana treba da mogu da odgovore: **Šta smo promenili, šta zaista znamo da radi bolje i šta još ne možemo odgovorno da tvrdimo?**

## Ako nešto ne ide prema očekivanju

| Simptom | Šta prvo proveriti |
| --- | --- |
| Nema `package.json` ili skripte | Trenutni direktorijum; otvorite raspakovanu studentsku aplikaciju |
| `npm ci` ne uspeva | Node verziju, lockfile i odobren pristup paketu/keš; to nije očekivani eval propust |
| Evaluacija daje kod 1 | Da li postoji nov izveštaj i konkretan neuspešan slučaj; ne samo izlazni kod |
| `npm start` nije napravio `runs/` | To je očekivano: izveštaje prave evaluate/regression, ne pojedinačni upit |
| Novi test ne vidi izmenu | Gradite trenutni `src/`; ne menjajte ručno `dist/` i ne čitajte stari izveštaj |
| Test pada zbog uvoza ili nema testova | Popravite izvršavanje testa pre zaključka da je uhvaćen ciljni propust |
| `compare` odbija izveštaje | Isti skup, stvarne putanje, neizmenjene podatke/konfiguraciju/evaluator |
| Promenljive putanja su prazne | Isti Bash/zsh/Git Bash terminal i ispis komande; po potrebi preuzmite putanju direktno iz konzole |
