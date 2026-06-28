import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLabs, getLabByRoute, getStep, flatSteps } from '@/lib/content';
import { CATEGORY_LABEL, COMPLEXITY_LABEL } from '@/lib/types';
import BlockRenderer from '@/components/BlockRenderer';

export function generateStaticParams() {
  return getAllLabs().flatMap((lab) =>
    lab.stages.flatMap((stage) =>
      stage.steps.map((step) => ({
        category: lab.category,
        lab: lab.id,
        stage: stage.id,
        step: step.id,
      }))
    )
  );
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ category: string; lab: string; stage: string; step: string }>;
}) {
  const { category, lab: labId, stage: stageId, step: stepId } = await params;
  const found = getStep(category, labId, stageId, stepId);
  if (!found) notFound();
  const { lab, stage, step } = found;

  const flat = flatSteps(lab);
  const idx = flat.findIndex((x) => x.step.id === step.id && x.stage.id === stage.id);
  const prev = idx > 0 ? flat[idx - 1] : undefined;
  const next = idx < flat.length - 1 ? flat[idx + 1] : undefined;

  return (
    <div style={{ padding: 22 }}>
      <div
        style={{
          maxWidth: 940,
          margin: '0 auto',
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* topbar / breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '10px 16px',
            borderBottom: '0.5px solid var(--color-border-tertiary)',
            background: 'var(--color-background-secondary)',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-home" style={{ fontSize: 15 }} />
              Trang chủ
            </Link>
            <i className="ti ti-chevron-right" style={{ fontSize: 12 }} />
            <Link href={`/${category}/${labId}`}>{lab.title}</Link>
            <i className="ti ti-chevron-right" style={{ fontSize: 12 }} />
            Chặng {stage.order}
            <i className="ti ti-chevron-right" style={{ fontSize: 12 }} />
            <span style={{ color: 'var(--color-text-primary)' }}>{step.title}</span>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '248px minmax(0,1fr)' }}>
          {/* nav trái */}
          <div
            style={{
              background: 'var(--color-background-secondary)',
              borderRight: '0.5px solid var(--color-border-tertiary)',
              padding: '15px 13px',
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 3 }}>{lab.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)', marginBottom: 14 }}>
              {COMPLEXITY_LABEL[lab.complexity]} · ~{lab.est_hours} giờ
            </div>

            {lab.stages.map((st) => (
              <div key={st.id} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    margin: '0 0 6px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Chặng {st.order} · {st.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4 }}>
                  {st.steps.map((s) => {
                    const active = s.id === step.id && st.id === stage.id;
                    return (
                      <Link
                        key={s.id}
                        href={`/${category}/${labId}/${st.id}/${s.id}`}
                        style={{
                          fontSize: 13,
                          padding: '6px 9px',
                          borderRadius: 'var(--border-radius-md)',
                          color: active ? 'var(--color-text-info)' : 'var(--color-text-secondary)',
                          background: active ? 'var(--color-background-info)' : 'transparent',
                          border: active
                            ? '0.5px solid var(--color-border-info)'
                            : '0.5px solid transparent',
                        }}
                      >
                        {s.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* panel phải */}
          <div style={{ padding: '22px 26px' }}>
            <h1 style={{ fontSize: 22, marginBottom: 18 }}>{step.title}</h1>

            {/* Mục tiêu */}
            <SectionHead icon="ti-target" text="Mục tiêu" />
            <p style={{ fontSize: 15, lineHeight: 1.7, margin: '0 0 12px' }}>{step.goal}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              <InfoRow icon="ti-package" bg="var(--color-background-secondary)" border="var(--color-border-tertiary)">
                <b style={{ fontWeight: 500 }}>Sản phẩm của bước:</b> {step.deliverable}
              </InfoRow>
              <InfoRow icon="ti-eye" bg="var(--color-background-info)" border="var(--color-border-info)">
                <b style={{ fontWeight: 500 }}>Sau bước này bạn sẽ thấy:</b> {step.outcome_preview}
              </InfoRow>
            </div>

            {/* Hướng dẫn */}
            <SectionHead icon="ti-book" text="Hướng dẫn" />
            <BlockRenderer blocks={step.blocks} />

            {/* footer nav */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: '0.5px solid var(--color-border-tertiary)',
                paddingTop: 16,
                marginTop: 18,
                flexWrap: 'wrap',
              }}
            >
              {prev ? (
                <NavBtn href={`/${category}/${labId}/${prev.stage.id}/${prev.step.id}`} dir="prev">
                  {prev.step.title}
                </NavBtn>
              ) : (
                <span />
              )}
              {next ? (
                <NavBtn href={`/${category}/${labId}/${next.stage.id}/${next.step.id}`} dir="next" primary>
                  Bước tiếp: {next.step.title}
                </NavBtn>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, margin: '0 0 10px' }}>
      <i className={`ti ${icon}`} style={{ fontSize: 18, color: 'var(--color-text-info)' }} />
      {text}
    </div>
  );
}

function InfoRow({
  icon,
  bg,
  border,
  children,
}: {
  icon: string;
  bg: string;
  border: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'start',
        gap: 9,
        background: bg,
        border: `0.5px solid ${border}`,
        borderRadius: 'var(--border-radius-md)',
        padding: '10px 13px',
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 17, color: 'var(--color-text-info)', marginTop: 1 }} />
      <span style={{ fontSize: 13.5, lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

function NavBtn({
  href,
  dir,
  primary,
  children,
}: {
  href: string;
  dir: 'prev' | 'next';
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: `0.5px solid ${primary ? 'var(--color-border-info)' : 'var(--color-border-secondary)'}`,
        color: primary ? 'var(--color-text-info)' : 'var(--color-text-primary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '7px 13px',
        fontSize: 13,
      }}
    >
      {dir === 'prev' && <i className="ti ti-arrow-left" />}
      {children}
      {dir === 'next' && <i className="ti ti-arrow-right" />}
    </Link>
  );
}
