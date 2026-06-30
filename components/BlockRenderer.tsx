import type { ReactNode } from 'react';
import type { Block } from '@/lib/types';
import MermaidDiagram from './MermaidDiagram';
import CodeBlock from './CodeBlock';

// Markdown-lite: parse **đậm**, *nghiêng* và `inline-code` ra React nodes (an toàn, không innerHTML).
// Không lồng nhau (parser 1 cấp): tránh viết `code` bên trong **bold**.
function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*.+?\*\*|\*[^*]+\*|`[^`]+`)/g);
  return tokens.map((tok, i) => {
    if (/^\*\*.+\*\*$/.test(tok)) {
      return (
        <strong key={i} style={{ fontWeight: 600 }}>
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (/^\*[^*]+\*$/.test(tok)) {
      return <em key={i}>{tok.slice(1, -1)}</em>;
    }
    if (/^`[^`]+`$/.test(tok)) {
      return (
        <code
          key={i}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88em',
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 4,
            padding: '1px 5px',
          }}
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return tok;
  });
}

const CALLOUT_STYLE: Record<
  NonNullable<Block['variant']>,
  { bg: string; border: string; icon: string; iconColor: string; label: string; labelColor: string }
> = {
  info: {
    bg: 'var(--color-background-info)',
    border: 'var(--color-text-info)',
    icon: 'ti-bulb',
    iconColor: 'var(--color-text-info)',
    label: 'Liên tưởng',
    labelColor: 'var(--color-text-info)',
  },
  tip: {
    bg: 'var(--color-background-info)',
    border: 'var(--color-text-info)',
    icon: 'ti-info-circle',
    iconColor: 'var(--color-text-info)',
    label: 'Mẹo',
    labelColor: 'var(--color-text-info)',
  },
  warning: {
    bg: 'var(--color-background-warning)',
    border: 'var(--color-border-warning)',
    icon: 'ti-alert-triangle',
    iconColor: 'var(--color-text-warning)',
    label: 'Cạm bẫy',
    labelColor: 'var(--color-text-warning)',
  },
};

function Label({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--color-text-tertiary)',
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 13 }} />
      {text}
    </div>
  );
}

function OneBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'prose':
      return (
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>
          {renderInline(block.content)}
        </p>
      );

    case 'code':
      return (
        <CodeBlock code={block.content} lang={block.lang} filename={block.filename} kind="code" />
      );

    case 'command':
      return (
        <CodeBlock
          code={block.content}
          lang={block.lang ?? 'bash'}
          filename={block.label}
          kind="command"
        />
      );

    case 'callout': {
      const s = CALLOUT_STYLE[block.variant ?? 'info'];
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            gap: 9,
            background: s.bg,
            borderLeft: `2px solid ${s.border}`,
            borderRadius: 'var(--border-radius-md)',
            padding: '11px 13px',
            marginBottom: 14,
          }}
        >
          <i className={`ti ${s.icon}`} style={{ fontSize: 17, color: s.iconColor, marginTop: 1 }} />
          <span style={{ fontSize: 13.5, lineHeight: 1.65 }}>
            <b style={{ fontWeight: 500, color: s.labelColor }}>{s.label}:</b> {renderInline(block.content)}
          </span>
        </div>
      );
    }

    case 'resource':
      return (
        <a
          href={block.url}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13.5,
            color: 'var(--color-text-info)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '9px 12px',
            marginBottom: 14,
          }}
        >
          <i className="ti ti-external-link" style={{ fontSize: 15 }} />
          {block.label ?? block.url}
        </a>
      );

    case 'diagram':
      return (
        <div style={{ marginBottom: 14 }}>
          <Label icon="ti-sitemap" text="Sơ đồ" />
          <MermaidDiagram code={block.content} />
        </div>
      );

    case 'concept-link':
      return (
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
          <span
            style={{
              color: 'var(--color-text-info)',
              borderBottom: '1px dotted var(--color-text-info)',
            }}
          >
            {block.content}
          </span>
        </p>
      );

    default:
      return null;
  }
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <OneBlock key={i} block={block} />
      ))}
    </>
  );
}
