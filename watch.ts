import { getOwner, createRoot, createEffect, on } from "solid-js";

export function watch(source, cb) {
  if (getOwner()) {
    createEffect(on(source, cb));
    return () => {};
  }

  return createRoot(dispose => {
    createEffect(on(source, cb));
    return dispose;
  });
}
