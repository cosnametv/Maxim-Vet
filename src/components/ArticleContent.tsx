import { ReactNode } from 'react';

/**
 * Lightweight renderer for the blog body authored in the admin rich-text editor.
 * Supported syntax:
 *   - Blank line          -> new paragraph
 *   - ## Subtitle         -> sub-heading
 *   - "- item"            -> bullet list
 *   - "1. item"           -> numbered list
 *   - **bold**, *italic*  -> inline emphasis
 *   - [label](https://..) -> link
 */

let keySeed = 0;
const nextKey = () => `ac-${keySeed++}`;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Match links, bold, then italic (in that order of precedence).
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const href = m[2].trim();
      nodes.push(
        <a
          key={nextKey()}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="text-emerald-700 font-semibold underline decoration-emerald-400 underline-offset-2 hover:text-emerald-600"
        >
          {m[1]}
        </a>
      );
    } else if (m[3] !== undefined) {
      nodes.push(<strong key={nextKey()}>{m[3]}</strong>);
    } else if (m[4] !== undefined) {
      nodes.push(<em key={nextKey()}>{m[4]}</em>);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function ArticleContent({ content, className }: { content?: string; className?: string }) {
  const text = (content ?? '').replace(/\r\n/g, '\n').trim();
  if (!text) return null;

  const blocks = text.split(/\n{2,}/);
  const out: ReactNode[] = [];

  blocks.forEach((block) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Bullet list block
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      out.push(
        <ul key={nextKey()} className="list-disc pl-5 space-y-1.5">
          {lines.map((l) => (
            <li key={nextKey()}>{renderInline(l.replace(/^[-*]\s+/, ''))}</li>
          ))}
        </ul>
      );
      return;
    }

    // Numbered list block
    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      out.push(
        <ol key={nextKey()} className="list-decimal pl-5 space-y-1.5">
          {lines.map((l) => (
            <li key={nextKey()}>{renderInline(l.replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      );
      return;
    }

    // Subtitle (uses the first line if it starts with ##)
    if (/^##\s+/.test(lines[0])) {
      out.push(
        <h3 key={nextKey()} className="font-serif text-xl md:text-2xl font-semibold text-emerald-950 pt-2">
          {renderInline(lines[0].replace(/^##\s+/, ''))}
        </h3>
      );
      const rest = lines.slice(1);
      if (rest.length) {
        out.push(<p key={nextKey()}>{renderInline(rest.join(' '))}</p>);
      }
      return;
    }

    // Plain paragraph
    out.push(<p key={nextKey()}>{renderInline(lines.join(' '))}</p>);
  });

  return <div className={className}>{out}</div>;
}
