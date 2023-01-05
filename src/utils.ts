import type { TimeUnit } from "./types";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const timeUnits: {
  [tu in TimeUnit]: number;
} = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  weeks: 1000 * 60 * 60 * 24 * 7,
  months: 1000 * 60 * 60 * 24 * 30,
  years: 1000 * 60 * 60 * 24 * 365,
};
