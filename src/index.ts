import type { Dayjs } from "dayjs";
import type { Fn, TimeUnit } from "./types.js";
import * as utils from "./utils.js";

interface ITask {
  run: Fn;
  logging: (log: boolean) => ITask;
  schedule: (date: Date | Dayjs) => ITask;
  delay: (time: number, unit: TimeUnit) => ITask;
  repeat: (time: number, unit: TimeUnit) => ITask;
  cancel: () => void;
}

export const task = (name: string, fn: Fn): ITask => new Task(name, fn);

class Task implements ITask {
  public name: string;
  private _fn: Fn;
  private _log: boolean = false;
  private _date: Date | null = null;
  private _repeat: number | null = null;
  private _delay: number | null = null;
  private _cancelled: boolean = false;

  constructor(name: string, fn: Fn) {
    this.name = name;
    this._fn = fn;
  }

  async run() {
    if (this._cancelled) return;

    if (this._date && this._repeat) {
      throw new Error("Cannot schedule and repeat a task");
    }

    const delay =
      this._delay ||
      (this._date ? this._date.getTime() - new Date().getTime() : 0);

    if (this._log) {
      let logMessage = `Running task ${this.name}`;

      if (delay > 0) {
        logMessage += ` in ${delay}ms`;
      }

      if (this._repeat) {
        const formattedDuration = utils.formatDuration(this._repeat);
        logMessage += ` and repeating every ${formattedDuration}`;
      }

      console.log(logMessage);
    }

    if (delay > 0) {
      await utils.sleep(delay);
      this._delay = null;
      this._date = null;
    }

    try {
      await this._fn();
    } catch (e: any) {
      console.error(
        `Error running task ${this.name}: ${e.message || "Unknown error"}`
      );
    }

    if (this._repeat) {
      await utils.sleep(this._repeat);
      await this.run();
    }
  }

  delay(time: number, unit: TimeUnit): ITask {
    if (time < 0) throw new Error("Delay cannot be negative");

    this._delay = time * utils.timeUnits[unit];
    return this;
  }

  logging(log: boolean): ITask {
    this._log = log;
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
