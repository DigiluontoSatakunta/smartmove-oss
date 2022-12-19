const getLabels = (measurement, data) => {
  switch (measurement) {
    case "Temperature":
      data[0] = "Air temperature";
      data[1] = "°C";
      break;
    case "DewPoint":
      data[0] = "Dew point";
      data[1] = "°C";
      break;
    case "GeopHeight":
      data[0] = "Geopotential height";
      data[1] = "";
      break;
    case "Pressure":
      data[0] = "Air pressure";
      data[1] = "hPa";
      break;
    case "Humidity":
      data[0] = "Humidity";
      data[1] = "%";
      break;
    case "TotalCloudCover":
      data[0] = "Total cloud cover";
      data[1] = "%";
      break;
    case "LowCloudCover":
      data[0] = "Low cloud cover";
      data[1] = "%";
      break;
    case "MediumCloudCover":
      data[0] = "Medium cloud cover";
      data[1] = "%";
      break;
    case "HighCloudCover":
      data[0] = "High cloud cover";
      data[1] = "%";
      break;
    case "WindDirection":
      data[0] = "Wind";
      data[1] = "deg";
      break;
    case "WindSpeedMS":
      data[0] = "Wind speed";
      data[1] = "m/s";
      break;
    case "MaximumWind":
      data[0] = "Maximum wind speed";
      data[1] = "m/s";
      break;
    case "WindGust":
      data[0] = "Wind gust";
      data[1] = "m/s";
      break;
    case "Precipitation1h":
      data[0] = "Precipitation amount 1 hour";
      data[1] = "mm/h";
      break;
    case "PrecipitationAmount":
      data[0] = "Precipitation amount";
      data[1] = "mm";
      break;
    case "RadiationGlobalAccumulation":
      data[0] = "Global radiation accumulation";
      data[1] = "J/m2";
      break;
    case "RadiationLWAccumulation":
      data[0] = "Long wave radiation accumulation";
      data[1] = "J/m2";
      break;
    case "RadiationNetSurfaceLWAccumulation":
      data[0] = "Net thermal radiation accumulation at the surface";
      data[1] = "J/m2";
      break;
    case "RadiationNetSurfaceSWAccumulation":
      data[0] = "Net short wave radiation accumulation at the surface";
      data[1] = "J/m2";
      break;
    case "RadiationDiffuseAccumulation":
      data[0] = "Diffuse short wave radiation accumulation at the surface";
      data[1] = "J/m2";
      break;
    case "LandSeaMask":
      data[0] = "Land-sea mask";
      data[1] = "";
      break;
    case "WeatherSymbol3":
      data[0] = "Weather";
      data[1] = "";
      break;
    case "WindUMS":
      data[0] = "U-component of wind vector";
      data[1] = "m/s";
      break;
    case "WindVMS":
      data[0] = "V-component of wind";
      data[1] = "m/s";
      break;
    default:
      data[0] = "";
      data[1] = "";
      break;
  }

  return data;
};

module.exports = {
  getLabels,
};
