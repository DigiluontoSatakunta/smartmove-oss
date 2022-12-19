import {Marker, Tooltip} from "react-leaflet";

import {useWikipediaGeoSearch} from "../hooks/wikipedia";

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

var wikipediaIcon = new LeafIcon({
  iconUrl: "wikipedia.png",
  className: styles.wikipediaMarker,
});
var activeIcon = new LeafIcon({
  iconUrl: "wikipedia.png",
  className: styles.activeMarker,
});

const WikipediaMarkers = ({activeSite, setActiveSite}) => {
  const {sites} = useWikipediaGeoSearch();

  const handleClick = () => setActiveSite(null);

  const ActiveMarker = ({site}) => {
    return (
      <Marker
        position={[site?.lat, site?.lon]}
        icon={activeIcon}
        eventHandlers={{click: () => handleClick()}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.title}
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({site, setActiveSite}) => {
    const handleClick = site => {
      setActiveSite(site);
    };

    return (
      <Marker
        position={[site?.lat, site?.lon]}
        icon={wikipediaIcon}
        eventHandlers={{click: () => handleClick(site)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.title}
        </Tooltip>
      </Marker>
    );
  };

  const listMarkers = sites?.map(site => {
    return activeSite && activeSite?.id === site?.id ? (
      <ActiveMarker key={site.id} site={site} setActiveSite={setActiveSite} />
    ) : (
      <PassiveMarker key={site.id} site={site} setActiveSite={setActiveSite} />
    );
  });

  return <>{sites ? listMarkers : null}</>;
};

export default WikipediaMarkers;
