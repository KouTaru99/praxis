import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLabs, getLabByRoute } from '@/lib/content';
import { CATEGORY_LABEL, COMPLEXITY_LABEL } from '@/lib/types';

export function generateStaticParams() {
  return getAllLabs().map((l) => ({ category: l.category, lab: l.id }));
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ category: string; lab: string }>;
}) {
  const { category, lab: labId } = await params;
  const lab = getLabByRoute(category, labId);
  if (!lab) notFound();

  const totalSteps = lab.stages.reduce((n, s) => n + s.steps.length, 0);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 28 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          marginBottom: 18,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-home" style={{ fontSize: 15 }} />
          Trang chủ
        </Link>
        <i className="ti ti-chevron-right" style={{ fontSize: 12 }} />
        <span style={{ color: 'var(--color-text-primary)' }}>{CATEGORY_LABEL[category] ?? category}</span>
      </div>

      <h1 style={{ fontSize: 22, margin: '0 0 6px' }}>{lab.title}</h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: '0 0 14px' }}>
        {lab.description}
      </p>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 22, fontSize: 12 }}>
        <Meta icon="ti-chart-bar">{COMPLEXITY_LABEL[lab.complexity]}</Meta>
        <Meta icon="ti-clock">~{lab.est_hours} giờ</Meta>
        <Meta icon="ti-stairs">
          {lab.stages.length} chặng · {totalSteps} bước
        </Meta>
        {lab.repo_solution && (
          <a
            href={lab.repo_solution}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: 'var(--color-text-info)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '3px 9px',
            }}
          >
            <i className="ti ti-brand-github" style={{ fontSize: 14 }} />
            Repo mẫu lời giải
          </a>
        )}
      </div>

      {lab.stages.map((stage) => (
        <div key={stage.id} style={{ display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'var(--color-background-tertiary)',
                border: '0.5px solid var(--color-border-secondary)',
              }}
            />
            <span style={{ flex: 1, width: 2, background: 'var(--color-border-tertiary)' }} />
          </div>
          <div style={{ paddingBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 8px', color: 'var(--color-text-secondary)' }}>
              Chặng {stage.order} · {stage.title}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {stage.steps.map((step) => (
                <Link
                  key={step.id}
                  href={`/${category}/${labId}/${stage.id}/${step.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '6px 11px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <i className="ti ti-file-text" style={{ fontSize: 15, color: 'var(--color-text-tertiary)' }} />
                  {step.title}
                </Link>
              ))}
              {stage.steps.length === 0 && (
                <span style={{ fontSize: 12.5, color: 'var(--color-text-tertiary)' }}>
                  (đang biên soạn)
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Meta({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        color: 'var(--color-text-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '3px 9px',
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 14 }} />
      {children}
    </span>
  );
}
