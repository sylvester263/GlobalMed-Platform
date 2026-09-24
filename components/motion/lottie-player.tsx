"use client";

import type { DotLottie } from "@lottiefiles/dotlottie-react";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

// Lazy: the dotLottie runtime is only downloaded when a player nears the viewport.
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false },
);

type LottiePlayerProps = {
  /**
   * `.lottie` file under /public/motion. Omit until the asset is delivered: the poster shows
   * and the ~165 kB dotLottie runtime is never downloaded.
   */
  src?: string;
  /** Static poster under /public/motion/posters, shown until loaded and for reduced motion. */
  poster: string;
  /** Describes what the animation shows; empty string if purely decorative. */
  alt: string;
  width: number;
  height: number;
  loop?: boolean;
  className?: string;
};

/**
 * dotLottie player (docs/15 §7–8): reserves its box (CLS 0), loads near the viewport,
 * pauses off-screen, shows the poster only for reduced motion, and gives looping
 * animations a pause control.
 */
export function LottiePlayer({
  src,
  poster,
  alt,
  width,
  height,
  loop = true,
  className,
}: LottiePlayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [player, setPlayer] = useState<DotLottie | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Load the runtime when the browser is idle, so it never competes with first paint.
        if (entry.isIntersecting && src) {
          if ("requestIdleCallback" in window) window.requestIdleCallback(() => setNear(true));
          else setNear(true);
        }
        if (player) {
          if (entry.isIntersecting && !paused) player.play();
          else player.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, player, paused, src]);

  useEffect(() => {
    if (!player) return;
    const onLoad = () => setLoaded(true);
    player.addEventListener("load", onLoad);
    return () => player.removeEventListener("load", onLoad);
  }, [player]);

  function togglePause() {
    if (!player) return;
    if (paused) player.play();
    else player.pause();
    setPaused(!paused);
  }

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes={`${width}px`}
        className={cn("object-contain", loaded && !reduced && "invisible")}
      />
      {!reduced && near && src && (
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay
          dotLottieRefCallback={setPlayer}
          className="absolute inset-0"
        />
      )}
      {!reduced && loop && loaded && (
        <button
          type="button"
          onClick={togglePause}
          aria-label={paused ? "Play animation" : "Pause animation"}
          className="absolute right-2 bottom-2 flex size-11 items-center justify-center rounded-full border bg-card/90 text-foreground shadow-sm hover:bg-card"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      )}
    </div>
  );
}
