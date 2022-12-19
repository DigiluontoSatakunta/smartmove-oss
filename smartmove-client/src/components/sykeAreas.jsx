import {Polygon} from "react-leaflet";

import data from "./syke/YKRKaupunkiMaaseutuLuokitus.json";

const SykeAreas = ({setActiveSite, activeSite}) => {
  const {features} = data;

  return (
    <>
      {features?.map((f, i) => (
        <SykePolygon
          key={i}
          feature={f}
          activeSite={activeSite}
          setActiveSite={setActiveSite}
        />
      ))}
    </>
  );
};

// const getRandomHue = (min, max) => Math.random() * (max - min) + min;

// Luokitus, K = kaupunki, M = maaseutu
// K1 = Sisempi kaupunkialue
// K2 = Ulompi kaupunkialue
// K3 = Kaupungin kehitysalue
// K4 = Maaseudun paikalliskeskukset
// M5 = Kaupungin läheinen maaseutu
// M6 = Ydinmaaseutu
// M7 = Harvaan asuttu maaseutu
const getColor = classification => {
  switch (classification) {
    case "K1":
      return "hsl(2deg 100% 21%)";
    case "K2":
      return "hsl(280deg 2% 37%)";
    case "K3":
      return "hsl(0deg 74% 63%)";
    case "K4":
      return "hsl(265deg 42% 62%)";
    case "M5":
      return "hsl(27deg 66% 63%)";
    case "M6":
      return "hsl(49deg 83% 86%)";
    case "M7":
      return "hsl(96deg 27% 48%)";
    default:
      return "hsl(0deg 0% 0%)";
  }
};

const SykePolygon = ({feature, setActiveSite, activeSite}) => {
  const {geometry} = feature;
  const coordinates = geometry.coordinates[0];
  const hue =
    activeSite?.id === feature.id
      ? "hsl(0deg 100% 50%)"
      : getColor(feature.properties["Luokka"]);

  const pathOptions = {
    opacity: 1,
    weight: 1,
    fillOpacity: 0.5,
    color: hue,
  };

  const positions = coordinates?.map(coord => [coord[1], coord[0]]);

  return (
    <Polygon
      pathOptions={pathOptions}
      positions={positions}
      style={{userSelect: "none"}}
    />
  );
};

export default SykeAreas;
