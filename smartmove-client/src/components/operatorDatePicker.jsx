import * as React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {StaticDatePicker} from "@mui/x-date-pickers/StaticDatePicker";

export default function OperatorDatePicker({currentDate, setCurrentDate}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        onChange={date => setCurrentDate(date.$d)}
        displayStaticWrapperAs="desktop"
        value={currentDate}
        openTo="day"
        minDate={dayjs("2019-01-01")}
        maxDate={dayjs("2022-08-31")}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
