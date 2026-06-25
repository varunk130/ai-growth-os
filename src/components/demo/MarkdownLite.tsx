import { Fragment, type ReactNode } from "react";

// Minimal, safe markdown-ish renderer for the curated asset bodies.
// Supports: fenced ``` code blocks, # / ## headings, **bold**, `inline code`,
// and preserves line breaks. No raw HTML is ever interpreted.

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // split on `code` first, then **bold** within non-code segments
  const codeParts = text.split(/(`[^`]+`)/g);
  codeParts.forEach((part, ci) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      nodes.push(
        <code key={`${keyBase}-c${ci}`} className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[0.85em] text-teal">
          {part.slice(1, -1)}
        </code>,
      );
      return;
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    boldParts.forEach((bp, bi) => {
      if (bp.startsWith("**") && bp.endsWith("**") && bp.length > 2) {
        nodes.push(
          <strong key={`${keyBase}-b${ci}-${bi}`} className="font-semibold text-white">
            {bp.slice(2, -2)}
          </strong>,
        );
      } else if (bp) {
        nodes.push(<Fragment key={`${keyBase}-t${ci}-${bi}`}>{bp}</Fragment>);
      }
    });
  });
  return nodes;
}

export function MarkdownLite({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <pre
          key={key++}
          className="my-2 overflow-x-auto rounded-lg border border-white/[0.06] bg-ink-950/70 p-3 font-mono text-[12px] leading-relaxed text-slate-300"
        >
          {buf.join("\n")}
        </pre>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h4 key={key++} className="mt-3 font-display text-sm font-semibold text-white">
          {renderInline(line.slice(3), `h${key}`)}
        </h4>,
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(
        <h3 key={key++} className="mt-1 font-display text-base font-semibold text-white">
          {renderInline(line.slice(2), `h${key}`)}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.trim() === "") {
      blocks.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }

    // indented (code-ish) line → monospace row
    if (line.startsWith("    ")) {
      blocks.push(
        <pre key={key++} className="overflow-x-auto font-mono text-[12px] leading-relaxed text-teal/90">
          {line.trim()}
        </pre>,
      );
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="text-[13.5px] leading-relaxed text-slate-300">
        {renderInline(line, `p${key}`)}
      </p>,
    );
    i++;
  }

  return <div className={`space-y-0.5 ${className}`}>{blocks}</div>;
}
