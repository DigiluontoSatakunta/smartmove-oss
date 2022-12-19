import {useMemo} from "react";
import {max, min} from "mathjs";
import {Polygon} from "react-leaflet";

import carrierAreas from "./carrier/satakunta_area.json";
import {useOperatorHeatmap} from "../hooks/operator";

const CarrierDataAreas = ({
  activeAreas,
  activeSite,
  setActiveSite,
  queryStartDate,
  queryStopDate,
}) => {
  const {data} = useOperatorHeatmap({
    start: queryStartDate,
    stop: queryStopDate,
  });

  const features = useMemo(() => carrierAreas?.features, []);

  const dictionary = useMemo(() => {
    if (data?.length > 0) {
      const maxValue = max(data?.map(d => d.value));
      const minValue = min(data?.map(d => d.value));
      const values = Array.from({length: 150}, (_, i) =>
        Math.round((maxValue - minValue) * (i / 150) + minValue)
      );
      return values.map((v, i) => ({value: v, hue: 200 + i}));
    }
  }, [data]);

  const areas = useMemo(() => {
    if (activeAreas.length > 0) {
      const filteredFeatures = features.filter(area =>
        activeAreas?.includes(area.id + "")
      );
      return {...areas, features: filteredFeatures};
    } else {
      return carrierAreas;
    }
  }, [activeAreas, features]);

  const heatmap = useMemo(() => {
    if (data && features && dictionary) {
      const mergedFeatures = features.map(feature => {
        const value = data.find(d => d.areaCode === feature.id)?.value || 0;
        const hue = dictionary.find(d => d.value >= value)?.hue || 0;

        return {
          ...feature,
          value,
          hue: activeSite?.id === feature.id ? 0 : hue,
        };
      });

      if (activeAreas.length > 0) {
        const filteredFeatures = mergedFeatures.filter(feature =>
          activeAreas?.includes(feature.id + "")
        );
        return filteredFeatures;
      } else {
        return mergedFeatures;
      }
    }
  }, [data, features, dictionary, activeAreas, activeSite]);

  if (!heatmap) return null;

  return (
    <>
      {heatmap?.map(feature => (
        <CarrierPolygon
          key={feature.id}
          feature={feature}
          setActiveSite={setActiveSite}
        />
      ))}
    </>
  );
};

const CarrierPolygon = ({feature, setActiveSite}) => {
  const {geometry, hue} = feature;
  const coordinates = geometry.coordinates[0];

  const pathOptions = {
    weight: 1,
    opacity: 1,
    fillOpacity: 0.3,
    color: `hsl(${hue}, 100%, 50%)`,
  };
  const positions = coordinates?.map(coord => [coord[1], coord[0]]);

  const handleClick = () => setActiveSite(feature);

  return (
    <Polygon
      pathOptions={pathOptions}
      positions={positions}
      style={{userSelect: "none"}}
      eventHandlers={{click: handleClick}}
    />
  );
};

export default CarrierDataAreas;
