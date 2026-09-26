import { site, type SocialNetwork } from "@/lib/site";

/** Simple brand glyphs (lucide-react ships no brand icons). 24 × 24, currentColor. */
const glyphs: Record<SocialNetwork, React.ReactNode> = {
  facebook: (
    <path d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3l-1.4-.1c-2 0-2.7.8-2.7 2.6V12h3.9l-.7 3.7h-3.2v8.2A12 12 0 1 0 9.1 23.7Z" />
  ),
  instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.3" />
    </>
  ),
  linkedin: (
    <path d="M20.4 20.5h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1Zm1.8 13.1H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
  ),
  youtube: (
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  ),
  x: (
    <path d="M18.9 1.2h3.7l-8 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.2H4.3l13.3 17.5Z" />
  ),
};

/** Social profile links. Hidden until the client supplies the links (lib/site.ts). */
export function SocialIcons() {
  const links = site.social.filter((s) => s.href);
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="GlobalMed on social media">
      {links.map((s) => (
        <li key={s.network}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-sky hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
              {glyphs[s.network]}
            </svg>
            <span className="sr-only">{s.label} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
