# Classroom-Management-Spiel – Schritt 1: Klassenraum vorbereiten

Dieser Prototyp bildet nur den ersten Abschnitt der interaktiven Phase ab: Die Nutzer*innen bereiten einen Klassenraum vor, indem sie eine Sitzordnung wählen, Tische verschieben, Schüler*innen platzieren und die Lehrkraft positionieren.

## Dateien

- `index.html` – Grundstruktur der Webseite
- `styles.css` – Gestaltung und Layout
- `script.js` – Spiellogik, Drag-and-Drop, Auswertung
- `README.md` – kurze Dokumentation

## Starten

Die Datei `index.html` kann direkt im Browser geöffnet werden. Für GitHub Pages reicht es, alle Dateien in ein Repository zu legen und GitHub Pages für den Ordner zu aktivieren.

## Aktueller Funktionsumfang

- Auswahl aus vier Sitzordnungen:
  - Reihensitzordnung
  - U-Form
  - Gruppentische
  - Partnerinseln
- Tische im Raster verschieben
- 10 Schülerprofile per Drag & Drop oder Klick platzieren
- Lehrkraft im Raum platzieren
- Blickrichtung der Lehrkraft einstellen
- Sichtbereich der Lehrkraft grün-transparent anzeigen
- Lehrkraftverhalten wählen:
  - vorne stehend / leitend
  - bewegend im Raum
  - sitzend am Pult
- Startstabilität berechnen
- versteckte Variablen für spätere Szenarien ausgeben

## Didaktische Grundidee

Die Vorbereitung des Klassenraums soll sichtbar machen, dass Classroom Management präventiv wirkt. Sitzordnung, räumliche Übersicht, Lehrkraftpositionierung und die Nähe zu potenziell störungsanfälligen Schüler*innen beeinflussen die spätere Stabilität der Unterrichtssituation.

Der Prototyp wertet daher nicht nur aus, ob alle Schüler*innen platziert wurden, sondern auch, ob risikoreichere Schüler*innen im Sichtbereich der Lehrkraft sitzen, ob ungünstige Nachbarschaften entstehen und ob die Lehrkraft durch ihr Verhalten im Raum Präsenz zeigt.

## Versteckte Variablen für spätere Spielphasen

Die Webseite erzeugt nach der Auswertung unter anderem folgende Informationen:

- `layout` – gewählte Sitzordnung
- `score` – Startstabilität von 0 bis 10
- `metrics.highRiskOutsideVision` – störungsanfälligere Schüler*innen außerhalb des Sichtbereichs
- `metrics.conflictPairs` – problematische Nachbarschaften
- `metrics.phoneRiskBackOrBlind` – Handy-/Ablenkungsrisiko außerhalb des Überblicks
- `scenarioFlags` – mögliche Auslöser für spätere Branching-Szenarien

Diese Daten können später genutzt werden, um passende Störungsszenarien einzustreuen, zum Beispiel:

- Schüler*in spielt mit dem Handy, wenn Handy-Risiko und schlechter Überblick zusammenkommen.
- Zwischenrufe nehmen zu, wenn eine impulsive Person außerhalb des Sichtbereichs sitzt.
- Konflikte entstehen, wenn konfliktaffine Schüler*innen nebeneinander sitzen.

## Geplanter nächster Schritt

Als nächstes können Klassenregeln und Routinen ergänzt werden. Diese sollten als feste Auswahloptionen umgesetzt werden, damit spätere Szenarien gezielt darauf zurückgreifen können.

Beispielhafte Regeln:

- Wir melden uns, bevor wir sprechen.
- Wir hören einander ausreden.
- Handys bleiben in der Tasche.
- Während Arbeitsphasen bleiben wir am Platz.

Beispielhafte Routinen:

- Stundenstart-Routine
- Ruhezeichen
- Materialausgabe
- Übergang in Gruppenarbeit
- Hilfesignal bei Problemen

