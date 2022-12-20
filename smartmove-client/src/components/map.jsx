import {useState, useEffect, useCallback} from "react";
import dayjs from "dayjs";

import {MapContainer, TileLayer, LayerGroup} from "react-leaflet";
import "leaflet-defaulticon-compatibility";

import Sidebar from "./sidebar";
import VisibilityToggler from "./visibilityToggler";

import DoorMarker from "./doorMarker";
import MapMarkers from "./mapMarkers";
import SensorStations from "./sensorStations";
import WikipediaMarkers from "./wikipediaMarkers";
import FireplaceMarkers from "./fireplaceMarkers";

import SykeAreas from "./sykeAreas";
import CarrierDataAreas from "./carrierDataAreas";
import WeatherStations from "./weatherStations";

import MenuInPortal from "./menu";
import {MapEvents} from "./mapEvents";

import styles from "../../styles/Map.module.css";

const initContentTypes = [
  {type: "Site", visible: false, label: "Metsähallitus"},
  {type: "SensorStation", visible: false, label: "Digitraffic"},
  {type: "Wikipedia", visible: false, label: "Wikipedia"},
  {type: "CarrierData", visible: true, label: "Operaattorialueet"},
  {type: "WeatherStation", visible: true, label: "Sääasemat"},
  {type: "Door", visible: false, label: "Hacklab"},
  {type: "Kota", visible: false, label: "Kota"},
  {type: "Autiotupa", visible: false, label: "Autiotupa"},
  {type: "Laavu", visible: false, label: "Laavu"},
  {type: "Nähtävyys", visible: false, label: "Nähtävyys"},
  {type: "Varaustupa", visible: false, label: "Varaustupa"},
  {type: "Ruokailukatos", visible: false, label: "Ruokailukatos"},
  {type: "Lintutorni", visible: false, label: "Lintutorni"},
  {type: "Lähde", visible: false, label: "Lähde"},
  {type: "Nuotiopaikka", visible: false, label: "Nuotiopaikka"},
  {type: "SYKE", visible: false, label: "SYKE-alueet"},
];

const Map = ({navBtnRef}) => {
  const [activeSite, setActiveSite] = useState(null);
  const [activeAreas, setActiveAreas] = useState([]);
  const [contentTypes, setContentTypes] = useState(initContentTypes);
  const [weatherCoords, setWeatherCoords] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  // for operator data and weather queries
  const [currentHour, setCurrentHour] = useState(-1);
  const [currentDate, setCurrentDate] = useState(dayjs("2020-06-01"));
  const [queryStartDate, setQueryStartDate] = useState("2020-06-01");
  const [queryStopDate, setQueryStopDate] = useState("2020-06-02");

  useEffect(() => {
    const currentDay = dayjs(currentDate).format("YYYY-MM-DD");
    const prevDay = dayjs(currentDate).subtract(1, "day").format("YYYY-MM-DD");
    const nextDay = dayjs(currentDate).add(1, "day").format("YYYY-MM-DD");

    if (currentHour === -1) {
      setQueryStartDate(`${currentDay}T00:00:00.000Z`);
      setQueryStopDate(`${currentDay}T23:59:59.999Z`);
    } else if (currentHour === 0) {
      setQueryStartDate(`${prevDay}T21:00:00.000Z`);
      setQueryStopDate(`${currentDay}T01:00:00.000Z`);
    } else if (currentHour === 1) {
      setQueryStartDate(`${prevDay}T22:00:00.000Z`);
      setQueryStopDate(`${currentDay}T02:00:00.000Z`);
    } else if (currentHour === 2) {
      setQueryStartDate(`${prevDay}T23:00:00.000Z`);
      setQueryStopDate(`${currentDay}T03:00:00.000Z`);
    } else if (currentHour >= 3 && currentHour <= 8) {
      setQueryStartDate(`${currentDay}T0${currentHour - 3}:00:00.000Z`);
      setQueryStopDate(`${currentDay}T0${currentHour + 1}:00:00.000Z`);
    } else if (currentHour >= 9 && currentHour <= 22) {
      const padding = currentHour < 13 ? "0" : "";
      setQueryStartDate(
        `${currentDay}T${padding}${currentHour - 3}:00:00.000Z`
      );
      setQueryStopDate(`${currentDay}T${currentHour + 1}:00:00.000Z`);
    } else if (currentHour === 23) {
      setQueryStartDate(`${currentDay}T${currentHour - 3}:00:00.000Z`);
      setQueryStopDate(`${nextDay}T00:00:00.000Z`);
    }
  }, [currentHour, currentDate]);

  const showContent = useCallback(
    type =>
      contentTypes.find(contentType => contentType.type === type)?.visible ||
      false,
    [contentTypes]
  );

  const checkSiteType = useCallback(async () => {
    if (activeSite.__typename === "Fireplace" && !weatherCoords?.length) {
      setWeatherCoords([activeSite.coordinates[0], activeSite.coordinates[1]]);
    }
    if (
      activeSite.__typename === "DigitrafficTmsStationsMetaData" &&
      !weatherCoords?.length
    ) {
      setWeatherCoords([
        activeSite.geometry.coordinates[1],
        activeSite.geometry.coordinates[0],
      ]);
    }
    if (activeSite.__typename === "Site" && !weatherCoords?.length) {
      setWeatherCoords([activeSite.latitude, activeSite.longitude]);
    }
    if (
      activeSite.__typename === "WikipediaGeoSearchResultGeosearch" &&
      !weatherCoords?.length
    ) {
      setWeatherCoords([activeSite.lat, activeSite.lon]);
    }
  }, [activeSite, weatherCoords]);

  useEffect(() => {
    if (activeSite && !weatherCoords?.length) checkSiteType();
  }, [checkSiteType, activeSite, weatherCoords]);

  return (
    <>
      <MapContainer
        center={[61.5, 23]}
        zoom={8}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        attributionControl={true}
        zoomControl={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents
          setActiveSite={setActiveSite}
          setWeatherCoords={setWeatherCoords}
          setZoomLevel={setZoomLevel}
        />

        {showContent("Site") && (
          <LayerGroup>
            <MapMarkers activeSite={activeSite} setActiveSite={setActiveSite} />
          </LayerGroup>
        )}

        {showContent("Door") && (
          <LayerGroup>
            <DoorMarker activeSite={activeSite} setActiveSite={setActiveSite} />
          </LayerGroup>
        )}

        <LayerGroup>
          <FireplaceMarkers
            activeSite={activeSite}
            setActiveSite={setActiveSite}
            showContent={showContent}
          />
        </LayerGroup>

        {showContent("Wikipedia") && (
          <LayerGroup>
            <WikipediaMarkers
              activeSite={activeSite}
              setActiveSite={setActiveSite}
            />
          </LayerGroup>
        )}

        {showContent("SensorStation") && (
          <LayerGroup>
            <SensorStations
              activeSite={activeSite}
              setActiveSite={setActiveSite}
              zoomlevel={zoomLevel}
            />
          </LayerGroup>
        )}

        {showContent("CarrierData") && (
          <LayerGroup>
            <CarrierDataAreas
              activeAreas={activeAreas}
              activeSite={activeSite}
              setActiveSite={setActiveSite}
              queryStartDate={queryStartDate}
              queryStopDate={queryStopDate}
            />
          </LayerGroup>
        )}

        {showContent("WeatherStation") && (
          <LayerGroup>
            <WeatherStations
              activeSite={activeSite}
              setActiveSite={setActiveSite}
            />
          </LayerGroup>
        )}

        {showContent("SYKE") && (
          <LayerGroup>
            <SykeAreas activeSite={activeSite} setActiveSite={setActiveSite} />
          </LayerGroup>
        )}
      </MapContainer>

      <Sidebar
        activeSite={activeSite}
        setActiveSite={setActiveSite}
        weatherCoords={weatherCoords}
        queryStartDate={queryStartDate}
        queryStopDate={queryStopDate}
        currentHour={currentHour}
      />

      <VisibilityToggler
        contentTypes={contentTypes}
        setContentTypes={setContentTypes}
        activeAreas={activeAreas}
        setActiveAreas={setActiveAreas}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        currentHour={currentHour}
        setCurrentHour={setCurrentHour}
      />

      <MenuInPortal setActiveSite={setActiveSite} navBtnRef={navBtnRef} />
    </>
  );
};

export default Map;
