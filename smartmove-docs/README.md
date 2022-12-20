# SmartMove

## Järjestelmäarkkitehtuuri

Järjestelmäarkkitehtuuri ja palvelut.

![Järjestelmäarkkitehtuuri](/out/documentation/infra/deployment/jarjestelmaarkkitehtuuri.png "Järjestelmäarkkitehtuuri")

---

## Palvelut

| Nimi       | Kuvaus                   | sisäinen portti | julkinen portti | Ficoloportti |
| ---------- | ------------------------ | --------------- | --------------- | ------------ |
| Caddy      | Proxy palveluiden edessä | None            | 80, 443         |              |
| Client App | Next.js (static build)   | None (Caddy)    | Caddy           |              |
| Server     | Node.js (Fastify)        | 4040            | Caddy (/api)    |              |
| Redis      | Välimuisti (DB)          | 6379            | None            |              |

### CI/CD putken palvelut (Jenkins)

| Koodi              | Nimi    | Kuvaus   | Huomio               |
| ------------------ | ------- | -------- | -------------------- |
| SMRT-BE-CADDY      | Caddy   |          |                      |
| SMRT-BE-BACKEND    | Server  |          |                      |
| SMRT-CL-PRODUCTION | App     | Tuotanto | origin/main          |
| SMRT-CL-TESTI      | App     | Testaus  | origin/development   |

## Ulkoiset palvelut

| Service name          | Description              | sisäinen portti | julkinen portti |
| --------------------- | ------------------------ | --------------- | --------------- |
| Instagram API         | Social media content API | N/A             | 443             |
| Wikipedia API         | Wikipedia GeoSearch API  | N/A             | 443             |
| Digitraffic API       | Traffic data API         | N/A             | 443             |
| Hacklab API           | Door activity API        | N/A             | 443             |
| Metsähallitus API     | Visitor data API         | N/A             | 443             |
| Ilmatieteenlaitos API | Weather data API         | N/A             | 443             |
| Telia API             | Mobile users API         | N/A             | 443             |

---

## Palveluiden kuvaukset

### Caddy

Caddy v2 toimii palveluiden edessä käsitellen ja ohjaten internetistä tulevat kutsut oikeille palveluille. Caddyyn on sisäänrakennettu sertifikaattien käsittely, joten ulkoista sertifikaattipalvelua ei tarvita.

### Client App

Next.js-sovellus palvelun käyttämiseksi (smartmove.digiluonto.fi). Keskeiset kirjastot: Next.js, Apollo Client, Material-UI, React Leaflet

### Server

Node.js:n päällä toimiva Fastify sovellus, jonka Mercurius-moduli tarjoaa GraphQL API -toteuksen. Toimii gatewayna tietolähteiden datan tarjoamiselle clientille.

### Redis

Tietokanta datan tallentamiseen.
