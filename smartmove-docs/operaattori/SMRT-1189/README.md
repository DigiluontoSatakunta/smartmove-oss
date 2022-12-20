# Instructions (sort of)

## Creating header files

### Create empty files
Creates `headers` file for each station
- `cat header_files.txt | sed 's/_01012019-20102022//' | sed 's/^/headers_/' | xargs touch`

### Constants for stations
Appears in each `headers` file for tag `station`
```
#constant tag,station,Kankaanpää_Niinisalo_lentokenttä
#constant tag,station,Karvia_Alkkia
#constant tag,station,Kokemäki_Tulkkila
#constant tag,station,Kristiinankaupunki_Majakka
#constant tag,station,Pori_lentoasema
#constant tag,station,Pori_rautatieasema
#constant tag,station,Pori_Tahkoluoto_satama
#constant tag,station,Rauma_Kylmäpihlaja
#constant tag,station,Rauma_Pyynpää
```

### Constants for area codes
Appears in each `headers` file for tag `area_code`
```
#constant tag,area_code,"AREACODE#1 AREACODE#2"
```

#### Resolving area codes
Various scripts to output `area_code` for each station

Useful env variables
```
export AREA=Kankaanpää_Niinisalo_lentokenttä
export AREA=Karvia_Alkkia
export AREA=Kokemäki_Tulkkila
export AREA=Kristiinankaupunki_Majakka
export AREA=Pori_lentoasema
export AREA=Pori_rautatieasema
export AREA=Pori_Tahkoluoto_satama
export AREA=Rauma_Kylmäpihlaja
export AREA=Rauma_Pyynpää
```

Printing area codes
- `echo $AREA && cat area_code_fmi_mapping_mod.csv | grep $AREA | awk -F "," '{print $1}' |xargs echo`


## Docker cp & influx write

### On host
PWD should be `operaattori/SMRT-1189` (i.e., this directory)
1. `docker cp . smartmove-influxdata_influxdb_1:/tmp/SMRT-1189`
2. `docker exec -it smartmove-influxdata_influxdb_1 /bin/bash`

### In container
1. `cd /tmp/SMRT-1189`
2. `influx write -b operaattori --format csv -f header_template.csv -f headers_Karvia_Alkkia.csv -f data/Karvia_Alkkia_01012019-20102022.csv`

Helper script to write data to influx
```
#!/bin/bash
influx write -b operaattori --format csv -f $1 -f $2 -f $3
```
