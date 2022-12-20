#!/bin/bash

for i in {0..23}
do
	cat $1 | egrep "\S{10},$i," > $i.csv
done
