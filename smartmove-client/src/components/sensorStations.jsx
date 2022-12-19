import {Marker, Tooltip} from "react-leaflet";

import styles from "../../styles/Marker.module.css";

import {useStations} from "../hooks/stations";
import {useAllLamSensor} from "../hooks/sensors";

var LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: "",
    iconSize: [32, 32],
    shadowSize: [0, 0],
    iconAnchor: [32, 32],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
  },
});

var smoothTraffic = new LeafIcon({
  iconUrl: "radar.webp",
  className: styles.smoothTraffic,
});

var congestedTraffic = new LeafIcon({
  iconUrl: "radar.webp",
  className: styles.congestedTraffic,
});
var stoppedTraffic = new LeafIcon({
  iconUrl: "radar.webp",
  className: styles.stoppedTraffic,
});

var trafficIcon = new LeafIcon({
  iconUrl: "radar.webp",
  className: styles.sensorMarker,
});

const SensorStations = ({activeSite, setActiveSite, zoomLevel}) => {
  const {sites} = useStations();

  const handleClick = () => setActiveSite(null);

  const ActiveMarker = ({site}) => {
    return (
      <Marker
        position={[
          site?.geometry?.coordinates[1],
          site?.geometry?.coordinates[0],
        ]}
        icon={trafficIcon}
        eventHandlers={{click: () => handleClick()}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.properties?.names?.fi}
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({site, setActiveSite}) => {
    const handleClick = site =>
      setActiveSite({...site, name: site?.properties?.names?.fi});

    return (
      <Marker
        position={[
          site?.geometry?.coordinates[1],
          site?.geometry?.coordinates[0],
        ]}
        icon={trafficIcon}
        eventHandlers={{click: () => handleClick(site)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          Liikenne {site?.properties?.names?.fi}
        </Tooltip>
      </Marker>
    );
  };
  const stationMarkers = sites?.map(site => {
    return activeSite && site.id === activeSite.id ? (
      <ActiveMarker key={site.id} site={site} setActiveSite={setActiveSite} />
    ) : (
      <PassiveMarker key={site.id} site={site} setActiveSite={setActiveSite} />
    );
  });

  return (
    <>
      {sites && zoomLevel >= 10 ? (
        <TrafficStatusMarkers sites={sites} setActiveSite={setActiveSite} />
      ) : sites ? (
        stationMarkers
      ) : null}
    </>
  );
};

const TrafficStatusMarkers = ({sites, setActiveSite}) => {
  const {allSensors} = useAllLamSensor();

  const handleClick = site =>
    setActiveSite({...site, name: site?.properties?.names?.fi});

  const results = allSensors?.tmsStations?.filter(({id: id1}) =>
    sites?.some(({id: id2}) => parseInt(id2) === parseInt(id1))
  );

  return !results
    ? null
    : results?.map(sensor => {
        return sites?.map(site => {
          if (
            sensor?.sensorValues?.find(
              value =>
                value.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1_VVAPAAS1"
            )
          ) {
            return (
              <Marker
                key={site.id}
                position={[
                  site?.geometry?.coordinates[1],
                  site?.geometry?.coordinates[0],
                ]}
                icon={
                  sensor?.sensorValues?.find(value => value?.sensorValue >= 90)
                    ? smoothTraffic
                    : sensor?.sensorValues.find(
                        sensor =>
                          sensor?.sensorValue >= 25 && sensor?.sensorValue < 90
                      )
                    ? congestedTraffic
                    : sensor?.sensorValues?.find(
                        sensor?.sensorValue <= 0 && sensor?.sensorValue < 25
                      )
                    ? stoppedTraffic
                    : null
                }
                eventHandlers={{click: () => handleClick(site)}}
              >
                <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
                  Liikenne {site?.properties?.names?.fi}
                </Tooltip>
              </Marker>
            );
          } else {
            return null;
          }
        });
      });
};

export default SensorStations;
