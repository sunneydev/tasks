import type { Dayjs } from "dayjs";
import type { TimeUnit } from "./types";
import * as utils from "./utils";

interface ITask {
  run: (fn: () => PromiseLike<void>) => PromiseLike<void>;
  schedule: (date: Date | Dayjs) => ITask;
  delay: (time: number, unit: TimeUnit) => ITask;
  repeat: (time: number, unit: TimeUnit) => ITask;
  cancel: () => void;
}

class Task implements ITask {
  private _fn: () => PromiseLike<void>;
  private _date: Date | null = null;
  private _repeat: number | null = null;
  private _delay: number | null = null;
  private _cancelled: boolean = false;

  constructor(fn: () => PromiseLike<void>) {
    this._fn = fn;
  }

  async run(fn: () => PromiseLike<void>) {
    if (this._cancelled) return;

    this._fn = fn;

    const delay =
      this._delay ||
      (this._date ? this._date.getTime() - new Date().getTime() : 0);

    if (delay > 0) {
      await utils.sleep(delay);
      this._delay = null;
      this._date = null;
    }

    await this._fn();

    if (this._repeat) {
      await utils.sleep(this._repeat);
      await this.run(this._fn);
    }
  }

  delay(time: number, unit: TimeUnit): ITask {
    if (time < 0) throw new Error("Delay cannot be negative");

    this._delay = time * utils.timeUnits[unit];
    return this;
  }

  schedule(date: Date | Dayjs): ITask {
    if (date < new Date()) throw new Error("Date cannot be in the past");

    this._date = date instanceof Date ? date : date.toDate();
    return this;
  }

  repeat(time: number, unit: TimeUnit): ITask {
    if (time < 0) throw new Error("repeat cannot be negative");

    this._repeat = time * utils.timeUnits[unit];
    return this;
  }

  cancel(): void {
    this._cancelled = true;
  }
}

export const task = (fn: () => PromiseLike<void>) => new Task(fn);
