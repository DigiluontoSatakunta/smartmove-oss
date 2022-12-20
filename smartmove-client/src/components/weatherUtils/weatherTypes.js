// 1  clear / selkeää
// 2  partly cloudy / puolipilvistä
// 3  clouds / pilvistä
// 21 light showers / heikkoja sadekuuroja
// 22 showers / sadekuuroja
// 23 heavy showers voimakkaita sadekuuroja
// 31 light rain / heikkoa vesisadetta
// 32 rain / vesisadetta
// 33 heavy rain / voimakasta vesisadetta
// 41 light snow showers / heikkoja lumikuuroja
// 42 snow showers / lumikuuroja
// 43 heavy snow showers / voimakkaita lumikuuroja
// 51 light snow / heikkoa lumisadetta
// 52 snowfall / lumisadetta
// 53 heavy snow / voimakasta lumisadetta
// 61 thunderstorms / ukkoskuuroja
// 62 heavy thunderstorms / voimakkaita ukkoskuuroja
// 63 thunderstorms / ukkosta
// 64 heavy thunderstorms / voimakasta ukkosta
// 71 weak sleet / heikkoja räntäkuuroja
// 72 sleet / räntäkuuroja
// 73 heavy sleet / voimakkaita räntäkuuroja
// 81 light sleet / heikkoa räntäsadetta
// 82 showers / räntäsadetta
// 83 heavy sleet / voimakasta räntäsadetta
// 91 mist / utua
// 92 fog / sumua
export const getWeatherType = type => {
  const data = "";
  switch (type) {
    case "1.0":
      data = "selkeää";
      break;
    case "2.0":
      data = "puolipilvistä";
      break;
    case "3.0":
      data = "pilvistä";
      break;
    case "21.0":
      data = "heikkoja sadekuuroja";
      break;
    case "22.0":
      data = "sadekuuroja";
      break;
    case "23.0":
      data = "voimakkaita sadekuuroja";
      break;
    case "31.0":
      data = "heikkoa vesisadetta";
      break;
    case "32.0":
      data = "vesisadetta";
      break;
    case "33.0":
      data = "voimakasta vesisadetta";
      break;
    case "41.0":
      data = "heikkoja lumikuuroja";
      break;
    case "42.0":
      data = "lumikuuroja";
      break;
    case "43.0":
      data = "voimakkaita lumikuuroja";
      break;
    case "51.0":
      data = "heikkoa lumisadetta";
      break;
    case "52.0":
      data = "lumisadetta";
      break;
    case "53.0":
      data = "voimakasta lumisadetta";
      break;
    case "61.0":
      data = "ukkoskuuroja";
      break;
    case "62.0":
      data = "voimakkaita ukkoskuuroja";
      break;
    case "63.0":
      data = "ukkosta";
      break;
    case "64.0":
      data = "voimakasta ukkosta";
      break;
    case "71.0":
      data = "heikkoja räntäkuuroja";
      break;
    case "72.0":
      data = "räntäkuuroja";
      break;
    case "73.0":
      data = "voimakkaita räntäkuuroja";
      break;
    case "81.0":
      data = "heikkoa räntäsadetta";
      break;
    case "82.0":
      data = "räntäsadetta";
      break;
    case "83.0":
      data = "voimakasta räntäsadetta";
      break;
    case "91.0":
      data = "utua";
      break;
    case "92.0":
      data = "sumua";
      break;
  }

  return data;
};
