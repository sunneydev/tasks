import type { TimeUnit } from "./types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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

export const formatDuration = (ms: number) => {
  const d = dayjs.duration(ms);

  if (d.asHours() >= 1) {
    return `${Math.round(d.asHours())}h`;
  } else if (d.asMinutes() >= 1) {
    return `${Math.round(d.asMinutes())}m`;
  } else if (d.asSeconds() >= 1) {
    return `${Math.round(d.asSeconds())}s`;
  } else {
    return `${ms}ms`;
  }
};
