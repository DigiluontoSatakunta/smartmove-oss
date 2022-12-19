import React, {PureComponent} from "react";
import Box from "@mui/material/Box";

import {
  Bar,
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
          height: 260,
          minHeight: 260,
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
            <XAxis dataKey="timeLabel">
              <Label value="aika" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis
              type="number"
              domain={[0, "dataMax + 50"]}
              yAxisId="left"
              label={{
                value: "laitteita",
                angle: -90,
                position: "insideLeft",
              }}
            ></YAxis>
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              type="monotone"
              dataKey="value"
              name="laitteita"
              fill="#4caf50"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
