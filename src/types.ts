export type TimeUnit =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years";

export type ConstructorHelper<T> = (new (...args: any) => {
  [x: string]: any;
}) &
  T;

export type Constructor<T> = ConstructorParameters<ConstructorHelper<T>>;
