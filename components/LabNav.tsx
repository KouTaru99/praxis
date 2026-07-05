'use client';

import Link from 'next/link';
import { Box, NavLink, ScrollArea, Text } from '@mantine/core';
import { COMPLEXITY_LABEL, type Lab, type Stage } from '@/lib/types';

function StageBlock({
  st,
  category,
  labId,
  activeStageId,
  activeStepId,
}: {
  st: Stage;
  category: string;
  labId: string;
  activeStageId: string;
  activeStepId: string;
}) {
  return (
    <Box mb="sm">
      <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6} px="xs" style={{ letterSpacing: '0.03em' }}>
        Chặng {st.order} · {st.title}
      </Text>
      {st.steps.map((s) => {
        const active = s.id === activeStepId && st.id === activeStageId;
        return (
          <NavLink
            key={s.id}
            component={Link}
            href={`/${category}/${labId}/${st.id}/${s.id}`}
            label={s.title}
            active={active}
            variant="light"
            styles={{
              root: { borderRadius: 'var(--mantine-radius-md)', marginBottom: 1 },
              label: { fontSize: 13 },
            }}
          />
        );
      })}
    </Box>
  );
}

export default function LabNav({
  lab,
  category,
  activeStageId,
  activeStepId,
}: {
  lab: Lab;
  category: string;
  activeStageId: string;
  activeStepId: string;
}) {
  // Gom chặng liền kề cùng Phần; chặng không có `part` đứng riêng như cũ (backward compat).
  const groups: { part: string | null; stages: Stage[] }[] = [];
  for (const st of lab.stages) {
    const part = st.part ?? null;
    const last = groups[groups.length - 1];
    if (last && last.part === part && part !== null) last.stages.push(st);
    else groups.push({ part, stages: [st] });
  }

  const common = { category, labId: lab.id, activeStageId, activeStepId };

  return (
    <ScrollArea h="100%" type="scroll">
      <Box px="xs" pb="md">
        <Text fw={600} fz="sm" lh={1.3}>
          {lab.title}
        </Text>
        <Text c="dimmed" fz="xs" mt={2} mb="md">
          {COMPLEXITY_LABEL[lab.complexity]} · ~{lab.est_hours} giờ
        </Text>

        {groups.map((g, i) =>
          g.part === null ? (
            g.stages.map((st) => <StageBlock key={st.id} st={st} {...common} />)
          ) : (
            <NavLink
              key={`${g.part}-${i}`}
              label={g.part}
              defaultOpened={g.stages.some((st) => st.id === activeStageId)}
              childrenOffset={0}
              styles={{
                root: { borderRadius: 'var(--mantine-radius-md)', marginBottom: 2 },
                label: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' },
              }}
            >
              <Box pt={4}>
                {g.stages.map((st) => (
                  <StageBlock key={st.id} st={st} {...common} />
                ))}
              </Box>
            </NavLink>
          )
        )}
      </Box>
    </ScrollArea>
  );
}
