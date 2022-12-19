# Caddy 2 -proxy

Käytössä testi- ja tuotantopalvelimella.

Vastaa reitityksestä palveluihin ja sertifikaattien hallinnoinnista https-yhteyksiä varten.

## Tiedostot

### Tuotantopalvelin

- Caddyfile - Caddyä koskevat määritykset tuotantopalvelinta varten.

### Testipalvelin

- Caddyfile_testipalvelin - Caddyä koskevat määritykset testipalvelinta varten.

Testipalvelimella ympäristöä ajetaan docker-compose tiedostolla, jossa Caddyfile asetetaan suoraan valmiiseen Caddy2 konttiin, joten Dockerfileä ei tarvita.
