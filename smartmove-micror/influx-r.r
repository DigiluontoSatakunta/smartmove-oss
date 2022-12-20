#!/usr/bin/env Rscript

# README
# Remember to install the library!
# install.packages("influxdbclient")
#
# See also: https://github.com/influxdata/influxdb-client-r
# See also: https://thenewstack.io/getting-started-with-r-and-influxdb/
#

## import the client library
library(influxdbclient)
# parameters needed to make connection to Database
config.url = "https://influx.example.org"
config.token = "tokentokentoken" #SmartMove Client READ-ONLY TOKEN
config.org = "Tampere University"
config.bucket = "operaattori"
## make connection to the influxDB bucket
if(exists("client") != TRUE){
	client <- InfluxDBClient$new(url = config.url,
								token = config.token,
								org = config.org)
}

# Probably quite constant Variables
const.date_begin = "2019-01-01T00:00:00+00:00"
const.date_end = "2022-09-01T00:00:00+00:00"

# Constants
WEEK_DAYS=c("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
MONTHS=c("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
YEARS=c("2019", "2020", "2021", "2022")

helper.str.sanitize <- function(str) {
	paste('"', str, '"', sep="")
}

helper.dataframe.getData <- function(queryData, colname) {
	queryData[[1]][[colname]]
}

helper.dataframe.combiner <- function(vec1, vec2, colnames) {
	if(is.null(vec1)){
		vec1 = rep(0, length(vec2))
	} else if(is.null(vec2)){
		vec2 = rep(0, length(vec1))
	}
	df = data.frame(a=vec1, b=vec2, stringsAsFactors = TRUE)
	colnames(df) <- colnames
	return(df)
}

# accepts [h]our, [d]ay, [j] decimal day, [w]eek, [mo]nth, [y]ear
helper.timeranger <- function(x, timeRange) {
	retval = NULL
	if (grepl("d", timeRange)) {
		data = strftime(x, "%a") # "Mon", "Tue", "Wed", ...
		retval = factor(data, levels=WEEK_DAYS)
	} else if (grepl("j", timeRange)) {
		data = strftime(x, "%j") # Day of year as decimal number (001–366)
		retval = factor(data)
	} else if (grepl("w", timeRange)) {
		data = strftime(x, "%V") # Week of the year as decimal number (01–53) as defined in ISO 8601.
		retval = factor(data)
	} else if (grepl("mo", timeRange)) {
		data = strftime(x, "%b") # "Jan", "Feb", "Mar", ...
		retval = factor(data, levels=MONTHS)
	} else if (grepl("y", timeRange)) {
		data = strftime(x, "%Y")
		retval = factor(data, levels=YEARS)
	} else {
		#otherwise, treat as hourly data
		data = strftime(x, "%H")
		retval = factor(data)
	}
	return(retval)
}

helper.hasFactorData <- function(dataframe) {
	hasFactor = FALSE
	for(frame in dataframe){
		if(class(frame) == "factor"){
			hasFactor = TRUE
		}
	}
	return(hasFactor)
}

helper.plotter <- function(listOfFrames, cols = 2, rows = 1,
													 title.area_code, title.time_window, title.time_range,
													 plotFile = NULL) {
	if(is.null(plotFile) != TRUE){
		png(paste("/tmp/", plotFile, sep=""), width=1600, height=1200, res=150)
	}
	old.par <- par(mfrow=c(rows, cols)) # store and change the plot-view

	tryCatch(
		expr = {
			for(dataframe in listOfFrames) {
				if(is.null(dataframe)) {
					plot(0,0)
					mtext("Dataset was empty!", side = 3)
				} else if(helper.hasFactorData(dataframe)) {
					boxplot(dataframe[[1]] ~ dataframe[[2]],
									ylab=names(dataframe)[1], xlab=paste(names(dataframe)[2], helper.str.sanitize(title.time_range)))
				} else {
					plot(dataframe)
				}
				title(main = paste("Alue:", title.area_code, "window:", title.time_window, "\nX:", names(dataframe)[1], "Y:", names(dataframe)[2]),
							sub = paste("from:", substr(x=const.date_begin, start=1, stop=19), "to:", substr(x=const.date_end, start=1, stop=19)))
			}
		},
		finally = {
			if(is.null(plotFile) != TRUE){
				dev.off()
			}
			#disabled because it spawns extraneous Rplots.pdf #par(old.par) # retains the original plot configuration
		}
	)
}

## InfluxDB query for operaattori data (Measurement: peopleCount)
smrt.fluxQuery.operaattori <-
		function(v.AreaCode, v.BeginDate, v.EndDate, v.Window,
						 columnName = '"count"', method = 'mean') {
	fluxQuery = paste(
		'option location = {zone: "Europe/Helsinki"}',
		'from(bucket: ', helper.str.sanitize(config.bucket), ')',
		'  |> range(start: time(v: ', v.BeginDate, '), stop: time(v: ', v.EndDate, '))',
		'  |> filter(fn: (r) => r["_measurement"] == "peopleCount")',
		'  |> filter(fn: (r) => r["area_code"] == ', helper.str.sanitize(v.AreaCode), ')',
		'  |> aggregateWindow(offset: -1s, every: duration(v: ', v.Window, '), fn: ', method, ' )',
		'  |> keep(columns: ["_value", "_time"])',
		'  |> rename(columns: { _value: ', helper.str.sanitize(columnName),' })')
		#print(fluxQuery)
	client$query(fluxQuery, POSIXctCol = NULL)
}

## InfluxDB query for weather data (Measurement: weather)
# columnName can be one of the following:
# 	air_temperature
# 	cloud_amount
# 	dew-point_temperature
# 	gust_speed
# 	horizontal_visibility
# 	precipitation_amount
# 	precipitation_intensity
# 	pressure
# 	relative_humidity
# 	snow_depth
# 	wind_direction
# 	wind_speed
smrt.fluxQuery.weather <-
		function(v.AreaCode, v.BeginDate, v.EndDate, v.Window,
						 columnName, method = 'mean') {
	fluxQuery = paste(
		'import "regexp"',
		'regex = regexp.compile(v: string(v: ', v.AreaCode, '))',
		'option location = {zone: "Europe/Helsinki"}',
		'from(bucket: ', helper.str.sanitize(config.bucket), ')',
		'  |> range(start: time(v: ', v.BeginDate, '), stop: time(v: ', v.EndDate, '))',
		'  |> filter(fn: (r) => r["_measurement"] == "weather")',
		'  |> filter(fn: (r) => r["area_code"] =~ regex)',
		'  |> filter(fn: (r) => r["_field"] == ', helper.str.sanitize(columnName), ' )',
		'  |> map(fn: (r) => ({ r with _value: float(v: r._value) }))',
		'  |> aggregateWindow(offset: -1s, every: duration(v: ', v.Window, '), fn: ', method, ' )',
		'  |> keep(columns: ["_value", "_time"])',
		'  |> rename(columns: { _value: ', helper.str.sanitize(columnName), ' })')
	#print(fluxQuery)
	client$query(fluxQuery, POSIXctCol = NULL)
}

smrt.fluxQuery <- 
		function(v.AreaCode, v.BeginDate, v.EndDate, v.Window,
					 columnName, method = 'mean') {
	if (grepl("count", columnName, fixed=TRUE)) {
		return(smrt.fluxQuery.operaattori(v.AreaCode, v.BeginDate, v.EndDate, v.Window, columnName, method))
	} else {
		return(smrt.fluxQuery.weather(v.AreaCode, v.BeginDate, v.EndDate, v.Window, columnName, method))
	}
}

main <- function(
			area_code,
			x_param = 'count',
			y_param = 'air_temperature',
			aggregate_window = '1d',
			range_window = aggregate_window,
			file = NULL
		){
	## query data from InfluxDB
	dataX <- smrt.fluxQuery(area_code, const.date_begin, const.date_end, aggregate_window, x_param)
	dataY <- smrt.fluxQuery(area_code, const.date_begin, const.date_end, aggregate_window, y_param)

	## extract dataframes from the queried data
	TimeRanges = helper.timeranger(helper.dataframe.getData(dataX, "_time"), range_window)
	X = helper.dataframe.getData(dataX, x_param)
	Y = helper.dataframe.getData(dataY, y_param)

	## prepare dataframes to be inspected/calculated/etc.
	df1 = helper.dataframe.combiner(X, Y,          colnames = c(x_param, y_param))
	df2 = NULL
	if (is.null(X) == FALSE){
		df2 = helper.dataframe.combiner(X, TimeRanges, colnames = c(x_param, "TimeRange"))
	}

	## plotting function
	listOfDataframes = list(df1, df2)
	helper.plotter(listOfDataframes,
								 title.area_code = area_code,
								 title.time_window = aggregate_window,
								 title.time_range = range_window,
								 plotFile = file)

}

#examples below:
#main(area_code = "3021", aggregate_window = "8h", range_window = "1h", y_param = "air_temperature", x_param = "count")
#main(area_code = "3021", aggregate_window = "1d", range_window = "d",  y_param = "air_temperature", x_param = "count")
#main(area_code = "3021", aggregate_window = "1d", range_window = "1w", y_param = "air_temperature", x_param = "count", file="aa.png") #saves file to /tmp/aa.png
#main(area_code = "3022", aggregate_window = "1d", range_window = "1d", y_param = "air_temperature", x_param = "count")
#main(area_code = "3022", aggregate_window = "1d", range_window = "1d", x_param = "air_temperature", y_param = "count")

args<-commandArgs(TRUE)
if(length(args) == 6){
	# usage example for cli invocation
	# $ ./influx-r.r 1d 1d count air_temperature 3021 aa.png
	# $ ./influx-r.r 1d 1d air_temperature count 3021 aa.png
	# $ ./influx-r.r 1d 1d precipitation_amount air_temperature 3022 aa.png
	main(aggregate_window = args[1],
			 range_window = args[2],
			 x_param = args[3],
			 y_param = args[4],
			 area_code = args[5],
			 file = args[6])
}
