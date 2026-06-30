import { codeToHtml } from 'shiki';
import CopyButton from './CopyButton';

// Map lang trong YAML -> grammar Shiki. Lang lạ/không hỗ trợ -> 'text'.
const LANG_MAP: Record<string, string> = {
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  json: 'json',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  prisma: 'prisma',
  dockerfile: 'docker',
  docker: 'docker',
  nginx: 'nginx',
  markdown: 'markdown',
  md: 'markdown',
  gitignore: 'text',
  text: 'text',
};

const LABELS: Record<'code' | 'command', string> = {
  code: 'Mã nguồn',
  command: 'Terminal',
};

export default async function CodeBlock({
  code,
  lang,
  filename,
  kind = 'code',
}: {
  code: string;
  lang?: string;
  filename?: string;
  kind?: 'code' | 'command';
}) {
  const shikiLang = LANG_MAP[(lang ?? '').toLowerCase()] ?? 'text';
  let html: string;
  try {
    html = await codeToHtml(code, { lang: shikiLang, theme: 'github-dark-default' });
  } catch {
    html = await codeToHtml(code, { lang: 'text', theme: 'github-dark-default' });
  }

  const headLabel = filename ?? LABELS[kind];
  const headIcon = kind === 'command' ? 'ti-terminal-2' : 'ti-file-code';

  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span className="codeblock-head-left">
          <i className={`ti ${headIcon}`} style={{ fontSize: 14 }} />
          <span>{headLabel}</span>
        </span>
        <CopyButton text={code} />
      </div>
      <div className="codeblock-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
