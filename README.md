Aplikacja CRUD – Zarządzanie książkami
Opis projektu

Projekt przedstawia prostą aplikację typu CRUD (Create, Read, Update, Delete) umożliwiającą zarządzanie bazą danych książek.
Użytkownik może dodawać, edytować, usuwać i przeglądać książki poprzez interfejs przeglądarkowy.
Aplikacja została zbudowana w technologii Node.js z użyciem bazy danych SQLite.

Technologie

Node.js

Express.js

SQLite

HTML, CSS, JavaScript

Render (hosting)

Struktura katalogów
project-products-modified-main/
│
├── backend/                # logika serwera
│   ├── server.js           # główny plik serwera
│   ├── data.db             # baza danych SQLite
│   ├── migrations/         # pliki SQL do tworzenia tabel
│   ├── seeds/              # dane przykładowe
│   ├── package.json        # konfiguracja zależności backendu
│
├── frontend/               # część kliencka aplikacji
│   ├── index.html          # główny plik interfejsu
│   ├── style.css           # arkusz stylów
│   ├── app.js              # logika frontendu
│
├── .gitignore              # plik ignorowanych elementów
├── README.md               # dokumentacja projektu
└── render.yaml             # konfiguracja wdrożenia

Instalacja i uruchomienie lokalne

Otwórz terminal i przejdź do folderu backend

cd backend


Zainstaluj zależności:

npm install


Uruchom serwer:

node server.js


Otwórz w przeglądarce:

http://localhost:3000

Opis działania

Po uruchomieniu aplikacja automatycznie tworzy bazę danych SQLite oraz tabelę books (jeśli nie istnieje).
Dane książek można dodawać, edytować, usuwać i przeglądać bezpośrednio przez interfejs webowy.
Całość działa lokalnie lub na hostingu Render.

Autor

Aliaksandra Bryshten
Numer indeksu: 69000
Uniwersytet Vistula
