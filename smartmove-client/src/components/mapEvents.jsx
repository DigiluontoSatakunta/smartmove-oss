import {useState} from "react";
import {useMapEvents} from "react-leaflet";

export const MapEvents = ({
  setActiveSite,
  setWeatherCoords,
  setZoomLevel,
  children,
}) => {
  const [locationfound, setLocationfound] = useState(false);

  const map = useMapEvents({
    click: () => {
      setWeatherCoords(null);
      if (!locationfound) map.locate();
    },
    locationfound: location => {
      setLocationfound(true);
      map.flyTo(location.latlng, 12);
    },
    zoomend: () => {
      setZoomLevel(map.getZoom());
    },
  });

  return <>{children}</>;
};
