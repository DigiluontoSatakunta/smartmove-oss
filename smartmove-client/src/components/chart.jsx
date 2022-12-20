import * as React from "react";
import groupBy from "lodash.groupby";
import findLastIndex from "lodash.findlastindex";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import RechartsBar from "./charts/bar";
import DurationBar from "./charts/duration";

import {useSiteData} from "../hooks/data";
import {useDoorHistory} from "../hooks/door";
import {median} from "../utility/math";

export const Chart = props => {
  const {data, loading, error} = useSiteData(props);

  if (loading) return <ChartLoader />;
  if (error) return <div>error...</div>;

  const firstIndexOf = data?.findIndex(d => typeof d.counts === "number");
  const lastIndexOf = findLastIndex(data, d => typeof d.counts === "number");
  const filteredData = data?.slice(firstIndexOf, lastIndexOf + 1);

  const groupedByYear = data => {
    return data?.map(d => {
      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        year: "numeric",
      });
      return {label, ...d};
    });
  };

  const groupedByDay = data => {
    const grouped = data?.map(d => {
      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        weekday: "short",
      });
      const dayNumber = new Date(d.isoDate).getDay();
      const order = dayNumber === 0 ? 7 : dayNumber;

      return {label, order, ...d};
    });

    const groupedByDays = Object.entries(groupBy(grouped, "order"));

    return groupedByDays
      ?.map(day => {
        return {
          label: day[1][0]?.label,
          counts: median(day[1]?.filter(d => d?.counts > 0).map(d => d.counts)),
        };
      })
      .sort((a, b) => a.label - b.label);
  };

  const groupedByMonth = data => {
    const grouped = data?.map(d => {
      const order = new Date(d.isoDate).toLocaleString("fi-FI", {
        month: "numeric",
      });

      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        month: "short",
      });

      return {label, order, ...d};
    });

    const groupedByMonths = Object.entries(groupBy(grouped, "order"));

    return groupedByMonths
      ?.map(month => {
        return {
          label: month[1][0]?.order,
          order: month[1][0]?.order,
          counts: median(
            month[1]?.filter(m => m?.counts > 0).map(m => m.counts)
          ),
        };
      })
      .sort((a, b) => a.order - b.order);
  };

  const groupedData =
    props.step === "year"
      ? groupedByYear(filteredData)
      : props.step === "month"
      ? groupedByMonth(filteredData)
      : props.step === "day"
      ? groupedByDay(filteredData)
      : filteredData;

  return <RechartsBar data={groupedData} />;
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

export const DoorChart = () => {
  const {results, loading, error} = useDoorHistory();

  if (loading) return <ChartLoader />;
  if (error) return <div>error...</div>;

  const data = results
    ?.map(r => ({
      duration:
        r?.result?.uplink_message?.decoded_payload?.LAST_DOOR_OPEN_DURATION,
      status: r?.result?.uplink_message?.decoded_payload?.DOOR_OPEN_STATUS,
      isoDate: r?.result?.uplink_message?.received_at,
    }))
    .filter(p => p.duration !== undefined && p.status !== undefined);

  const groupedByHour = data => {
    const grouped = data?.map(d => {
      const label = new Date(d.isoDate).toLocaleString("fi-FI", {
        hour: "numeric",
      });
      return {label, ...d};
    });

    const groupedByLabel = Object.entries(groupBy(grouped, "label"));

    return groupedByLabel
      ?.map(h => {
        return {
          label: h[1][0]?.label,
          counts: h[1]?.length,
        };
      })
      .sort((a, b) => a.label - b.label);
  };

  return <RechartsBar data={groupedByHour(data)} />;
};

export const DurationChart = () => {
  const {results, loading, error} = useDoorHistory();

  if (loading) return <ChartLoader />;
  if (error) return <div>error...</div>;

  const data = results
    ?.map(r => ({
      duration:
        r?.result?.uplink_message?.decoded_payload?.LAST_DOOR_OPEN_DURATION,
      status: r?.result?.uplink_message?.decoded_payload?.DOOR_OPEN_STATUS,
      isoDate: r?.result?.uplink_message?.received_at,
    }))
    .filter(
      p =>
        p?.duration > 0 &&
        p?.duration < 120 &&
        p.duration &&
        p?.status !== undefined
    );

  const groupedByDuration = data => {
    const groupedByLabel = Object.entries(groupBy(data, "duration"));

    const result = groupedByLabel
      ?.map(h => {
        return {
          label: h[1][0]?.duration,
          counts: h[1]?.length,
        };
      })
      .sort((a, b) => a.label - b.label);

    return result;
  };

  return <DurationBar data={groupedByDuration(data)} />;
};
