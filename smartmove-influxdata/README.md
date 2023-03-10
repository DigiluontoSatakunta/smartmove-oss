# Smartmove Influxdata Docker Stack

InfluxDB, Telegraf, Chronograf &amp; Kapacitor

## Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## Installation

Clone the repository:

```bash
git clone
```

## Docker Volumes (required)

The following volumes are used by the containers:

- `influxdb-storage`: InfluxDB data
- `chronograf-storage`: Chronograf data
- `kapacitor-storage`: Kapacitor data

## Usage

Create the volumes:

```bash
docker volume create influxdb-storage
docker volume create chronograf-storage
docker volume create kapacitor-storage
```

Start the containers:

```bash

docker-compose up -d

```

(Re)Load telegraf configuration:

```bash

docker-compose exec telegraf telegraf --config /etc/telegraf/telegraf.conf --test

docker-compose exec telegraf telegraf update --config /etc/telegraf/telegraf.conf

```

Restart the containers:

```bash

docker-compose restart

```

Stop the containers:

```bash

docker-compose stop

```

## Configuration

### InfluxDB

The InfluxDB container is configured to use the following environment variables:

- `INFLUXDB_ADMIN_USER`: InfluxDB admin user (default: `admin`)
- `INFLUXDB_ADMIN_PASSWORD`: InfluxDB admin password (default: `admin`)
- `INFLUXDB_DB`: InfluxDB database (default: `telegraf`)
- `INFLUXDB_USER`: InfluxDB user (default: `telegraf`)
- `INFLUXDB_USER_PASSWORD`: InfluxDB user password (default: `telegraf`)

### Telegraf

The Telegraf container is configured to use the following environment variables:

- `INFLUXDB_URL`: InfluxDB URL (default: `http://influxdb:8086`)
- `INFLUXDB_BUCKET`: InfluxDB bucket (default: `telegraf`)
- `INFLUXDB_ORGANIZATION`: InfluxDB organization (default: `Tampere University`)
- `INLFUXDB_TOKEN`: InfluxDB token (default: `telegraf`)

### Chronograf

The Chronograf container is configured to use the following environment variables:

- `CHRONOGRAF_ADMIN_USER`: Chronograf admin user (default: `admin`)
- `CHRONOGRAF_ADMIN_PASSWORD`: Chronograf admin password (default: `admin`)

## Usage

### InfluxDB

The InfluxDB container exposes the following ports:

- `8086`: HTTP API port
- `8088`: HTTPS API port
- `8089`: RPC API port

### Telegraf

The Telegraf container exposes the following ports:

- `8092`: RPC API port

### Chronograf

The Chronograf container exposes the following ports:

- `8888`: HTTP API port

### Kapacitor

The Kapacitor container exposes the following ports:

- `9092`: HTTP API port

## License

MIT License (MIT) - see the [LICENSE](LICENSE) file for details

## Author Information

This Docker stack was created in 2022 by [Smartmove](https://www.smartmove.io/).

## References

- [InfluxDB](https://www.influxdata.com/time-series-platform/influxdb/)
- [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/)
- [Chronograf](https://www.influxdata.com/time-series-platform/chronograf/)
- [Kapacitor](https://www.influxdata.com/time-series-platform/kapacitor/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
