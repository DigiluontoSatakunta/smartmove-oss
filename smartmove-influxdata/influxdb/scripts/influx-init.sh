#!/bin/sh
set -e

influx user create \
  --name ${INFLUXDB_USER} \
  --password ${INFLUXDB_USER_PASSWORD}

influx auth create \
  --user ${INFLUXDB_USER} \
  --description "telegraf user token" \
  --read-buckets \
  --write-buckets \
  --read-telegrafs \
  --write-telegrafs

# influx bucket create \
#   --name counter \
#   --org "${DOCKER_INFLUXDB_INIT_ORG}" \
#   --retention 0

# influx bucket create \
#   --name kahvihuone \
#   --org "${DOCKER_INFLUXDB_INIT_ORG}" \
#   --retention 0

