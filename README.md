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
- animierte Auswertungskachel über dem Spielfeld
- Lebensleiste mit 10 Balken anzeigen
- Punkte nacheinander ein- und auszählen; der sichtbare Balken bleibt zwischen 0 und 10, der rechnerische Punktewert kann auch negativ werden
- Game-Over-Hinweis bei 0 oder weniger Punkten
- Weiterleitungsschaltfläche zum geplanten Schritt 2 „Klassenregeln aufstellen“
- versteckte Variablen für spätere Szenarien ausgeben

## Didaktische Grundidee

Die Vorbereitung des Klassenraums soll sichtbar machen, dass Classroom Management präventiv wirkt. Sitzordnung, räumliche Übersicht, Lehrkraftpositionierung und die Nähe zu potenziell störungsanfälligen Schüler*innen beeinflussen die spätere Stabilität der Unterrichtssituation.

Der Prototyp wertet daher nicht nur aus, ob alle Schüler*innen platziert wurden, sondern auch, ob risikoreichere Schüler*innen im Sichtbereich der Lehrkraft sitzen, ob ungünstige Nachbarschaften entstehen und ob die Lehrkraft durch ihr Verhalten im Raum Präsenz zeigt.

## Versteckte Variablen für spätere Spielphasen

Die Webseite erzeugt nach der Auswertung unter anderem folgende Informationen:

- `layout` – gewählte Sitzordnung
- `preparationScore` – sichtbare Startstabilität von 0 bis 10
- `rawPreparationScore` – rechnerischer Punktwert, kann negativ sein
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


## Auswertungslogik

Die Auswertung läuft schrittweise ab. Jeder Bewertungsaspekt wird etwa alle zwei Sekunden im oberen Bereich der Auswertungskachel angezeigt. Unten wird eine Lebensleiste mit maximal zehn Balken aufgebaut oder reduziert.

- Pluspunkte füllen Balken auf.
- Minuspunkte entfernen Balken.
- Unter 0 wird die Balkenanzeige nicht weiter reduziert, der rechnerische Punktwert kann aber negativ werden.
- Bei weniger als 1 Punkt erscheint ein Game-Over-Hinweis.
- Ab 1 Punkt kann zum nächsten geplanten Schritt übergegangen werden: Klassenregeln aufstellen.

## Update: manuelle Auswertung

Die Auswertung läuft nicht mehr automatisch durch. Nach dem Klick auf „Vorbereitung auswerten“ erscheint eine zentrale Bewertungskachel. Jede Bewertungsinformation wird als Slider angezeigt; mit „Weiter“ wird zum nächsten Punkt gewechselt. Die Lebensleiste bleibt währenddessen statisch sichtbar und zeigt 0 bis 10 Balken. Bei 0–3 Balken werden aktive Balken rot, bei 4–6 gelb und bei 7–10 grün dargestellt. Der rechnerische Punktestand kann unter 0 fallen, die Balkenanzeige bleibt jedoch zwischen 0 und 10.
