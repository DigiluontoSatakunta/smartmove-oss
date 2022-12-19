import {Marker, Tooltip} from "react-leaflet";

import {useFireplaces} from "../hooks/fireplaces";

import styles from "../../styles/Marker.module.css";

const LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: "",
    iconSize: [32, 32],
    shadowSize: [0, 0],
    iconAnchor: [32, 32],
    shadowAnchor: [0, 0],
    popupAnchor: [0, 0],
  },
});

const fireplaceIcon = new LeafIcon({
  iconUrl: "fireplace.svg",
  className: styles.fireplaceMarker,
});

const fireplaceActiveIcon = new LeafIcon({
  iconUrl: "fireplace.svg",
  className: styles.activeMarker,
});

const hutIcon = new LeafIcon({
  iconUrl: "hut.svg",
  className: styles.hutMarker,
});

const hutActiveIcon = new LeafIcon({
  iconUrl: "hut.svg",
  className: styles.activeMarker,
});

const sightIcon = new LeafIcon({
  iconUrl: "sight.svg",
  className: styles.sightMarker,
});

const sightActiveIcon = new LeafIcon({
  iconUrl: "sight.svg",
  className: styles.activeMarker,
});

const natureAttractionIcon = new LeafIcon({
  iconUrl: "nature_attraction.svg",
  className: styles.natureAttractionMarker,
});

const natureAttractionActiveIcon = new LeafIcon({
  iconUrl: "nature_attraction.svg",
  className: styles.activeMarker,
});

const campIcon = new LeafIcon({
  iconUrl: "camp.svg",
  className: styles.campMarker,
});

const campActiveIcon = new LeafIcon({
  iconUrl: "camp.svg",
  className: styles.activeMarker,
});

const setIcon = site => {
  switch (site?.type) {
    case "Kota":
      return campIcon;
    case "Autiotupa":
      return hutIcon;
    case "Laavu":
      return campIcon;
    case "Nähtävyys":
      return sightIcon;
    case "Varaustupa":
      return hutIcon;
    case "Ruokailukatos":
      return campIcon;
    case "Lintutorni":
      return natureAttractionIcon;
    case "Lähde":
      return natureAttractionIcon;
    case "Nuotiopaikka":
      return fireplaceIcon;
    default:
      return fireplaceIcon;
  }
};

const setActiveIcon = site => {
  switch (site?.type) {
    case "Kota":
      return campActiveIcon;
    case "Autiotupa":
      return hutActiveIcon;
    case "Laavu":
      return campActiveIcon;
    case "Nähtävyys":
      return sightActiveIcon;
    case "Varaustupa":
      return hutActiveIcon;
    case "Ruokailukatos":
      return campActiveIcon;
    case "Lintutorni":
      return natureAttractionActiveIcon;
    case "Lähde":
      return natureAttractionActiveIcon;
    case "Nuotiopaikka":
      return fireplaceActiveIcon;
    default:
      return fireplaceActiveIcon;
  }
};

const FireplaceMarkers = ({activeSite, setActiveSite, showContent}) => {
  const {sites} = useFireplaces();

  const handleClick = () => setActiveSite(null);

  const ActiveMarker = ({site}) => {
    return (
      <Marker
        position={[site?.coordinates[0], site?.coordinates[1]]}
        icon={setActiveIcon(site)}
        eventHandlers={{click: () => handleClick()}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.name}
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({site, setActiveSite}) => {
    const handleClick = site => setActiveSite(site);

    return (
      <Marker
        position={[site?.coordinates[0], site?.coordinates[1]]}
        icon={setIcon(site)}
        eventHandlers={{click: () => handleClick(site)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          {site?.name}
        </Tooltip>
      </Marker>
    );
  };

  const listMarkers = sites?.map(site => {
    if (showContent(site.type)) {
      return activeSite && activeSite?.id === site?.id ? (
        <ActiveMarker
          key={site?.id}
          site={site}
          setActiveSite={setActiveSite}
        />
      ) : (
        <PassiveMarker
          key={site.id}
          site={site}
          setActiveSite={setActiveSite}
        />
      );
    }

    return null;
  });

  return <>{sites ? listMarkers : null}</>;
};

export default FireplaceMarkers;
