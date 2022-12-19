/* eslint-disable @next/next/no-img-element */
import {useState, useCallback, useEffect, useMemo} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import InputLabel from "@mui/material/InputLabel";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import ListItemText from "@mui/material/ListItemText";
import FavoriteIcon from "@mui/icons-material/Favorite";

import CircularProgress from "@mui/material/CircularProgress";

import {Chart, DoorChart, DurationChart} from "./chart";
import InstagramImages from "./instagram";
import WikipediaPage from "./wikipedia";
import LamSensorContent from "./sensor";
import WeatherForeCast from "./weatherForeCast";
import {sites as weeatherStations} from "./weatherStations";

import {usePlotr} from "../hooks/plotr";

import {useWeatherData} from "../hooks/weather";
import {useNaceAggregations} from "../hooks/syke";

import {AreaChart, AreaChartByDate} from "./carrier/areaChart";
import WeatherChart from "./charts/weather";

dayjs.extend(utc);
dayjs.extend(timezone);

const ADD_FAVORITE = gql`
  mutation (
    $id: String!
    $uid: String!
    $timestamp: String!
    $type: String!
    $name: String!
  ) {
    addFavorite(
      id: $id
      uid: $uid
      timestamp: $timestamp
      type: $type
      name: $name
    ) {
      id
      uid
      name
      timestamp
      type
      __typename
    }
  }
`;

const REMOVE_FAVORITE = gql`
  mutation ($id: String!, $uid: String!, $type: String!) {
    removeFavorite(id: $id, uid: $uid, type: $type) {
      id
      uid
      timestamp
      type
      __typename
    }
  }
`;

const GET_FAVORITES = gql`
  query GET_FAVORITES {
    favorites {
      id
      name
      uid
      type
      timestamp
      __typename
    }
  }
`;

const drawerWidth = 360;

export default function Sidebar({
  activeSite,
  setActiveSite,
  weatherCoords,
  queryStartDate,
  queryStopDate,
  currentHour,
}) {
  const [step, setStep] = useState("month");

  const handleDrawerClose = () => setActiveSite(null);

  return (
    <Drawer
      open={!!activeSite}
      anchor="right"
      hideBackdrop={true}
      BackdropProps={{invisible: true}}
      transitionDuration={{enter: 400, exit: 400}}
      onClose={() => {
        setActiveSite(null);
      }}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Box
        sx={{
          pl: 2,
          pr: 2,
          display: "flex",
          minHeight: "68px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={handleDrawerClose}>
          <CloseIcon />
        </IconButton>
        {activeSite?.__typename !== "FavoritesList" && (
          <FavoriteButton activeSite={activeSite} />
        )}
      </Box>
      {activeSite?.__typename === "FavoritesList" && (
        <Box>
          <MyFavorites setActiveSite={setActiveSite} />
          <Divider sx={{mb: 3}} />
          <CrowdFavorites setActiveSite={setActiveSite} />
        </Box>
      )}
      {activeSite?.__typename === "Site" && (
        <ActiveSite site={activeSite} step={step} setStep={setStep} />
      )}
      {activeSite?.__typename === "DigitrafficTmsStationsMetaData" && (
        <ActiveStation activeSite={activeSite} />
      )}
      {activeSite?.__typename === "DoorResult" && <ActiveDoor />}

      {activeSite?.__typename === "Fireplace" && !!weatherCoords && (
        <WeatherForeCast weatherCoords={weatherCoords} />
      )}

      {activeSite?.__typename === "WikipediaGeoSearchResultGeosearch" && (
        <ActiveWikipediaPage site={activeSite} />
      )}
      {activeSite?.__typename === "SykeArea" && (
        <ActiveSykeArea site={activeSite} />
      )}
      {activeSite?.__typename === "GridArea" && (
        <GridArea
          site={activeSite}
          queryStartDate={queryStartDate}
          queryStopDate={queryStopDate}
          currentHour={currentHour}
        />
      )}

      {activeSite?.__typename === "WeatherStation" && (
        <>
          <Typography
            variant="h6"
            sx={{
              pl: 2,
              pr: 2,
              textTransform: "uppercase",
            }}
          >
            Sääasema {activeSite?.name}
          </Typography>
          <Divider />
          <WeatherStation
            activeSite={activeSite}
            queryStartDate={queryStartDate}
            queryStopDate={queryStopDate}
          />
        </>
      )}
    </Drawer>
  );
}

const WeatherStation = ({activeSite, queryStartDate, queryStopDate}) => {
  const [data, setData] = useState([]);
  const {
    data: temp_data,
    loading,
    error,
  } = useWeatherData({
    station: activeSite?.influxName,
    element: "air_temperature",
    start: queryStartDate,
    stop: queryStopDate,
    aggregateWindow: "1h",
    fn: "mean",
  });

  const {data: prec_data, loading: prec_loading} = useWeatherData({
    station: activeSite?.influxName,
    element: "precipitation_amount",
    start: queryStartDate,
    stop: queryStopDate,
    aggregateWindow: "1h",
    fn: "mean",
  });

  useEffect(() => {
    if (temp_data && prec_data) {
      const data = temp_data.map(d => ({
        temperature: d.value,
        time: parseInt(d?.time.split("T")[1].split(":")[0]),
      }));

      // add sademäärä to data array matching time
      if (prec_data.length > 0) {
        prec_data.forEach(d => {
          const time = parseInt(d?.time.split("T")[1].split(":")[0]);
          const index = data.findIndex(d => d.time === time);
          if (index > -1) {
            data[index].precipitation = d.value;
          }
        });
      }

      setData(data);
    }
  }, [temp_data, prec_data]);

  return (
    <>
      {loading && <Typography>Ladataan...</Typography>}
      {prec_loading && <Typography>Ladataan...</Typography>}

      {error && <Typography>{error.message}</Typography>}
      {data && (
        <>
          <Box
            sx={{
              pl: 1,
              pr: 1,
              mt: 1,
              mb: 1,
            }}
          >
            <WeatherChart data={data} />
          </Box>
          <Box
            sx={{
              pl: 2,
              pr: 2,
            }}
          >
            <Typography variant="body2" sx={{fontSize: 12}}>
              Säätietoja on saatavilla vuodesta 2019 alkaen vaihtelevasti.
              Monilta mittausasemilta ei ole saatavilla sademääriä.
              {prec_data?.length == 0 && (
                <Box sx={{mt: 1}}>Puuttuva tieto: sademäärä</Box>
              )}
              {temp_data?.length == 0 && <Box>Puuttuva tieto: lämpötila</Box>}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

const FavoriteButton = ({activeSite}) => {
  const [favorite, setFavorite] = useState(false);

  const isFavorite = useCallback(() => {
    if (activeSite) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      const found = favorites.find(
        f => f?.id === activeSite?.id && f.type === activeSite?.__typename
      );

      setFavorite(found);
    } else {
      setFavorite(false);
    }
  }, [activeSite]);

  useEffect(() => {
    isFavorite();
  }, [isFavorite]);

  const [addFavorite, {response, loading, error}] = useMutation(ADD_FAVORITE, {
    onCompleted(response) {
      console.log("addFavorite response: ", response);
    },
    onError(error) {
      console.log("addFavorite error: ", error);
    },
  });

  const [removeFavorite, {remove_response, remove_loading, remove_error}] =
    useMutation(REMOVE_FAVORITE, {
      onCompleted(remove_response) {
        console.log("removeFavorite response: ", remove_response);
      },
      onError(remove_error) {
        console.log("removeFavorite error: ", remove_error);
      },
    });

  const toggleFavoriteState = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const found = favorites.find(
      f => f?.id === activeSite?.id && f?.type === activeSite?.__typename
    );

    if (found) {
      favorites = favorites.filter(
        f => f?.id !== activeSite?.id || f?.type !== activeSite?.__typename
      );

      removeFavorite({
        variables: {
          id: "" + activeSite?.id,
          name: activeSite?.name || activeSite?.title || "Nimetön",
          uid: localStorage.getItem("uid"),
          type: activeSite?.__typename,
        },
      });
    } else {
      const favorite = {
        id: activeSite?.id ? "" + activeSite?.id : "door",
        uid: localStorage.getItem("uid"),
        name: activeSite?.name || activeSite?.title || "Nimetön",
        timestamp: "" + Date.now(),
        type: activeSite?.__typename,
      };

      favorites?.push(favorite);

      addFavorite({
        variables: favorite,
      });
    }

    setFavorite(!found);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  return (
    <Button
      variant="contained"
      size="small"
      style={{color: "#fff"}}
      onClick={toggleFavoriteState}
    >
      {favorite ? "Poista suosikeista" : "Lisää suosikkeihin"}
    </Button>
  );
};

const ActiveStation = ({activeSite}) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        Mittauspiste {activeSite?.name}
      </Typography>
      <Divider />
      {activeSite && (
        <Box
          sx={{
            pl: 1,
            pr: 1,
            mt: 1,
            mb: 1,
          }}
        >
          <LamSensorContent sensorid={activeSite?.id} activeSite={activeSite} />
        </Box>
      )}
    </>
  );
};

const ActiveWikipediaPage = ({site}) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        {site?.title}
      </Typography>

      <Box
        sx={{
          pl: 2,
          pr: 1,
          mt: 1,
          mb: 1,
        }}
      >
        <WikipediaPage pageid={site?.id} />
      </Box>

      <Divider />
    </>
  );
};

const ActiveDoor = () => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        Tammen tila
      </Typography>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Suositut tunnit
        </Typography>
      </Box>

      <DoorChart />
      <Divider />

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Oven aukioloajat (sekuntia)
        </Typography>
      </Box>

      <DurationChart />
      <Divider />
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        #tammentila
      </Typography>
      <Divider />
      <InstagramImages hashtag="tammentila" />
    </>
  );
};

const GridArea = ({site, queryStartDate, queryStopDate, currentHour}) => {
  const weatherStation = weeatherStations.find(s => s.areas.includes(site?.id));

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        {site?.name}
      </Typography>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          KOKO MITTAUSAJAN TILASTOT (kk)
        </Typography>
      </Box>
      <AreaChart
        areaCode={site?.id}
        start={`2019-01-01T00:00:00Z`}
        stop={`2023-01-01T00:00:00Z`}
        aggregateWindow={`1mo`}
      />
      <Divider sx={{mt: 1, mb: 1}} />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          VALITUN MITTAUSAJAN TILASTOT
        </Typography>
      </Box>
      <AreaChartByDate
        areaCode={site?.id}
        start={queryStartDate}
        stop={queryStopDate}
        aggregateWindow={`1h`}
        currentHour={currentHour}
      />
      <Divider sx={{mt: 1, mb: 1}} />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          SÄÄTIEDOT ({weatherStation?.name})
        </Typography>
      </Box>
      <WeatherStation
        activeSite={{influxName: weatherStation?.influxName}}
        queryStartDate={queryStartDate}
        queryStopDate={queryStopDate}
      />
      <Divider sx={{mt: 2}} />
      {site && <PlotrImage site={site} />}
    </>
  );
};

const PlotrImage = ({site}) => {
  const [x_param, setXParam] = useState("people_count");
  const [y_param, setYParam] = useState("air_temperature");
  const [range_window, setRangeWindow] = useState("d");
  const [aggregate_window, setAggregateWindow] = useState("1d");

  const {image, loading} = usePlotr({
    area_code: site?.id,
    x_param,
    y_param,
    range_window,
    aggregate_window,
  });

  const BASE_URL =
    process.env.PLOTR_SERVICE_BASE_URL ||
    "https://smartmove.example.org/micror/r";

  const link2image = useMemo(() => {
    const params = new URLSearchParams();
    params.append("area_code", site?.id);
    params.append("x_param", x_param);
    params.append("y_param", y_param);
    params.append("range_window", range_window);
    params.append("aggregate_window", aggregate_window);
    params.append("format", "png");
    return `${BASE_URL}?${params.toString()}`;
  }, [BASE_URL, site?.id, x_param, y_param, range_window, aggregate_window]);

  return (
    <Box>
      <Typography
        sx={{
          pl: 2,
          pr: 1,
          mt: 2,
          mb: 1,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        PlotR
      </Typography>

      <Box
        sx={{
          pl: 2,
          pr: 1,
          mt: 2,
          mb: 1,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Box sx={{position: "relative"}}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="x_param" sx={{width: "min-content"}}>
                  X parametri
                </InputLabel>
                <Select
                  labelId="x_param"
                  id="x_param-select"
                  value={x_param}
                  label="X param"
                  onChange={e => setXParam(e.target.value)}
                  sx={{minWidth: "100%"}}
                >
                  <MenuItem value={"people_count"}>laitemäärä</MenuItem>
                  <MenuItem value={"air_temperature"}>ilman lämpötila</MenuItem>
                  <MenuItem value={"cloud_amount"}>pilvisyys</MenuItem>
                  <MenuItem value={"dew-point_temperature"}>
                    kastepiste
                  </MenuItem>
                  <MenuItem value={"gust_speed"}>
                    tuulen nopeus puuskassa
                  </MenuItem>
                  <MenuItem value={"horizontal_visibility"}>näkyvyys</MenuItem>
                  <MenuItem value={"precipitation_amount"}>sademäärä</MenuItem>
                  <MenuItem value={"precipitation_intensity"}>
                    sateen voimakkuus
                  </MenuItem>
                  <MenuItem value={"pressure"}>ilmanpaine</MenuItem>
                  <MenuItem value={"relative_humidity"}>ilmankosteus</MenuItem>
                  <MenuItem value={"snow_depth"}>lumen syvyys</MenuItem>
                  <MenuItem value={"wind_direction"}>tuulen suunta</MenuItem>
                  <MenuItem value={"wind_speed"}>tuulen nopeus</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{position: "relative"}}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="y_param" sx={{width: "min-content"}}>
                  Y parametri
                </InputLabel>
                <Select
                  labelId="Y param"
                  id="y_param-select"
                  value={y_param}
                  label="Y param"
                  onChange={e => setYParam(e.target.value)}
                  sx={{minWidth: "100%"}}
                >
                  <MenuItem value={"people_count"}>laitemäärä</MenuItem>
                  <MenuItem value={"air_temperature"}>ilman lämpötila</MenuItem>
                  <MenuItem value={"cloud_amount"}>pilvisyys</MenuItem>
                  <MenuItem value={"dew-point_temperature"}>
                    kastepiste
                  </MenuItem>
                  <MenuItem value={"gust_speed"}>
                    tuulen nopeus puuskassa
                  </MenuItem>
                  <MenuItem value={"horizontal_visibility"}>näkyvyys</MenuItem>
                  <MenuItem value={"precipitation_amount"}>sademäärä</MenuItem>
                  <MenuItem value={"precipitation_intensity"}>
                    sateen voimakkuus
                  </MenuItem>
                  <MenuItem value={"pressure"}>ilmanpaine</MenuItem>
                  <MenuItem value={"relative_humidity"}>ilmankosteus</MenuItem>
                  <MenuItem value={"snow_depth"}>lumen syvyys</MenuItem>
                  <MenuItem value={"wind_direction"}>tuulen suunta</MenuItem>
                  <MenuItem value={"wind_speed"}>tuulen nopeus</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{mt: 2}}></Box>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Box sx={{position: "relative"}}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="aggregate_window" sx={{width: "min-content"}}>
                  Näytteistys
                </InputLabel>
                <Select
                  labelId="aggregate_window"
                  id="aggregate_window-select"
                  value={aggregate_window}
                  label="Näytteistys"
                  onChange={e => setAggregateWindow(e.target.value)}
                  sx={{minWidth: "100%"}}
                >
                  <MenuItem value={"1h"}>1 tunti</MenuItem>
                  <MenuItem value={"2h"}>2 tuntia</MenuItem>
                  <MenuItem value={"8h"}>8 tuntia</MenuItem>
                  <MenuItem value={"1d"}>1 vuorokausi</MenuItem>
                  <MenuItem value={"1w"}>1 viikko</MenuItem>
                  <MenuItem value={"1mo"}>1 kuukausi</MenuItem>
                  <MenuItem value={"1y"}>1 vuosi</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{position: "relative"}}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="range_window" sx={{width: "min-content"}}>
                  Tilastointi-ikkuna
                </InputLabel>
                <Select
                  labelId="range_window"
                  id="range_window-select"
                  value={range_window}
                  label="Tilastointi ikkuna"
                  onChange={e => setRangeWindow(e.target.value)}
                  sx={{minWidth: "100%"}}
                >
                  <MenuItem value={"h"}>vuorokauden tunnit</MenuItem>
                  <MenuItem value={"d"}>viikon päivät</MenuItem>
                  <MenuItem value={"j"}>vuoden päivät (1-366)</MenuItem>
                  <MenuItem value={"w"}>vuoden viikot</MenuItem>
                  <MenuItem value={"mo"}>vuoden kuukaudet</MenuItem>
                  <MenuItem value={"y"}>vuodet</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <a
            href={link2image}
            target="_blank"
            rel="noreferrer noopener"
            title="Plotr image"
          >
            <img
              loading="lazy"
              src={image}
              width={400}
              height={300}
              alt="Plotr image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                aspectRatio: "400/300",
              }}
            />
          </a>
        )}
      </Box>
    </Box>
  );
};

const ActiveSykeArea = ({site}) => {
  const {naces, loading} = useNaceAggregations(site?.id);

  if (loading)
    return (
      <Box sx={{mt: 0, ml: 2, mr: 2}}>
        <p>Ladataan tietoja...</p>
      </Box>
    );

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        {site?.name}
      </Typography>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Suurimmat toimialat
        </Typography>
      </Box>
      <Box sx={{mt: 0, ml: 2, mr: 2}}>
        {naces?.length > 0 ? (
          <>
            {naces?.map(nace => (
              <p key={nace.nace}>
                {nace.naceName}, liikevaihto: {nace.value}
              </p>
            ))}
          </>
        ) : (
          <p>Ei tietoja alueelta.</p>
        )}
      </Box>

      <Divider />
    </>
  );
};

const ActiveSite = ({site, step, setStep}) => {
  const handleChange = event => {
    setStep(event.target.value);
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        {site?.name}
      </Typography>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}
      >
        <Typography
          sx={{
            pl: 2,
            pr: 1,
            mt: 1,
            mb: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Suositut ajat
        </Typography>
        <FormControl fullWidth sx={{mt: 0, ml: 2, ml: 1}}>
          <NativeSelect
            defaultValue={step}
            onChange={handleChange}
            inputProps={{
              name: "step",
              id: "uncontrolled-native",
            }}
            sx={{mt: 0}}
          >
            <option value={"day"}>päivä</option>
            <option value={"month"}>kuukausi</option>
            <option value={"year"}>vuosi</option>
          </NativeSelect>
        </FormControl>
      </Box>

      <Chart step={step} id={site?.id} begin={site?.firstData} />
      <Divider />
    </>
  );
};

const MyFavorites = ({setActiveSite}) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return (
    <FavoritesList
      favorites={favorites}
      setActiveSite={setActiveSite}
      title="Omat suosikit"
    />
  );
};

const CrowdFavorites = ({setActiveSite}) => {
  const {data, loading, error} = useQuery(GET_FAVORITES);
  if (loading) return <div>Ladataan...</div>;
  if (error) return <div>Virhe tietojan lataamisessa!</div>;

  const favorites = data?.favorites?.reduce((acc, cur) => {
    const index = acc.findIndex(item => item.id === cur.id);
    if (index === -1) {
      acc.push({id: cur.id, name: cur.name, type: cur.type, count: 1});
    } else {
      acc[index].count += 1;
    }
    return acc;
  }, []);

  favorites?.sort((a, b) => b.count - a.count);

  // show only top 10
  return (
    <FavoritesList
      favorites={favorites?.slice(0, 10)}
      setActiveSite={setActiveSite}
      title="10 suosituinta kohdetta"
    />
  );
};

const FavoritesList = ({favorites, setActiveSite, title}) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          pl: 2,
          pr: 2,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      <Divider />
      {favorites?.length > 0 ? (
        <List dense={true}>
          {favorites?.map(favorite => (
            <ListItem
              button
              key={favorite?.id}
              onClick={() => {
                setActiveSite({
                  id: favorite?.id,
                  name: favorite?.name,
                  __typename: favorite?.type,
                });
              }}
              secondaryAction={
                <Badge badgeContent={favorite?.count} x>
                  <FavoriteIcon color="secondary" />
                </Badge>
              }
            >
              <ListItemText primary={favorite?.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{pl: 2, pr: 2, pt: 2, pb: 2}}>
          Ei vielä yhtään suosikkia
        </Typography>
      )}
    </>
  );
};
