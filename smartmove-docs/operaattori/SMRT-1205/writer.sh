#!/bin/bash

influx write -b operaattori --format csv -f /tmp/SMRT-1205/headers.csv -f /tmp/SMRT-1205/trips_2019
influx write -b operaattori --format csv -f /tmp/SMRT-1205/headers.csv -f /tmp/SMRT-1205/trips_2020
influx write -b operaattori --format csv -f /tmp/SMRT-1205/headers.csv -f /tmp/SMRT-1205/trips_2021_2022
