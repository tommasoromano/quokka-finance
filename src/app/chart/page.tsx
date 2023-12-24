"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Add } from "@mui/icons-material";
import gspc from "../../../public/GSPC.json";
import {
  Action,
  Condition,
  Cross,
  Indicator,
  OHLC,
  Operator,
  OperatorCondition,
  Peak,
  Strategy,
  Value,
  strategyPlaceholder,
} from "@/types/strategy";
import {
  Chip,
  Option,
  Select,
  Stack,
  Card,
  Typography,
  Box,
  Button,
} from "@mui/joy";

export default function Home() {
  const ticker = "GSPC";
  const data = gspc.slice(gspc.length - 252, gspc.length - 1);

  // https://echarts.apache.org/examples/en/editor.html?c=candlestick-sh&lang=ts
  const options = {
    title: {
      text: ticker,
      left: 0,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      data: [ticker],
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: "dataMin",
      max: "dataMax",
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 50,
        end: 100,
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: ticker,
        type: "candlestick",
        data: data.map((item) => [item.open, item.close, item.low, item.high]),
        itemStyle: {
          color: "#00da3c",
          color0: "#ec0000",
          borderColor: "#00da3c",
          borderColor0: "#ec0000",
        },
      },
    ],
  };

  const [strategy, setStrategy] = useState<Strategy>(strategyPlaceholder);

  console.log(strategy);

  return (
    <Box>
      {renderStrategy(strategy)}
      {/* <ReactECharts option={options} /> */}
    </Box>
  );
}

const renderStrategy = (strategy: Strategy) => {
  return (
    <Stack>
      {strategy.actions.map((action, i) => (
        <div key={i}>{renderAction(action)}</div>
      ))}
    </Stack>
  );
};

const renderAction = (action: Action) => {
  return (
    <Stack spacing={1}>
      <Typography>Condition</Typography>
      {renderCondition(action.condition)}
      <Typography>Price</Typography>
      {renderValue(action.price)}
    </Stack>
  );
};

const renderCondition = (condition: Condition) => {
  return (
    <Card>
      <Stack spacing={1}>
        <Stack direction={"row"} spacing={1}>
          <Typography>Condition Group</Typography>
          <Select value={condition.operator}>
            <Option value="and">And</Option>
            <Option value="or">Or</Option>
          </Select>
        </Stack>
        {condition.conditions.map((c, i) =>
          c instanceof Operator ? (
            <div key={i}>{renderOperator(c)}</div>
          ) : (
            <div key={i}>{renderCondition(c)}</div>
          )
        )}
        <Stack direction={"row"} spacing={1}>
          <Button startDecorator={<Add />}>Add Operator</Button>
          <Button startDecorator={<Add />}>Add Condition Group</Button>
        </Stack>
      </Stack>
    </Card>
  );
};

const renderOperator = (operator: Operator) => {
  const operators = {
    crossOver: "Cross Over",
    crossUnder: "Cross Under",
    peakMin: "Peak Minimum",
    peakMax: "Peak Maximum",
    greater: "Greater",
    less: "Less",
    equal: "Equal",
    notEqual: "Not Equal",
    greaterEqual: "Greater Equal",
    lessEqual: "Less Equal",
  };

  const operatorToKey = (operator: Operator) => {
    if (operator instanceof Cross) {
      return operator.type === "over"
        ? operators.crossOver
        : operators.crossUnder;
    } else if (operator instanceof Peak) {
      return operator.type === "min" ? operators.peakMin : operators.peakMax;
    } else if (operator instanceof OperatorCondition) {
      switch (operator.type) {
        case ">":
          return operators.greater;
        case "<":
          return operators.less;
        case "==":
          return operators.equal;
        case "!=":
          return operators.notEqual;
        case ">=":
          return operators.greaterEqual;
        case "<=":
          return operators.lessEqual;
      }
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      {operator instanceof Cross && renderValue(operator.a)}
      {operator instanceof Peak && renderValue(operator.a)}
      <Select value={operatorToKey(operator)}>
        {Object.values(operators).map((v) => (
          <Option value={v} key={v}>
            {v}
          </Option>
        ))}
      </Select>
      {operator instanceof Cross && renderValue(operator.b)}
    </Stack>
  );
};

const renderValue = (value: Value) => {
  const values = {
    indicator: "Indicator",
    ohlc: "OHLC",
    constant: "Constant",
  };
  const valueToKey = (value: Value) => {
    if (value instanceof Indicator) {
      return values.indicator;
    } else if (value instanceof OHLC) {
      return values.ohlc;
    } else if (value instanceof OperatorCondition) {
      return values.constant;
    }
  };

  return (
    <Card>
      <Stack direction={"row"} spacing={1}>
        <Select value={valueToKey(value)}>
          {Object.values(values).map((v) => (
            <Option value={v} key={v}>
              {v}
            </Option>
          ))}
        </Select>
        {value instanceof Indicator && (
          <Stack direction={"row"} spacing={1}>
            <Select value={value.name}>
              <Option value="sma">SMA</Option>
            </Select>
            <Select value={value.output}>
              <Option value={0}>0</Option>
            </Select>
          </Stack>
        )}
        {value instanceof OHLC && (
          <Select value={value.type}>
            <Option value="open">Open</Option>
            <Option value="high">High</Option>
            <Option value="low">Low</Option>
            <Option value="close">Close</Option>
          </Select>
        )}
      </Stack>
    </Card>
  );
};
