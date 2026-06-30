'use client';

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;

function ensureInit() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral', // tông sáng, hợp design light của Praxis
    securityLevel: 'strict',
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
  });
  initialized = true;
}

// Render Mermaid source -> SVG ở client (island). SSR/trước-hydration hiện source
// trong khung; sau khi render xong thay bằng SVG -> không lệch hydration.
export default function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureInit();
    const id = `mmd-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => { if (!cancelled) setSvg(svg); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [code]);

  if (svg && !failed) {
    return (
      <div
        className="mermaid-rendered"
        style={{
          marginBottom: 14,
          padding: '16px 15px',
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          overflow: 'auto',
          textAlign: 'center',
        }}
        // svg do mermaid sinh + securityLevel 'strict' -> an toàn
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  // Fallback: source trong khung (khi chưa render xong hoặc lỗi parse)
  return (
    <pre
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        lineHeight: 1.6,
        background: 'var(--color-background-secondary)',
        border: '0.5px dashed var(--color-border-secondary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '13px 15px',
        marginBottom: 14,
        overflow: 'auto',
        color: 'var(--color-text-secondary)',
      }}
    >
      <code>{code}</code>
    </pre>
  );
}
