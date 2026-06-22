# Classroom-Management-Spiel – Prototyp

Interaktive Webseite für eine Präsentationsphase zu Classroom Management und kooperativer Verhaltensmodifikation.

## Dateien

- `index.html` – Schritt 1: Klassenraum vorbereiten
- `rules.html` – Schritt 2: Klassenregeln auswählen
- `styles.css` – gemeinsames Styling
- `script.js` – Spiellogik für Schritt 1
- `rules.js` – Spiellogik für Schritt 2

## Schritt 1: Klassenraum vorbereiten

Umgesetzt:

- Klassenraumraster mit quadratischen Feldern
- feste Raumzonen: Tafel, Tür, Notausgang, Fenster, Klassenschrank, Waschbecken
- freie Drag-and-drop-Platzierung von Tischen im Raster
- freie Drag-and-drop-Platzierung der Lehrkraft im Raster
- Blickrichtung der Lehrkraft durch Klick auf die Lehrkraft veränderbar
- grüner Sichtfächer der Lehrkraft mit Abschwächung durch Tische
- Schülerprofile rechts neben dem Raster
- Schüler*innen per Drag & Drop auf Tische setzen, verschieben oder über X entfernen
- Mouseover über besetzte Tische zeigt das Schülerprofil
- rote Risikofelder, grüne Stabilisierung und gelb/orange Neutralisierung
- zufällig platzierter Müll als Störreiz
- Besen anklicken, danach Müll anklicken, um Müll zu entfernen
- Auswertung mit manuellem Slider und Lebensbalken
- Game-over-Screen mit Button „Neuer Versuch“
- Übergang zu `rules.html`, wenn die Vorbereitung tragfähig ist

## Bewertungsidee

Die Vorbereitung erzeugt eine Startstabilität von 0 bis 10 Balken. Bewertet werden unter anderem:

- ob alle Schüler*innen platziert wurden
- ob Laufwege zwischen Tischreihen frei bleiben
- ob störanfällige Schüler*innen im wirksamen Sichtbereich sitzen
- ob riskante Sitznachbarschaften entstehen
- ob stabilisierende Nachbarschaften Risiken abfedern
- ob Müll als Störreiz entfernt wurde

## Schritt 2: Klassenregeln

Umgesetzt:

- vorbereitetes Klassenraster wird eingefroren übernommen
- Schülerliste bleibt sichtbar
- 15 vorgefertigte Regeln werden nacheinander angezeigt
- Zuordnung in drei Listen: Klassenregeln, Später zuordnen, Aussortiert
- Ziel: genau 6 Klassenregeln, 9 aussortierte Regeln, keine Regel in „Später zuordnen“
- Auswahl wird im lokalen Browser-Speicher gesichert

## Nutzung

1. ZIP entpacken.
2. `index.html` im Browser öffnen.
3. Für GitHub Pages alle Dateien gemeinsam in ein Repository legen.
4. Als Startseite `index.html` verwenden.

Die Daten zwischen Schritt 1 und Schritt 2 werden über `localStorage` gespeichert.
