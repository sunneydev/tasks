# tasks

## Install

```bash
npm install @sunney/tasks
```

## Usage

```ts
import { task } from '@sunney/tasks';

// create a task
task(async () => {
  await fetch(...)
})

// delay a task for 5 seconds
task(async () => {
  await fetch(...)
}).delay(5, "seconds")

// repeat a task every 5 seconds
task(async () => {
  await fetch(...)
}).repeat(5, "seconds")

// schedule a task to run at 12:00:00
task(async () => {
  await fetch(...)
}).schedule(new Date("12:00:00"))
```
