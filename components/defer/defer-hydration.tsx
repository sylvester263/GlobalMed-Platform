"use client";

import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Deferred hydration (2026-10-01 performance work). The server renders the component's full
 * HTML as usual. In the browser its code loads, and React hydrates it, only later:
 * - "load": after the page's load event, when the browser is idle (above-the-fold widgets
 *   whose first frame is already right in the server HTML, e.g. the hero slider);
 * - "visible": when it comes within 400px of the screen (below-the-fold sections).
 * Either way it also starts loading the moment the visitor points at, touches or tabs into it,
 * and a button click that lands before the code is ready is replayed once it is. Until then
 * React keeps the server HTML untouched (a dehydrated Suspense boundary), so nothing moves or
 * disappears. On a client-side navigation there is no server HTML to keep, so the code loads
 * at once.
 */
export type DeferWhen = "load" | "visible";

const interactionEvents = ["pointerover", "focusin", "touchstart", "pointerdown"] as const;

function afterLoad(): Promise<void> {
  return new Promise((resolve) => {
    const idle = () => {
      if ("requestIdleCallback" in window) requestIdleCallback(() => resolve(), { timeout: 2000 });
      else setTimeout(resolve, 200);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

function whenNear(el: Element): Promise<void> {
  return new Promise((resolve) => {
    if (!("IntersectionObserver" in window)) return resolve();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          resolve();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
  });
}

function whenTouched(el: Element): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      for (const type of interactionEvents) el.removeEventListener(type, done);
      resolve();
    };
    for (const type of interactionEvents) el.addEventListener(type, done, { passive: true });
  });
}

export function deferHydration<P extends object>(
  name: string,
  load: () => Promise<ComponentType<P>>,
  when: DeferWhen,
) {
  let Lazy: LazyExoticComponent<ComponentType<P>> | undefined;
  let hydrated = false;
  let pendingClick: HTMLElement | null = null;
  let stopCatching = () => {};

  /** Rendered next to the component; its effect runs once the boundary has hydrated. */
  function HydratedSignal() {
    useEffect(() => {
      hydrated = true;
      stopCatching();
      const target = pendingClick;
      pendingClick = null;
      if (target?.isConnected) target.click();
    }, []);
    return null;
  }

  function Deferred(props: P) {
    Lazy ??= lazy(async () => {
      if (typeof window !== "undefined") {
        // Present in the DOM only while hydrating server HTML; absent on client navigation.
        const el = document.querySelector(`[data-defer="${name}"]`);
        if (el?.firstElementChild) {
          // A button click that lands before hydration is caught on window (before React's
          // root listener sees it) and replayed once, after hydration, so it never counts twice.
          const catchClick = (event: Event) => {
            if (hydrated || !(event.target instanceof Element) || !el.contains(event.target)) {
              return;
            }
            const button = event.target.closest<HTMLElement>("button, [role=button], [role=tab]");
            if (!button) return;
            event.stopImmediatePropagation();
            event.preventDefault();
            pendingClick = button;
          };
          window.addEventListener("click", catchClick, { capture: true });
          stopCatching = () => window.removeEventListener("click", catchClick, { capture: true });
          await Promise.race([when === "load" ? afterLoad() : whenNear(el), whenTouched(el)]);
        }
      }
      const Component = await load();
      const WithSignal = (p: P) => (
        <>
          <Component {...p} />
          <HydratedSignal />
        </>
      );
      return { default: WithSignal };
    });
    const Component = Lazy;
    return (
      // "load" islands don't need a box to observe, so they don't affect layout at all.
      <div data-defer={name} className={when === "load" ? "contents" : undefined}>
        <Suspense fallback={null}>
          <Component {...props} />
        </Suspense>
      </div>
    );
  }
  Deferred.displayName = `Deferred(${name})`;
  return Deferred;
}
