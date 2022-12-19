import React, {PureComponent} from "react";
import Box from "@mui/material/Box";

import {
  Bar,
  Line,
  YAxis,
  Label,
  XAxis,
  Legend,
  Tooltip,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
export default class RechartsBar extends PureComponent {
  render() {
    return (
      <Box
        sx={{
          width: "100%",
          height: 320,
          margin: 0,
        }}
        component="figure"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={320}
            height={320}
            data={this.props?.data || []}
            style={{fontSize: "12px"}}
            margin={{right: 20}}
          >
            <CartesianGrid />
            <XAxis dataKey="time">
              <Label
                value="kellonaika (tunti)"
                offset={-5}
                position="insideBottom"
              />
            </XAxis>
            <YAxis
              unit={" °C"}
              type="number"
              domain={[0, "dataMax + 2"]}
              yAxisId="left"
              label={{
                value: "lämpötila (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            ></YAxis>
            <YAxis
              unit={" mm"}
              yAxisId="right"
              orientation="right"
              type="number"
              domain={[0, "dataMax + 2"]}
              label={{
                value: "sademäärä (mm)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip labelFormatter={label => `Sää kello ${label}.00`} />
            <Legend />
            <Bar
              yAxisId="right"
              type="monotone"
              dataKey="precipitation"
              name="sademäärä"
              fill="#1976d2"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name="lämpötila"
              stroke="#4caf50"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
