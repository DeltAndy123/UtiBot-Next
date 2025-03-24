import { ClientEvents, Awaitable } from "discord.js";

export interface Listener<Event extends keyof ClientEvents> {
  event: Event;
  once?: boolean;
  execute: (...args: ClientEvents[Event]) => Awaitable<void>;
}

export function createListener<E extends keyof ClientEvents>(listener: {
  event: E;
  once?: boolean;
  execute: (...args: ClientEvents[E]) => Awaitable<void>;
}): Listener<E> {
  return listener;
}

export function isListener(
    obj: unknown,
): obj is Listener<keyof ClientEvents> {
  return (
      typeof obj === "object" &&
      obj !== null &&
      "event" in obj &&
      "execute" in obj &&
      (typeof obj.event === "string") &&
      (typeof obj.execute === "function")
  );
}