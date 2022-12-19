import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

import RechartsBar from "../charts/areaChartBar";
import RechartsBarByDate from "../charts/areaChartBarByDate";

import {useOperatorAreaData} from "../../hooks/operator";

export const AreaChart = props => {
  const {data, loading, error} = useOperatorAreaData(props);

  if (loading) return <ChartLoader />;
  if (error) return <div>error...</div>;

  const chartData = data?.map(d => ({
    ...d,
    time: d.time.split("T")[0],
    timeLabel: dayjs(d.time).tz("UTC").format("DD.MM.YYYY"),
  }));

  return <RechartsBar data={chartData} />;
};

export const AreaChartByDate = props => {
  const {data, loading, error} = useOperatorAreaData(props);

  if (loading) return <ChartLoader />;
  if (error) return <div>error...</div>;

  const chartData = data?.map(d => ({
    ...d,
    time: d.time.split("T")[0],
    timeLabel: dayjs(d.time)
      .tz("UTC")
      .format(props?.currentHour ? "HH:mm" : "DD.MM. HH:mm"),
  }));

  return <RechartsBarByDate data={chartData} />;
};

const ChartLoader = () => {
  return (
    <Box
      sx={{
        height: 260,
        minHeight: 260,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
