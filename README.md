# Classroom-Management-Spiel – Schritt 1 und Schritt 2

Dieser Prototyp bildet die ersten beiden Abschnitte der interaktiven Phase ab:

1. `index.html`: Klassenraum vorbereiten
2. `rules.html`: Klassenregeln aufstellen

Die Seiten sind für eine einfache Einbindung über GitHub Pages gedacht. Alle Dateien können in ein Repository gelegt werden; Startseite ist `index.html`.

## Dateien

- `index.html` – Schritt 1: Klassenraum vorbereiten
- `rules.html` – Schritt 2: Klassenregeln aufstellen
- `styles.css` – Gestaltung beider Seiten
- `script.js` – Spiellogik, Drag-and-Drop und Auswertung für Schritt 1
- `rules.js` – Regelauswahl, Listenlogik und Speicherung für Schritt 2
- `README.md` – kurze Dokumentation

## Schritt 1: Klassenraum vorbereiten

Funktionsumfang:

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
- animierte Auswertungskachel über dem Spielfeld
- Lebensleiste mit 10 Balken anzeigen
- Punkte manuell mit „Weiter“ nacheinander ein- und auszählen
- Game-Over-Hinweis bei 0 oder weniger Punkten
- Weiterleitung zu Schritt 2, wenn mindestens 1 Punkt erreicht wurde

Die Vorbereitung wird beim Übergang zu Schritt 2 im lokalen Browser-Speicher unter `classroomGame.step1` gespeichert.

## Schritt 2: Klassenregeln aufstellen

Funktionsumfang:

- übernommener Klassenraum wird links als nicht bewegliches Raster angezeigt
- Schülerliste bleibt sichtbar, damit Regeln passend zu Stärken und Risiken ausgewählt werden können
- 15 vorgefertigte Regeln werden nacheinander eingeblendet
- jede Regel kann in eine von drei Listen gelegt werden:
  - Klassenregeln
  - Später zuordnen
  - Aussortiert
- Regeln können per Drag & Drop oder über kleine Aktionsbuttons zwischen den Listen verschoben werden
- am Ende müssen genau 6 Regeln in „Klassenregeln“ liegen
- genau 9 Regeln müssen in „Aussortiert“ liegen
- die Liste „Später zuordnen“ muss leer sein
- die Regelauswahl kann gespeichert werden, sobald diese Bedingungen erfüllt sind

Die ausgewählten Regeln werden im lokalen Browser-Speicher unter `classroomGame.step2.rules` gespeichert. Der Entwurf während des Sortierens wird unter `classroomGame.step2.rulesDraft` gespeichert.

## Didaktische Grundidee

Die Vorbereitung des Klassenraums soll sichtbar machen, dass Classroom Management präventiv wirkt. Sitzordnung, räumliche Übersicht, Lehrkraftpositionierung und die Nähe zu potenziell störungsanfälligen Schüler*innen beeinflussen die spätere Stabilität der Unterrichtssituation.

Die Auswahl der Klassenregeln ergänzt diese Prävention. Regeln werden nicht frei formuliert, sondern als feste Variablen gespeichert, damit spätere Szenarien gezielt darauf zurückgreifen können. Beispiel: Wenn die Regel „Handys bleiben während des Unterrichts in der Tasche“ gewählt wurde, kann ein späteres Handy-Szenario anders bewertet werden als ohne diese Regel.

## Versteckte Variablen für spätere Spielphasen

Nach Schritt 1 werden unter anderem gespeichert:

- `chosenLayout` – gewählte Sitzordnung
- `preparationScore` – sichtbare Startstabilität von 0 bis 10
- `rawPreparationScore` – rechnerischer Punktwert, kann negativ sein
- `teacher` – Position, Blickrichtung und Verhalten der Lehrkraft
- `desks` – Tischpositionen
- `assignments` – Sitzplätze der Schüler*innen
- `metrics` – Bewertungsdaten und mögliche Szenario-Hooks

Nach Schritt 2 werden gespeichert:

- `acceptedRuleIds` – verbindliche Klassenregeln
- `rejectedRuleIds` – aussortierte Regeln
- `pendingRuleIds` – sollte am Ende leer sein
- `acceptedRules` – Regeltexte und Hinweise

Diese Daten können später genutzt werden, um passende Störungsszenarien einzustreuen, zum Beispiel:

- Schüler*in spielt mit dem Handy, wenn Handy-Risiko und schlechter Überblick zusammenkommen.
- Zwischenrufe nehmen zu, wenn eine impulsive Person außerhalb des Sichtbereichs sitzt.
- Konflikte entstehen, wenn konfliktaffine Schüler*innen nebeneinander sitzen.
- Eine Melde-Regel kann bei Zwischenrufen als pädagogisch angemessene Classroom-Management-Reaktion aufgegriffen werden.

## Neu: Spielerklärung am Start

Beim Öffnen von `index.html` wird nun zuerst eine abgedunkelte Spielerklärung eingeblendet. Sie besteht aus sechs Karten, die man manuell durchklicken kann:

1. Ziel des Rasterspiels
2. Lehrkraft und Sichtbereich
3. rote Risikofelder störanfälliger Schüler*innen
4. grüne Stabilisierung durch Sichtfeld und unterstützende Mitschüler*innen
5. Neutralisierung von Risiko durch Schutzfaktoren
6. zentrale Bewertungskriterien

Die Karten wechseln mit einer Slider-Animation. Über den Button „Anleitung“ kann die Erklärung später erneut geöffnet werden.

## Designstand

Die Oberfläche nutzt einen dunklen Blau-/Anthrazit-Hintergrund, abgehobene Kacheln mit Schatten und Glas-Effekt sowie weichere Button- und Kartenanimationen.
