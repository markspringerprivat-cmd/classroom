# Classroom-Management-Spiel – Schritt 1 und 2

Interaktiver Prototyp für die Präsentation zu Classroom Management und kooperativer Verhaltensmodifikation.

## Dateien

- `index.html` – Schritt 1: Klassenraum vorbereiten
- `rules.html` – Schritt 2: Klassenregeln auswählen
- `styles.css` – Gestaltung für beide Seiten
- `script.js` – Spiellogik für Schritt 1
- `rules.js` – Logik für Schritt 2

## Schritt 1: Klassenraum vorbereiten

Umgesetzt:

- moderner dunkler Blau-/Anthrazit-Look mit Kacheloptik
- Start-Anleitung als Slider mit abgedunkeltem Hintergrund
- Tafelmarkierung am oberen Spielfeldrand
- quadratisches Klassenraumraster
- Tische per Drag & Drop verschiebbar
- vor und hinter Tischen muss ein Rasterfeld frei bleiben; nebeneinander dürfen Tische direkt stehen
- 10 Schülerprofile direkt im Spielfeldbereich unter der Legende
- alle Schüler*innen müssen platziert werden, bevor ausgewertet werden kann
- Schüler*innen können per Drag & Drop gesetzt, verschoben oder über ein rotes X wieder entfernt werden
- Mouseover über besetzte Tische zeigt erneut die Schülerkarte mit relevanten Hinweisen
- Lehrkraft ist frei per Drag & Drop platzierbar
- Lehrkraft wird durch Anklicken gedreht; ein kleines Bedienfeld öffnet die Blickrichtungswahl
- Sichtbereich der Lehrkraft wird grün angezeigt und durch Tische abgeschwächt
- rote Risikofelder, grüne Stabilisierungsfelder und gelb-orange Neutralisierung werden visualisiert
- detaillierte Auswertung als Slider mit Lebensbalken
- Lebensbalken: rot bei 0–3, gelb bei 4–6, grün bei 7–10 Balken
- Game Over enthält einen Button „Neuer Versuch“
- bei erfolgreicher Vorbereitung geht es weiter zu `rules.html`

## Schritt 2: Klassenregeln auswählen

Umgesetzt:

- fertiges Klassenraster wird nicht beweglich übernommen
- Schülerliste bleibt sichtbar
- 15 vorgefertigte Regeln werden einzeln angezeigt
- Regeln können in drei Listen sortiert werden:
  - Klassenregeln
  - Später zuordnen
  - Aussortiert
- Ziel: genau 6 Regeln in Klassenregeln, 9 in Aussortiert, 0 in Später zuordnen
- Regeln können zwischen den Listen verschoben werden
- Auswahl wird im Browser gespeichert, damit spätere Szenarien darauf zugreifen können

## Nutzung

Die ZIP entpacken und `index.html` im Browser öffnen. Für GitHub Pages reicht es, alle Dateien in dasselbe Verzeichnis zu legen.

## Hinweis

Der Prototyp bildet noch nicht die Unterrichtsphase mit Branching-Szenarien ab. Er legt aber bereits Variablen an, die später für Szenarien genutzt werden können, zum Beispiel Sichtfeld, Risikokonstellationen, stabilisierende Nachbarschaften und ausgewählte Klassenregeln.
