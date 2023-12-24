import { useState } from "react";

export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export abstract class Value {
  abstract calculate(data: HistoricalData[]): number[];
}

export class Indicator extends Value {
  name: string;
  output: number;
  params?: { [key: string]: number };

  constructor(
    name: string,
    output: number,
    params?: { [key: string]: number }
  ) {
    super();
    this.name = name;
    this.output = output;
    this.params = params;
  }

  calculate(data: HistoricalData[]): number[] {
    return [];
  }
}
export class OHLC extends Value {
  type: "open" | "high" | "low" | "close";

  constructor(type: "open" | "high" | "low" | "close") {
    super();
    this.type = type;
  }

  calculate(data: HistoricalData[]): number[] {
    return data.map((item) => item[this.type]);
  }
}

export class Constant extends Value {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  calculate(data: HistoricalData[]): number[] {
    return data.map((item) => this.value);
  }
}

export abstract class Operator {
  abstract calculate(data: HistoricalData[]): boolean[];
}
export class Peak extends Operator {
  a: Value;
  type: "max" | "min";

  constructor(a: Value, type: "max" | "min") {
    super();
    this.a = a;
    this.type = type;
  }
  calculate(data: HistoricalData[]): boolean[] {
    return [];
  }
}
export class Cross extends Operator {
  a: Value;
  b: Value;
  type: "over" | "under";

  constructor(a: Value, b: Value, type: "over" | "under") {
    super();
    this.a = a;
    this.b = b;
    this.type = type;
  }
  calculate(data: HistoricalData[]): boolean[] {
    return [];
  }
}
export class OperatorCondition extends Operator {
  a: Operator;
  b: Operator;
  type: ">" | "<" | ">=" | "<=" | "==" | "!=";

  constructor(
    a: Operator,
    b: Operator,
    type: ">" | "<" | ">=" | "<=" | "==" | "!="
  ) {
    super();
    this.a = a;
    this.b = b;
    this.type = type;
  }

  calculate(data: HistoricalData[]): boolean[] {
    return [];
  }
}

export class Condition {
  conditions: (Condition | Operator)[];
  operator: "and" | "or";

  constructor(operator: "and" | "or", conditions: (Condition | Operator)[]) {
    this.conditions = conditions;
    this.operator = operator;
  }

  calculate(data: HistoricalData[]): boolean[] {
    return [];
  }
}

export abstract class Action {
  condition: Condition;
  price: Value;

  constructor(condition: Condition, price: Value) {
    this.condition = condition;
    this.price = price;
  }
}
export class Buy extends Action {}
export class Sell extends Action {}

export class Strategy {
  actions: Action[];

  constructor(actions: Action[]) {
    this.actions = actions;
  }
}

export const indicatorPlaceholder = new Indicator("sma", 0);
export const indicatorPlaceholder1 = new Indicator("sma", 0);
export const ohlcPlaceholder = new OHLC("close");
export const crossPlaceholder = new Cross(
  indicatorPlaceholder,
  ohlcPlaceholder,
  "over"
);
export const conditionPlaceholder = new Condition("and", [crossPlaceholder]);
export const actionPlaceholder = new Buy(conditionPlaceholder, ohlcPlaceholder);
export const strategyPlaceholder = new Strategy([actionPlaceholder]);
