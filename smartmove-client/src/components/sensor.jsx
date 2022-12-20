import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { useLamSensor } from "../hooks/sensors";

export default function LamSensorContent({ sensorid, activeSite }) {
  const { lamSensor, loading, error } = useLamSensor(sensorid);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>error...</div>;

  return (
    <>
      <Box /* TODO: Näissä on niin paljon tyylitoistoa, että voisi tehdää Sensor.module.css ja laittaa sinne sopivat luokat */
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Liikennetiedot suuntaan{" "}
          {activeSite?.properties?.direction1Municipality}
        </Typography>
        <Typography
          variant="p"
          sx={{
            pl: 2,
            pr: 2,
            fontWeight: 600,
          }}
        ></Typography>
      </Box>

      {lamSensor?.sensorValues?.map(sensor => {
        return (
          <SensorDirectionOne
            key={sensor.id}
            sensor={sensor}
            activeSite={activeSite}
          />
        );
      })}
      <Divider style={{ width: "100%" }} />
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Typography
          sx={{
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Liikennetiedot suuntaan{" "}
          {activeSite?.properties?.direction2Municipality}
        </Typography>
        <Typography
          variant="p"
          sx={{
            pl: 2,
            pr: 2,
            fontWeight: 600,
          }}
        ></Typography>
      </Box>
      {lamSensor?.sensorValues?.map(sensor => {
        return (
          <SensorDirectionTwo
            key={sensor.id}
            sensor={sensor}
            activeSite={activeSite}
          />
        );
      })}
      <Divider style={{ width: "100%" }} />
    </>
  );
}

const SensorDirectionOne = ({ sensor }) => {
  return (
    <>
      {sensor.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1" && (
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Keskinopeus
          </Typography>
          <Typography
            variant="p"
            sx={{
              fontWeight: "bold",
              mb: 1,
              pl: 2,
              pr: 2,
              fontWeight: 600,
            }}
          >
            {sensor.sensorValue} km/h
          </Typography>
        </Box>
      )}
      {sensor.name === "OHITUKSET_5MIN_LIUKUVA_SUUNTA1" && (
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Liikennemäärä
          </Typography>

          <Typography
            variant="p"
            sx={{
              pl: 2,
              pr: 2,
              fontWeight: 600,
            }}
          >
            {sensor.sensorValue} ajon. / h
          </Typography>
        </Box>
      )}
      {sensor.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1_VVAPAAS1" && (
        <Box
          style={{
            background:
              sensor.sensorValue >= 90
                ? "#06a27d"
                : sensor.sensorValue >= 25 && sensor.sensorValue < 90
                ? "#dacc14"
                : sensor.sensorValue <= 0 && sensor.sensorValue < 25
                ? "#f44336"
                : null,
            textAlign: "center",
            width: "100%",
            padding: 8,
          }}
        >
          <Typography
            variant="p"
            sx={{
              color: "#fff",
            }}
          >
            {sensor.sensorValue >= 90
              ? "Liikenne sujuvaa"
              : sensor.sensorValue >= 25 && sensor.sensorValue > 90
              ? "Liikenne jonoutunut"
              : sensor.sensorValue <= 0 && sensor.sensorValue > 25
              ? "Liikenne ruuhkaista ja pysähtelevää"
              : "ei tietoa"}
          </Typography>
        </Box>
      )}
    </>
  );
};

const SensorDirectionTwo = ({ sensor }) => {
  return (
    <>
      {sensor.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2" && (
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Keskinopeus
          </Typography>

          <Typography
            variant="p"
            sx={{
              pl: 2,
              pr: 2,
              fontWeight: 600,
            }}
          >
            {sensor.sensorValue} km/h
          </Typography>
        </Box>
      )}
      {sensor.name === "OHITUKSET_5MIN_LIUKUVA_SUUNTA2" && (
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="p" sx={{ fontWeight: "bold" }}>
            Liikennemäärä
          </Typography>

          <Typography
            variant="p"
            sx={{
              pl: 2,
              pr: 2,
              fontWeight: 600,
            }}
          >
            {sensor.sensorValue} ajon. / h
          </Typography>
        </Box>
      )}
      {sensor.name === "KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2_VVAPAAS2" && (
        <Box
          style={{
            background:
              sensor.sensorValue >= 90
                ? "#06a27d"
                : sensor.sensorValue >= 25 && sensor.sensorValue > 90
                ? "#dacc14"
                : sensor.sensorValue <= 0 && sensor.sensorValue > 25
                ? "#f44336"
                : null,
            textAlign: "center",
            width: "100%",
            padding: 8,
          }}
        >
          <Typography
            variant="p"
            sx={{
              pl: 2,
              pr: 2,
              color: "#fff",
            }}
          >
            {sensor.sensorValue >= 90
              ? "Liikenne sujuvaa"
              : sensor.sensorValue >= 25 && sensor.sensorValue > 90
              ? "Liikenne jonoutunut"
              : sensor.sensorValue <= 0 && sensor.sensorValue > 25
              ? "Liikenne ruuhkaista ja pysähtelevää"
              : "ei tietoa"}
          </Typography>
        </Box>
      )}
    </>
  );
};

const LoadingSkeleton = () => (
  <Box
    sx={{
      width: "100%",
      height: "260px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
