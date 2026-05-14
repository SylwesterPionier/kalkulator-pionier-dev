# Plan reorganizacji projektu

## Stan obecny

- Produkcyjna aplikacja jest w pliku `kalkulator-pionier-dev/index.html/kalkulator_pionier_energia_v55_.html.html`.
- Plik zawiera HTML, CSS, JavaScript, dane offline i grafiki base64.
- Logika taryf, kalkulacje, raport PDF/A4 i tryb wydruku sa wbudowane w ten sam plik.
- Nie wolno przepisywac projektu od nowa ani zmieniac wynikow obliczen.

## Zasady bezpiecznej pracy

1. Nie usuwac istniejacego pliku produkcyjnego przed pelna weryfikacja.
2. Nie zmieniac logiki JavaScript podczas wydzielania CSS.
3. Zachowac dzialanie offline.
4. Zachowac tryb PDF/A4 i wszystkie reguly `@media print`.
5. Kazdy etap sprawdzac osobno: widok aplikacji, raport, druk/PDF.

## Etap 1 - wykonany

- Dodano glowny `index.html`, ktory kieruje do aktualnej dzialajacej wersji kalkulatora.
- Dodano katalog `css/` z plikami docelowymi:
  - `css/main.css`
  - `css/report.css`
  - `css/print.css`
- Zachowano oryginalny plik aplikacji bez zmian.

## Etap 2 - nastepny bezpieczny krok

Mechanicznie wydzielic CSS z bloku `<style>` w pliku produkcyjnym:

- style ogolne aplikacji do `css/main.css`,
- style raportu i PDF do `css/report.css`,
- wszystkie reguly `@media print` oraz `@page` do `css/print.css`.

Po wydzieleniu w HTML powinny zostac tylko linki:

```html
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/report.css">
<link rel="stylesheet" href="css/print.css">
```

Ten etap powinien byc wykonany dopiero z pelnym porownaniem wizualnym, poniewaz obecny CSS zawiera wiele historycznych poprawek wydruku.

## Etap 3 - dalsza modularizacja

Po stabilnym wydzieleniu CSS mozna rozdzielac JavaScript bez zmiany logiki:

- `js/data/pricing.js` - cenniki i stale,
- `js/data/tariffs.js` - taryfy i definicje,
- `js/calculations/` - funkcje obliczeniowe,
- `js/report/` - renderowanie raportu,
- `js/app.js` - inicjalizacja i zdarzenia UI.

Kazdy modul powinien byc wydzielany pojedynczo i porownywany z poprzednia wersja.
