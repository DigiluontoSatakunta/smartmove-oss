#!/bin/bash

for i in {0..23}
do
	echo "Writing data set $i"
	influx write -b operaattori --format csv -f headers_$i.csv -f $i.csv
	echo "Finished data set $i"
done
