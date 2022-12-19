# SmartMove GraphQL API

## Run in Dev

`$ nodemon --inspect ./server.js 3000`

or

`$ nodemon server.js`

## Environment Variables

Stored in .env file in development mode.

List of environment variables with some default values:

- SMARTMOVE_HACKLAB_BASE_URL=your-hacklab-base-url
- SMARTMOVE_HACKLAB_API_AUTH_TOKEN=your-hacklab-api-auth-token
- SMARTMOVE_API_HOST=localhost
- SMARTMOVE_API_PLAYGROUND=1
- SMARTMOVE_API_PORT=4040
- SMARTMOVE_INSTAGRAM_USERNAME=your-instagram-username
- SMARTMOVE_INSTAGRAM_PASSWORD=your-instagram-password
- SMARTMOVE_REDIS=redis://<redishost>:<redisport>

## Eco Counter Documentation

- [docs](https://developers.eco-counter.com)

## Docker

### Käynnistys

`docker-compose up -d`

### Näytä kaikki logit

`docker-compose logs -f`

### Näytä yhden kontin logit

`docker-compose logs -f redis`

### Sammuta kontit

`docker-compose down`

## Muita hyödyllisiä Docker komentoja

### Näytä käynnissä olevat kontit

- `docker ps`

## GraphQL Queries

```
query WIKIPEDIA_GEOSEARCH_QUERY {
	wikipediaGeoSearch(gscoords: "61.48653963970941| 21.794178252948853", gsradius: 500, gslimit: 400 ) {
		query {
			geosearch {
				title
				pageid
				lat
				lon
				dist
				primary
				__typename
			}
		__typename
		}
	}
}
```

```
query WIKIPEDIA_PAGE_QUERY {
	wikipediaPage(pageid: 68060178) {
		  query {
				pages {
					 title
					 pageid
					 ns
					 images {
						title
					}
					 revisions {
						slots {
							main {
								contentmodel
								contentformat
								content
							}
							__typename
						}
					}
					 __typename
				}
			}
		  __typename
	}
}
```

```
query DIGITRAFFIC_SERSORS_METADATA {
	 digitrafficTmsSensorsMetaData {
		 dataUpdatedTime
		 dataLastCheckedTime
		 roadStationSensors {
			 id
			 name
			 shortName
			 unit
			 accuracy
			 sensorValueDescriptions {
				descriptionFi
				sensorValue
				__typename
			}
			 descriptions
			 presentationNames
			 vehicleClasses
			 lane
			 direction
			 description
			 __typename
		}
		__typename
	}
}
```

```
query DIGITRAFFIC_STATIONS_METADATA {
	 digitrafficTmsStationsMetaData {
		 type
		 dateUpdatedTime
		 dataLastCheckedTime
		 features {
			 id
			 name
			 description
			 type
			 geometry {
				type
				coordinates
				__typename
			}
			 properties {
				 roadStationId
				 tmsNumber
				 name
				 collectionInterval
				 collectionStatus
				 municipality
				 municipalityCode
				 province
				 provinceCode
				 names {
            		fi
          		}
				 roadAddress {
					 roadNumber
					 roadSection
					 __typename
				}
				 startTime
				 state
				 purpose
				 coordinatesETRS89
				 freeFlowSpeed1
				 freeFlowSpeed2
				 __typename
			}
			 __typename
		}
		 __typename
	}
}
```

```
query DIGITRAFFIC_STATION {
	 digitrafficTmsStation(number: 20002) {
		 __typename
	}
}
```

```
query GET_FAVORITES {
	getFavorites {
		id
		uid
		type
		timestamp
		__typename
	}
}
```

```
mutation ADD_FAVORITE($id: String!, $uid: String!, $timestamp: String!, $type: String! ) {
	addFavorite(id: $id, uid: $uid, timestamp: $timestamp, type: $type) {
		id
		uid
		timestamp
		type
		__typename
	}
}
```

```
mutation REMOVE_FAVORITE($id: String!, $uid: String!, $type: String! ) {
	removeFavorite(id: $id, uid: $uid, type: $type) {
		id
		uid
		timestamp
		type
		__typename
	}
}
```

```
query GET_WEATHER_STATION_BY_COORDS {
	openWeatherMapLocationsByCoordinates(lat: 62, lon: 21, limit: 10) {
		name
		lat
		lon
		country
		local_names {
			en
			fi
			__typename
		}
		__typename
	}
}
```

```
query GET_FIREPLACES {
	fireplaces(type: "laavu", county: "Satakunta") {
		  id
			name
			type
			county
			coordinates
		}
}
```
