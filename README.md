# Classroom-Management-Spiel · Schritt 1

Dieser Prototyp bildet nur den ersten Spielschritt ab: **Klassenraum vorbereiten**.

## Enthaltene Dateien

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

## Funktionen

- Auswahl von vier Grund-Sitzordnungen:
  - Reihensitzordnung
  - U-Form
  - Gruppentische
  - Partnerinseln
- Tische sind per Drag & Drop im Raster verschiebbar.
- Vor und hinter Tischen muss ein Rasterfeld frei bleiben; nebeneinander dürfen Tische direkt stehen.
- 10 Schülerprofile können per Drag & Drop oder Klick auf Tische verteilt werden.
- Alle Schüler*innen müssen platziert werden, bevor die Vorbereitung ausgewertet werden kann.
- Schüler*innen auf Tischen haben einen roten Entfernen-Button und können in die Auswahlliste zurückgelegt werden.
- Die Lehrkraft kann frei per Drag & Drop im Raum platziert werden.
- Blickrichtung der Lehrkraft ist einstellbar.
- Sichtbereich/Präsenzzone wird je nach Lehrkraftverhalten berechnet:
  - vorne stehend/leitend: breiter Fächer über vier Reihen
  - bewegend im Raum: linearer Präsenzkorridor mit schneller Abschwächung
  - sitzend am Pult: enger Bereich über zwei Reihen
- Sichtfeld wird durch davorliegende Tische abgeschwächt.
- Störpotenziale und stabilisierende Nachbarschaften werden farblich sichtbar gemacht:
  - Grün: Präventions-/Stabilisierungswirkung
  - Rot: Störrisiko
  - Gelb/Orange: Risikofaktor wird durch Sichtfeld oder stabilisierende Mitschüler*innen teilweise neutralisiert
- Die Auswertung erscheint mittig über dem Spielfeld und zusätzlich in der rechten Seitenleiste.
- Die Auswertung ist strenger:
  - riskante Sitznachbarschaften werden einzeln gezählt
  - diagonale Sitznachbarschaften zählen mit
  - störanfällige Schüler*innen im stärksten Sichtbereich bringen mehr Punkte
  - störanfällige Schüler*innen außerhalb des Sichtbereichs führen zu deutlicherem Punktabzug

## Nutzung

Die Dateien können direkt statisch geöffnet oder in GitHub Pages abgelegt werden.

Für GitHub Pages reicht es, den Ordnerinhalt in ein Repository zu legen und Pages auf den entsprechenden Branch/Ordner zu setzen.

## Nächster sinnvoller Entwicklungsschritt

Als nächstes könnten feste Klassenregeln und Routinen ergänzt werden. Diese sollten als auswählbare Variablen gespeichert werden, damit spätere Branching-Szenarien gezielt darauf zurückgreifen können.
