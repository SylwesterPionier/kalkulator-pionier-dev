# kalkulator-pionier-dev

Kalkulator Doradcy Pionier Energia.

Projekt kalkulatora handlowego dla:
- magazynow energii
- PV
- taryf dynamicznych
- Pstryk
- Sigenergy
- SRNE
- Sofar

Zalozenia:
- dzialanie offline
- generowanie PDF
- modularna architektura
- kompatybilnosc z Codex

## Aktualny punkt startowy

Glowny plik `index.html` przekierowuje do aktualnej dzialajacej wersji kalkulatora:

`kalkulator-pionier-dev/index.html/kalkulator_pionier_energia_v55_.html.html`

Ten plik pozostaje zachowany jako wersja produkcyjna, zeby nie naruszyc:
- logiki taryf,
- obliczen,
- dzialania offline,
- raportow PDF/A4,
- trybu wydruku.

## Przygotowana struktura

Docelowa struktura pod dalsza modularizacje:

```text
index.html
css/main.css
css/report.css
css/print.css
docs/reorganization-plan.md
```

Szczegolowy plan dalszych krokow jest w `docs/reorganization-plan.md`.
