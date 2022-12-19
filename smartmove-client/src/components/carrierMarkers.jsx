import {useMemo} from "react";
import {getCenter} from "geolib";
import {Marker, Tooltip} from "react-leaflet";

import styles from "../../styles/Marker.module.css";

import carrierAreas from "./carrier/satakunta_area.json";

const LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: "",
    iconSize: [16, 16],
    shadowSize: [0, 0],
    iconAnchor: [16, 16],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
  },
});

const gridAreaIcon = new LeafIcon({
  iconUrl: "radar.webp",
  className: styles.gridAreaMarker,
});

const gridAreaActiveIcon = new LeafIcon({
  iconUrl: "radar.webp",
  className: styles.activeMarker,
});

const CarrierMarkers = ({activeSite, setActiveSite, activeAreas}) => {
  const sites = useMemo(() => carrierAreas.features, []);

  const ActiveMarker = ({site, setActiveSite, activeAreas}) => {
    if (activeAreas.length > 0 && !activeAreas.includes(site.id + ""))
      return null;

    const handleClick = () => setActiveSite(null);

    const polygon = site?.geometry?.coordinates[0].map(c => ({
      latitude: c[1],
      longitude: c[0],
    }));

    const {latitude, longitude} = getCenter(polygon);

    return (
      <Marker
        position={[latitude, longitude]}
        icon={gridAreaActiveIcon}
        eventHandlers={{click: () => handleClick()}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.name || site?.id}
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({site, setActiveSite, activeAreas}) => {
    if (activeAreas.length > 0 && !activeAreas.includes(site.id + ""))
      return null;

    const handleClick = site => setActiveSite(site);

    const polygon = site?.geometry?.coordinates[0].map(c => ({
      latitude: c[1],
      longitude: c[0],
    }));

    const {latitude, longitude} = getCenter(polygon);

    return (
      <Marker
        position={[latitude, longitude]}
        icon={gridAreaIcon}
        eventHandlers={{click: () => handleClick(site)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.name || site?.id}
        </Tooltip>
      </Marker>
    );
  };

  const listMarkers = sites?.map(site => {
    return activeSite && activeSite?.id === site?.id ? (
      <ActiveMarker
        key={site?.id}
        site={site}
        setActiveSite={setActiveSite}
        activeAreas={activeAreas}
      />
    ) : (
      <PassiveMarker
        key={site.id}
        site={site}
        setActiveSite={setActiveSite}
        activeAreas={activeAreas}
      />
    );
  });

  return <>{sites ? listMarkers : null}</>;
};

export default CarrierMarkers;
