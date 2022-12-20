import { useEffect } from "react";
import { Marker, Tooltip } from "react-leaflet";

import { useSites } from "../hooks/sites";
import { useLoader } from "../hooks/loader";

import styles from "../../styles/Marker.module.css";

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

var hikingIcon = new LeafIcon({
  iconUrl: "hiking.webp",
  className: styles.hikingMarker,
});
var activeHikingIcon = new LeafIcon({
  iconUrl: "hiking.webp",
  className: styles.activeMarker,
});

const MapMarkers = ({ activeSite, setActiveSite }) => {
  const { sites, loading } = useSites();
  const { updateLoader } = useLoader();

  const handleClick = () => setActiveSite(null);

  useEffect(() => {
    updateLoader(loading ? true : false);
  }, [loading, updateLoader]);

  const ActiveMarker = ({ site }) => {
    return (
      <Marker
        position={[site?.latitude, site?.longitude]}
        icon={activeHikingIcon}
        eventHandlers={{ click: () => handleClick() }}
      >
        <Tooltip opacity={1} offset={L.point({ x: 0, y: -16 })}>
          {site?.name}
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({ site, setActiveSite }) => {
    const handleClick = site => setActiveSite(site);

    return (
      <Marker
        position={[site?.latitude, site?.longitude]}
        icon={hikingIcon}
        eventHandlers={{ click: () => handleClick(site) }}
      >
        <Tooltip opacity={1} offset={L.point({ x: 0, y: -16 })}>
          {site?.name}
        </Tooltip>
      </Marker>
    );
  };

  const listMarkers = sites
    ?.filter(site => site.visible && site.latitude > 0)
    .map(site => {
      return activeSite && activeSite?.id === site?.id ? (
        <ActiveMarker key={site.id} site={site} setActiveSite={setActiveSite} />
      ) : (
        <PassiveMarker
          key={site.id}
          site={site}
          setActiveSite={setActiveSite}
        />
      );
    });

  return <>{sites ? listMarkers : null}</>;
};

export default MapMarkers;
