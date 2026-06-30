'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API có thể bị chặn ở một số ngữ cảnh — bỏ qua im lặng
    }
  };

  return (
    <button type="button" onClick={onCopy} className="cb-copy" aria-label="Sao chép">
      <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} style={{ fontSize: 14 }} />
      <span>{copied ? 'Đã chép' : 'Chép'}</span>
    </button>
  );
}
