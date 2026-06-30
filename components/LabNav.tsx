import Link from 'next/link';
import { Box, NavLink, ScrollArea, Text } from '@mantine/core';
import { COMPLEXITY_LABEL, type Lab } from '@/lib/types';

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
  return (
    <ScrollArea h="100%" type="scroll">
      <Box px="xs" pb="md">
        <Text fw={600} fz="sm" lh={1.3}>
          {lab.title}
        </Text>
        <Text c="dimmed" fz="xs" mt={2} mb="md">
          {COMPLEXITY_LABEL[lab.complexity]} · ~{lab.est_hours} giờ
        </Text>

        {lab.stages.map((st) => (
          <Box key={st.id} mb="sm">
            <Text fz={11} fw={700} c="dimmed" tt="uppercase" mb={6} px="xs" style={{ letterSpacing: '0.03em' }}>
              Chặng {st.order} · {st.title}
            </Text>
            {st.steps.map((s) => {
              const active = s.id === activeStepId && st.id === activeStageId;
              return (
                <NavLink
                  key={s.id}
                  component={Link}
                  href={`/${category}/${lab.id}/${st.id}/${s.id}`}
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
        ))}
      </Box>
    </ScrollArea>
  );
}
