import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const components: Components = {
  h2: ({ children }) => <h2 className="mt-12 mb-4 text-2xl first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl">{children}</h3>,
  p: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-md border-l-4 border-teal bg-mint px-5 py-4 font-serif text-lg [&>p]:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10" />,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary-hover"
      >
        {children}
      </Link>
    ) : (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className="text-primary underline underline-offset-4 hover:text-primary-hover"
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ),
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b bg-ledger px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b px-4 py-2">{children}</td>,
};

/**
 * Renders Markdown content (blog, legal). rehype-sanitize strips raw HTML and scripts, so
 * admin-editable content stays safe once it moves to the CMS (docs/11 §4).
 */
export function Prose({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div className={cn("max-w-prose text-base", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
