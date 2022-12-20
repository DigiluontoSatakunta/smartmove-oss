import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import {getWeatherType} from "./weatherUtils/weatherTypes";
import {useCoordsToCity} from "../hooks/stationByCoords";
import {useForecast} from "../hooks/forecast";

export default function WeatherForeCast({weatherCoords}) {
  const {data, loading, error} = useCoordsToCity(weatherCoords);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        alignItems: "baseline",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <p>Sääennuste {data?.length && data[0]?.local_names?.fi}</p>
      {data && data.length && <Measurements city={data[0]?.local_names?.fi} />}
    </Box>
  );
}

const Measurements = ({city}) => {
  const {forecast, loading, error} = useForecast(city);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  if (forecast?.measurements === null) {
    return (
      <Stack spacing={2} sx={{width: "100%"}}>
        <Alert severity="error">
          Ilmatieteenlaitoksen HIRLAM ennustamallin mukainen rajapinta on
          suljettu lokakuun lopussa 2022. Sääennuste ei ole saatavilla.
        </Alert>
      </Stack>
    );
  }

  return (
    <>
      {forecast?.measurements?.Temperature?.values?.map((temp, i) => {
        return (
          <Card sx={{width: "100%", mt: 1, mb: 1}} key={i}>
            <CardContent
              sx={{
                pt: 2,
                "&:last-child": {pb: 2},
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gridTemplateRows: "auto",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="p"
                  sx={{
                    pl: 1,
                    pr: 1,
                  }}
                >
                  Klo {("0" + new Date(temp?.time).getHours()).slice(-2)}
                </Typography>
                {forecast.measurements.WeatherSymbol3.values.map((symb, j) => {
                  if (symb.time === temp.time) {
                    let weatherType = getWeatherType(symb.value);
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={j}
                        style={{paddingLeft: 8, paddingRight: 8}}
                        src={`/symbols/${symb.value.replace(".0", "")}.svg`}
                        alt="image"
                      />
                    );
                  }
                })}
                <Typography
                  variant="p"
                  sx={{
                    pl: 1,
                    pr: 1,
                  }}
                >
                  {parseInt(temp?.value)}°C
                </Typography>
                {forecast.measurements.WindSpeedMS.values.map(
                  (windSpeed, k) => {
                    if (windSpeed.time === temp.time) {
                      return (
                        <Typography
                          variant="p"
                          sx={{
                            pl: 1,
                            pr: 1,
                          }}
                          key={k}
                        >
                          {parseInt(windSpeed.value)} m/s
                        </Typography>
                      );
                    }
                  }
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};
