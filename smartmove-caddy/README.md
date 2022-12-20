# Caddy 2 -proxy

Käytössä mm. testi- ja tuotantopalvelimella.

Vastaa reitityksestä palveluihin ja sertifikaattien hallinnoinnista https-yhteyksiä varten.

## Tiedostot

- `Caddyfile.sample`: Caddyä koskevat määritykset seuraavia palveluita varten
  - `smartmove-backend`
  - `smartmove-client`
  - `smartmove-micror`

Huom! `smartmove-influxdata` määrittelee Caddy:n itsenäisenä palveluna
