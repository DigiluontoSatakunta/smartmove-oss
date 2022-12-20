#!/bin/bash
AREACODE=$2

#example: $ ./writer2.sh trips_2019 2830

echo "Writing data set $AREACODE@$1"
grep ",$AREACODE," $1 > partial.csv
wc partial.csv
influx write -b operaattori --format csv -f header.csv -f partial.csv
echo "Finished data set $AREACODE@$1"
