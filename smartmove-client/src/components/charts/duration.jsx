import React, {PureComponent} from "react";
import Box from "@mui/material/Box";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

export default class DurationBar extends PureComponent {
  render() {
    return (
      <Box
        sx={{
          width: "100%",
          height: 260,
          minHeight: 260,
          margin: 0,
        }}
        component="figure"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            width={300}
            height={150}
            style={{fontSize: "12px"}}
            margin={{
              right: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="label" name="avoinna" unit="s" />
            <YAxis type="number" dataKey="counts" name="määrä" unit="kpl" />
            <Tooltip cursor={{strokeDasharray: "3 3"}} />
            <Scatter
              name="avoinna"
              data={this.props?.data || []}
              fill="#8884d8"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
