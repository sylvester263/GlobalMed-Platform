import { Fragment, type CSSProperties, type ReactNode } from "react";

const REG = "®";

/** `.reg` in globals.css, inline for emails (no stylesheet there). */
const inlineRegStyle: CSSProperties = {
  fontSize: "0.5em",
  verticalAlign: "super",
  lineHeight: 0,
  marginLeft: "0.05em",
  fontWeight: "inherit",
};

/**
 * Renders every "®" in a visible string as a small raised mark (`.reg` in globals.css), as on
 * AAPC's own material. Visible HTML only: titles, meta, JSON-LD, alt text and plain-text email
 * parts keep the plain character. Safe in server and client components; `inline` styles the
 * mark inline for React Email templates.
 */
export function withReg(
  text: string | null | undefined,
  { inline = false }: { inline?: boolean } = {},
): ReactNode {
  if (!text?.includes(REG)) return text;
  const parts = text.split(REG);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        inline ? (
          <sup style={inlineRegStyle}>{REG}</sup>
        ) : (
          <sup className="reg">{REG}</sup>
        )
      ) : null}
    </Fragment>
  ));
}

/** Text-node form of `withReg`, for JSX: `<Reg>CPC® Training</Reg>`. */
export function Reg({ children }: { children: string }) {
  return <>{withReg(children)}</>;
}
