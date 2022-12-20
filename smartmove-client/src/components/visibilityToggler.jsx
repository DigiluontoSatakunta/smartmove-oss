import {useState} from "react";
import dayjs from "dayjs";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import FormGroup from "@mui/material/FormGroup";
import PlaceIcon from "@mui/icons-material/Place";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FormControlLabel from "@mui/material/FormControlLabel";

import CarrierAreaSelect from "./carrierAreaSelect";
import OperatorDatePicker from "./operatorDatePicker";

import "dayjs/locale/fi";
dayjs.locale("fi");

export default function VisibilityToggler({
  contentTypes,
  setContentTypes,
  activeAreas,
  setActiveAreas,
  currentDate,
  setCurrentDate,
  currentHour,
  setCurrentHour,
}) {
  const [showPoiList, setShowPoiList] = useState(true);
  const [showTimeSlider, setShowTimeSlider] = useState(false);
  const [displayHour, setDisplayHour] = useState(-1);
  const [favorites, setFavorites] = useState([]);

  const handleToggle = type => () => {
    const newContentTypes = contentTypes.map(item =>
      item.type !== type ? item : {...item, visible: !item.visible}
    );
    setContentTypes(newContentTypes);
  };

  const handlePOIReset = () => {
    const newContentTypes = contentTypes.map(item => ({
      ...item,
      visible: false,
    }));
    setContentTypes(newContentTypes);
  };

  const handleAreaReset = () => setActiveAreas([]);
  const handleClosePoiList = () => setShowPoiList(false);
  const handleOpenPoiList = () => setShowPoiList(true);
  const handleAddFavorite = () => setFavorites([...favorites, currentDate]);
  const handleDeleteFavorites = () => setFavorites([]);
  const handleDeleteFavorite = favorite =>
    setFavorites(favorites.filter(date => date !== favorite));

  const handleChangeToggleTimeSlider = () => {
    setCurrentHour(showTimeSlider ? -1 : 18);
    setDisplayHour(showTimeSlider ? -1 : 18);
    setShowTimeSlider(!showTimeSlider);
  };

  return (
    <>
      {!showPoiList && (
        <Box
          sx={{
            position: "absolute",
            left: "12px",
            top: "150px",
            zIndex: 1000,
          }}
        >
          <IconButton
            aria-label="avaa kohdelista"
            sx={{
              padding: "4px",
              background: "white",
              border: "2px solid rgb(135 169 179)",
            }}
            onClick={handleOpenPoiList}
          >
            <LocationOnIcon fontSize="small" sx={{color: "black"}} />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          position: "absolute",
          top: 78,
          left: 52,
          right: 16,
          zIndex: 1100,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            gap: 1,
            display: "flex",
            maxWidth: "100%",
            position: "relative",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          {showPoiList && (
            <Box
              sx={{
                width: "195px",
                borderRadius: 1,
                flex: "0 0 auto",
                overflow: "hidden",
                bgcolor: "background.paper",
                border: "2px solid rgb(135 169 179)",
                pointerEvents: "all",
              }}
            >
              <List
                dense={true}
                subheader={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListSubheader>SISÄLLÖT</ListSubheader>
                    <IconButton
                      aria-label="close"
                      size="small"
                      onClick={handleClosePoiList}
                      sx={{cursor: "pointer", pointerEvents: "auto"}}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                }
              >
                {contentTypes?.map(item => (
                  <ContentTypeListItem
                    key={item.type}
                    item={item}
                    handleToggle={handleToggle}
                  />
                ))}
              </List>
              <Divider />
              <Box sx={{pl: 2, pb: 2, pt: 2}}>
                <Typography
                  onClick={handlePOIReset}
                  variant="body2"
                  sx={{fontSize: "12px", cursor: "pointer"}}
                >
                  Tyhjennä valinnat
                </Typography>
              </Box>
            </Box>
          )}
          {contentTypes?.find(item => item.type === "CarrierData")?.visible && (
            <>
              <Box
                sx={{
                  width: "325px",
                  borderRadius: 1,
                  flex: "0 0 auto",
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  border: "2px solid rgb(135 169 179)",
                  pointerEvents: "all",
                }}
              >
                <List
                  dense={true}
                  subheader={
                    <Box
                      sx={{
                        mr: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListSubheader>ALUEET</ListSubheader>
                    </Box>
                  }
                >
                  <CarrierAreaSelect
                    sx={{zIndex: 3000}}
                    activeAreas={activeAreas}
                    setActiveAreas={setActiveAreas}
                  />
                  <Box sx={{pl: 2, pb: 2, pt: 2}}>
                    <Typography
                      onClick={handleAreaReset}
                      variant="body2"
                      sx={{fontSize: "12px", cursor: "pointer"}}
                    >
                      Tyhjennä valinnat
                    </Typography>
                  </Box>
                  <Divider />
                </List>

                <List
                  dense={true}
                  subheader={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mr: 1,
                        zIndex: 0,
                      }}
                    >
                      <ListSubheader>AJANKOHTA</ListSubheader>
                      <FormGroup>
                        <FormControlLabel
                          sx={{fontSize: "14px"}}
                          control={
                            <Switch
                              size="small"
                              checked={showTimeSlider}
                              onChange={handleChangeToggleTimeSlider}
                            />
                          }
                          label="Kello"
                        />
                      </FormGroup>
                    </Box>
                  }
                >
                  {showTimeSlider && (
                    <>
                      <Box sx={{p: 2, pt: 0}}>
                        <Slider
                          key={`slider-time`}
                          min={0}
                          max={23}
                          size="small"
                          onChange={(_, value) => setDisplayHour(value)}
                          onChangeCommitted={(_, value) =>
                            setCurrentHour(value)
                          }
                          value={currentHour}
                          aria-label="Valitse kellonaika"
                          valueLabelDisplay="auto"
                          step={1}
                          // marks
                          sx={{color: "primary.main", zIndex: 10}}
                        />
                        <Typography
                          variant="body2"
                          sx={{fontSize: "12px", mt: -1}}
                        >
                          Valinta: klo {displayHour}
                        </Typography>
                      </Box>
                      <Divider />
                    </>
                  )}
                </List>
                <Box>
                  <OperatorDatePicker
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                  />
                </Box>
                <Box sx={{pl: 1, pr: 1, pt: 2, pb: 2}}>
                  <Typography
                    onClick={handleAddFavorite}
                    variant="body2"
                    sx={{fontSize: "12px", cursor: "pointer"}}
                  >
                    Lisää pikavalinnaksi
                  </Typography>
                  {favorites?.length > 0 && (
                    <Stack
                      spacing={1}
                      direction="row"
                      sx={{flexWrap: "wrap", gap: "4px", mt: 2}}
                    >
                      {favorites?.map((item, index) => (
                        <Chip
                          key={index}
                          label={dayjs(item).format("DD.MM.YYYY")}
                          onDelete={() => handleDeleteFavorite(item)}
                          onClick={() => setCurrentDate(item)}
                          color={currentDate === item ? "primary" : "default"}
                          size="small"
                          sx={{ml: "0 !important"}}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>

                <Divider />
                <Box sx={{pl: 2, pb: 2, pt: 2}}>
                  <Typography
                    onClick={handleDeleteFavorites}
                    variant="body2"
                    sx={{fontSize: "12px", cursor: "pointer"}}
                  >
                    Tyhjennä valinnat
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {contentTypes?.find(item => item.type === "SYKE")?.visible && (
            <Box
              sx={{
                width: "325px",
                borderRadius: 1,
                flex: "0 0 auto",
                overflow: "hidden",
                bgcolor: "background.paper",
                border: "2px solid rgb(135 169 179)",
                pointerEvents: "all",
              }}
            >
              <List
                dense={true}
                subheader={
                  <Box
                    sx={{
                      mr: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListSubheader>SYKE-ALUEET</ListSubheader>
                  </Box>
                }
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(2deg 100% 21%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>K1 = Sisempi kaupunkialue</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(280deg 2% 37%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>K2 = Ulompi kaupunkialue</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(0deg 74% 63%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>K3 = Kaupungin kehitysalue</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(265deg 42% 62%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>K4 = Maaseudun paikalliskeskukset</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(27deg 66% 63%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>M5 = Kaupungin läheinen maaseutu</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(49deg 83% 86%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>M6 = Ydinmaaseutu</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "hsl(96deg 27% 48%)"}}>
                      <PlaceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>M7 = Harvaan asuttu maaseutu</ListItemText>
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

const ContentTypeListItem = ({item, handleToggle}) => {
  return (
    <ListItem sx={{paddingTop: 0, paddingBottom: 0, height: "32px"}}>
      <ListItemText
        id={`switch-list-label-${item.type}`}
        primary={item.label}
      />
      <Switch
        edge="end"
        onChange={handleToggle(item.type)}
        checked={item.visible}
        inputProps={{
          "aria-labelledby": `switch-list-label-${item.type}`,
        }}
      />
    </ListItem>
  );
};
