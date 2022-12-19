import {useEffect} from "react";
import {Marker, Tooltip} from "react-leaflet";

import {useDoorLatest} from "../hooks/door";

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

var icon = new LeafIcon({
  iconUrl: "hacklab.webp",
  className: styles.doorMarker,
});

var activeIcon = new LeafIcon({
  iconUrl: "hacklab.webp",
  className: styles.activeMarker,
});

const rtf = new Intl.RelativeTimeFormat("fi", {
  localeMatcher: "best fit", // other values: "lookup"
  numeric: "always", // other values: "auto"
  style: "short", // other values: "short" or "narrow"
});

const relativeTime = date => {
  const now = new Date();
  const previous = new Date(date);
  const diff = previous.getTime() - now.getTime();

  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diff / 1000 / 60);
  const diffHours = Math.floor(diff / 1000 / 60 / 60);

  if (diffSeconds > -60) {
    return rtf.format(diffSeconds, "second");
  } else if (diffMinutes > -60) {
    return rtf.format(diffMinutes, "minute");
  } else if (diffHours > -24) {
    return rtf.format(diffHours, "hour");
  } else {
    return `${previous.toLocaleString()}`;
  }
};

const ToolTipMessage = ({result}) => {
  return (
    <>
      Ovi{" "}
      {result?.uplink_message?.decoded_payload?.DOOR_OPEN_STATUS
        ? "avautui"
        : "sulkeutui"}{" "}
      {relativeTime(result?.uplink_message?.received_at)}
      {result?.uplink_message?.decoded_payload?.LAST_DOOR_OPEN_DURATION > 0 && (
        <>
          ja oli auki{" "}
          {result?.uplink_message?.decoded_payload?.LAST_DOOR_OPEN_DURATION}{" "}
          sekuntia.
        </>
      )}
    </>
  );
};

export default function DoorMarker({activeSite, setActiveSite}) {
  const {result, loading} = useDoorLatest();

  const handleClick = () => setActiveSite(null);

  const ActiveMarker = ({latitude, longitude}) => {
    return (
      <Marker
        position={[latitude, longitude]}
        icon={activeIcon}
        eventHandlers={{click: () => handleClick()}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          <ToolTipMessage result={activeSite} />
        </Tooltip>
      </Marker>
    );
  };

  const PassiveMarker = ({latitude, longitude, result, setActiveSite}) => {
    const handleClick = result =>
      setActiveSite({...result, id: "door", name: "Tammen tila"});

    return (
      <Marker
        position={[latitude, longitude]}
        icon={icon}
        eventHandlers={{click: () => handleClick(result)}}
      >
        <Tooltip opacity={1} offset={L.point({x: 0, y: -16})}>
          <ToolTipMessage result={result} />
        </Tooltip>
      </Marker>
    );
  };

  if (loading || result === undefined) return null;

  const {latitude, longitude} = result?.uplink_message?.locations?.user;

  return activeSite?.__typename === "DoorResult" ? (
    <ActiveMarker
      latitude={latitude}
      longitude={longitude}
      setActiveSite={setActiveSite}
    />
  ) : (
    <PassiveMarker
      latitude={latitude}
      longitude={longitude}
      result={result}
      setActiveSite={setActiveSite}
    />
  );
}
