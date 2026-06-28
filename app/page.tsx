import Link from 'next/link';
import { getAllLabs } from '@/lib/content';
import { CATEGORY_LABEL, COMPLEXITY_LABEL, type Lab } from '@/lib/types';

const COMPLEXITY_DOT: Record<Lab['complexity'], string> = {
  'co-ban': 'var(--d-basic)',
  'trung-cap': 'var(--d-mid)',
  'nang-cao': 'var(--d-adv)',
};

const CATEGORY_ICON: Record<string, string> = {
  dev: 'ti-code',
  pm: 'ti-clipboard-list',
  ba: 'ti-file-search',
};

const CATEGORY_SUB: Record<string, string> = {
  dev: 'lập trình theo quy trình PTPM',
  pm: 'quản lý dự án',
  ba: 'phân tích nghiệp vụ',
};

function stepCount(lab: Lab) {
  return lab.stages.reduce((n, s) => n + s.steps.length, 0);
}

function LabCard({ lab }: { lab: Lab }) {
  return (
    <Link
      href={`/${lab.category}/${lab.id}`}
      style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '15px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
        <span style={{ fontSize: 15.5, fontWeight: 500 }}>{lab.title}</span>
        <span
          style={{
            fontSize: 11.5,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: 'var(--color-text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              display: 'inline-block',
              background: COMPLEXITY_DOT[lab.complexity],
            }}
          />
          {COMPLEXITY_LABEL[lab.complexity]}
        </span>
      </div>
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.65,
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}
      >
        {lab.description}
      </p>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <Tag icon="ti-clock">~{lab.est_hours} giờ</Tag>
        <Tag icon="ti-stairs">
          {lab.stages.length} chặng · {stepCount(lab)} bước
        </Tag>
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 13,
          color: 'var(--color-text-info)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
        Bắt đầu từ Chặng 1
      </div>
    </Link>
  );
}

function Tag({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        color: 'var(--color-text-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '3px 9px',
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 13 }} />
      {children}
    </span>
  );
}

export default function HomePage() {
  const labs = getAllLabs();
  const categories = Array.from(new Set(labs.map((l) => l.category)));

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 28 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 22,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <i className="ti ti-tool" style={{ fontSize: 22, color: 'var(--color-text-info)' }} />
          <span style={{ fontSize: 19, fontWeight: 500 }}>Praxis</span>
          <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>— học bằng cách làm</span>
        </span>
      </header>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: '0 0 7px' }}>
          Làm ra kết quả thật, theo đúng quy trình người trong nghề.
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            margin: 0,
            maxWidth: 640,
          }}
        >
          Mỗi Lab dẫn bạn đi từng bước tới một sản phẩm chạy được — copy theo là chạy, làm tới đâu thấy
          thành quả tới đó.
        </p>
      </div>

      {categories.map((cat) => (
        <section key={cat} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 12px' }}>
            <i
              className={`ti ${CATEGORY_ICON[cat] ?? 'ti-folder'}`}
              style={{ fontSize: 20, color: 'var(--color-text-info)' }}
            />
            <span style={{ fontSize: 17, fontWeight: 500 }}>{CATEGORY_LABEL[cat] ?? cat}</span>
            {CATEGORY_SUB[cat] && (
              <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                — {CATEGORY_SUB[cat]}
              </span>
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))',
              gap: 13,
            }}
          >
            {labs
              .filter((l) => l.category === cat)
              .map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
