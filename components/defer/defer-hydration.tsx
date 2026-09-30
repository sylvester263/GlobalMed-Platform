"use client";

import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Deferred hydration (2026-10-01 performance work). The server renders the component's full
 * HTML as usual. In the browser its code loads, and React hydrates it, only later:
 * - "load": after the page's load event, when the browser is idle (above-the-fold widgets
 *   whose first frame is already right in the server HTML, e.g. the hero slider);
 * - "visible": when it comes within 400px of the screen (below-the-fold sections).
 * Until then React keeps the server HTML untouched (a dehydrated Suspense boundary), so
 * nothing moves or disappears. On a client-side navigation there is no server HTML to keep,
 * so the code loads at once.
 */
export type DeferWhen = "load" | "visible";

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

export function deferHydration<P extends object>(
  name: string,
  load: () => Promise<ComponentType<P>>,
  when: DeferWhen,
) {
  let Lazy: LazyExoticComponent<ComponentType<P>> | undefined;

  function Deferred(props: P) {
    Lazy ??= lazy(async () => {
      if (typeof window !== "undefined") {
        // Present in the DOM only while hydrating server HTML; absent on client navigation.
        const el = document.querySelector(`[data-defer="${name}"]`);
        if (el?.firstElementChild) await (when === "load" ? afterLoad() : whenNear(el));
      }
      return { default: await load() };
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
