import {useState, useEffect} from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

import styles from "../../styles/Forms.module.css";

import carrierAreas from "./carrier/satakunta_area.json";

const ITEM_HEIGHT = 24;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  style: {
    zIndex: 4000,
  },
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 120,
      "& > *": {
        fontSize: 8,
      },
    },
  },
};

export default function CarrierAreaSelect({activeAreas, setActiveAreas}) {
  const [indexes, _] = useState(
    carrierAreas.features.map(f => f.id + "").sort((a, b) => a - b)
  );

  const handleChange = event => {
    const {
      target: {value},
    } = event;
    setActiveAreas(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    return () => {
      // reset active areas when component unmounts
      setActiveAreas([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <FormControl sx={{m: 1, width: "100%", pr: 2}} size="small">
        <InputLabel id="operator-area-selector">Aluekoodit</InputLabel>
        <Select
          labelId="operator-area-selector"
          id="demo-multiple-chip"
          multiple
          value={activeAreas}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Aluekoodit" />}
          renderValue={selected => (
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
              {selected.map(value => (
                <Chip key={value} label={value} className={styles.chip} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {indexes.map(id => (
            <MenuItem
              key={id}
              value={id}
              sx={{fontSize: "12px", pt: 0.5, pb: 0.5}}
            >
              {id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
