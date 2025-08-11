# MovieNight Finder – Abschlussprojekt Web Technologien FS25

## Projektinformationen

- **Modul:** Web Technologien FS25  
- **Student:** Colin Felber  

---

## Projektübersicht

Dieses Repository dokumentiert die Entwicklung der Webanwendung **MovieNight Finder** im Rahmen des Abschlussprojekts im Modul *Web Technologien FS25*. Die Anwendung wurde vollständig selbstständig geplant und programmiert.

---

## Umgesetzte Anforderungen

### 1. Aufgabenstellung

- Die Anwendung besteht aus einem Frontend (HTML, CSS, JavaScript) und einem Backend auf Basis von Node.js und Express.  
- Nutzer:innen können Filme nach Genre, Sprache, Anbieter, Bewertung und Kinderfreundlichkeit filtern.  
- Die Filterdaten werden per JavaScript ohne Neuladen der Seite an das Backend übermittelt.  
- Die gefilterten Filme werden als JSON zurückgegeben und im Browser angezeigt.

---

### 2. Technologischer Rahmen

- Eingesetzte Technologien: HTML, CSS, JavaScript, Node.js, Express, JSON, W3.CSS  
- Keine unerlaubten Bibliotheken oder Frameworks wurden verwendet.  
- Das Projekt wurde eigenständig und unabhängig von Übungen entwickelt.

---

### 3. Technische Vorgaben

- **HTML:** 1 Datei, unter 200 Zeilen  
- **JavaScript:** mehrere Dateien, insgesamt unter 400 Zeilen  
- **CSS:** unter 200 Zeilen  
- Alle Vorgaben zu Dateistruktur und Codeumfang wurden eingehalten.

---

### 4. Frontend

#### Struktur und Inhalte

- Navigation mit Sprungmarken zu Beschreibung, Eingabe und Ausgabe  
- Einleitender Informationsbereich mit Bild und erklärendem Text  
- Formular mit:
  - Genre (Dropdown)  
  - Sprache (Dropdown)  
  - Streaminganbieter (Dropdown)  
  - Mindestbewertung (Zahleneingabe)  
  - Kinderfreundlich (Checkbox)  
  - Suchbutton

#### Ergebnisdarstellung

- Filme werden in Kartenform dargestellt mit:
  - Titel  
  - Poster  
  - Bewertung  
  - Erscheinungsjahr  
  - Beschreibung  
- Fehler wie keine Treffer oder falsche Eingaben werden gut sichtbar behandelt

#### Technische Details

- Gültiges, semantisches HTML  
- CSS und JavaScript ausgelagert in externe Dateien  
- Verwendung relativer Pfade  
- Umsetzung der WCAG-Kriterien 1.1.1, 1.4.3, 3.3.1 und 3.3.2

---

### 5. Backend

- Validiert und verarbeitet alle Eingaben korrekt  
- Antwortet mit bis zu 12 passenden Filmen im JSON-Format  
- Führt zusätzliche API-Abfragen für Sprache und Anbieter durch  
- Bereits gesehene Filme (per Cookie markiert) werden ausgeschlossen  
- Rückgabe erfolgt mit korrekten HTTP-Statuscodes  
- Fehler werden strukturiert und verständlich zurückgegeben

---

### 6. Design und Layout

- Responsives Design für Mobilgeräte und Desktop  
- Styling basiert auf W3.CSS (eingebunden per CDN)  
- Benutzeroberfläche ist klar strukturiert und thematisch passend

---

### 7. Canvas-Animation

- Während der Filmsuche wird eine Canvas-Animation angezeigt  
- Darstellung einer animierten Filmrolle  
- Es werden über zehn Zeichenoperationen verwendet

---

### 8. Validierung

- Frontend: Direkte Validierung der Formulareingaben mit visuellem Feedback  
- Backend: Prüfung auf Typen, Wertebereiche und Plausibilität  
- Fehlerhafte Eingaben werden blockiert und hervorgehoben

---

### 9. Erweiterte Funktionen

- Nutzung der externen API von TheMovieDB (inkl. API-Key)  
- Es werden mindestens drei Datenpunkte verwendet: Poster, Bewertung, Beschreibung  
- Die Abfrage richtet sich dynamisch nach den Nutzereinstellungen

---

## Nutzung von GPT

GPT wurde unterstützend und regelkonform eingesetzt, unter anderem für:

- Textvorschläge für erklärende Abschnitte
- Strukturidee für die Canvas-Animation  
- Optimierung einzelner Codebestandteile im JavaScript (z. B. Cookie-Verwaltung, Eingabe-Validierung)  
- Strukturierung des Backends und API-Filterlogik

Die übernommenen Codeabschnitte überschritten zu keinem Zeitpunkt 15 Zeilen und wurden eigenständig angepasst. Der Einsatz von GPT diente primär als Ideengeber, zur Fehlersuche und zur Inspiration. Die Umsetzung basiert auf eigenem Verständnis und wurde individuell erarbeitet.

---

## Fazit

Die Anwendung **MovieNight Finder** erfüllt alle Anforderungen des Abschlussprojekts. Sie ist funktional stabil, benutzerfreundlich gestaltet und wurde vollständig eigenständig umgesetzt.
