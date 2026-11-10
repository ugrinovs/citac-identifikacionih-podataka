# ČIP — javni sajt

Statički Astro sajt za **ČIP (Čitač identifikacionih podataka)**, besplatnu macOS aplikaciju. Prvo javno izdanje fokusirano je na ličnu kartu Srbije; saobraćajna dozvola i zdravstvena kartica su planirane. Javni repozitorijum sajta i paketa je `ugrinovs/citac-identifikacionih-podataka`; izvorni kod aplikacije ostaje u privatnom `ugrinovs/citaci` repozitorijumu.

## Lokalno

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Tekst strana je u `src/pages/`, izgled u `src/styles/global.css`. Podaci o izdanjima se osvežavaju iz javnih GitHub Releases tokom objave sajta. Ako nema stabilnog izdanja sa `.dmg` paketom, dugme za preuzimanje prikazuje „Preuzimanje uskoro”.

## GitHub Pages

Sajt je podešen za `https://cip.ugrinovs.com/`. Poddomen `cip` ima DNS CNAME ka `ugrinovs.github.io`, a u podešavanjima GitHub Pages izabran je isti custom domain i uključen **Enforce HTTPS**. Stara adresa `https://ugrinovs.github.io/citac-identifikacionih-podataka/` preusmerava na novi domen. Workflow `.github/workflows/site.yml` gradi Astro projekat i objavljuje `dist/` preko zvaničnih GitHub Pages Actions. Ostali projekti na `ugrinovs.github.io/<pathname>/` ostaju na svojim putanjama.

U javnom repozitorijumu je podešeno **Settings → Pages → Build and deployment → GitHub Actions**. Workflow se pokreće posle izmene sajta; objava javnog Release-a pokreće novo izvršavanje sa grane `main`, jer Pages okruženje ne prihvata deploy sa taga. Dodatni token nije potreban.

Lokalni Astro preview koristi `http://localhost:4321/`.

## Izdanja i download

1. Privatni repo priprema verziju i changelog preko Conventional Commits + Release Please.
   Prvo javno izdanje ima PAdES B-B potpis bez vremenskog žiga. Opcioni žig
   može doći u kasnijoj verziji, posle provere TSA uslova i validacije.
2. Privatni repo pravi Release build i `.dmg`; pre objave proverava funkcije i paket. Obavezno dopuniti inventar svih biblioteka i uključiti potrebne tekstove licenci u paket. Provera na čistom Macu je planirana naknadno i nije uslov za prvo izdanje. Prva izdanja su bez Apple Developer ID potpisa i notarizacije. **Ne objavljivati razvojni build.**
3. Tek provereni paket se postavlja kao asset javnog Release-a u `ugrinovs/citac-identifikacionih-podataka`. U opisu izdanja treba jasno navesti da paket nije potpisan Developer ID sertifikatom ni notarizovan. Ime asseta treba da bude `LicnaKarta.dmg`, `LicnaKarta-<verzija>.dmg`, `CIP.dmg` ili `CIP-<verzija>.dmg`.
4. `npm run sync:releases` čita samo javne stabilne Releases i generiše `src/data/releases.json`. Workflow ga pokreće pri objavi Release-a, pa gradi i objavljuje sajt. `releases/latest/download/CIP.dmg` može služiti kao trajni spoljašnji link ako ime asseta ostaje isto.

Javni changelog se preuzima iz **javnog Release body-ja**. Ne kopirati automatski privatne commit linkove ili interne beleške u javni tekst. Release Please ne pravi ni ne proverava instalacioni paket; to ostaje zaseban korak u privatnom repozitorijumu.

## Snimci ekrana

Galerija trenutno koristi ilustrativne PNG prikaze razvojne verzije sa izmišljenim podacima u `public/screenshots/`; opisi u `src/data/screenshots.json` jasno odvajaju funkcije koje nisu u paketu 0.1.0. Kada se objavi naredni paket, zameniti ih stvarnim snimcima tog javnog builda bez ličnih podataka sa dokumenata:

```json
[{ "file": "prijava.webp", "alt": "Provera spremnosti za prijavu u pregledaču", "caption": "Prijava u pregledaču" }]
```

Galerija se prikazuje kada lista nije prazna. Ilustrativni prikazi ne dokazuju rad sa konkretnom karticom i ne treba ih predstavljati kao snimke paketa 0.1.0.
